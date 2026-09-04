<?php

declare(strict_types=1);

namespace App\MissionTower\Http\Controllers;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Services\ApprovalDecisionService;
use App\MissionTower\Services\TowerAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ApprovalController extends Controller
{
    public function __construct(
        private readonly TowerAccess $access,
        private readonly ApprovalDecisionService $decisions,
    ) {}

    public function index(Request $request): Response
    {
        $approvals = $this->access->approvalQuery($request->user())
            ->with(['mission:id,title,owner_id', 'step:id,title,tool', 'decidedBy:id,name'])
            ->orderByRaw("case when status = 'pending' then 0 else 1 end")
            ->latest()
            ->paginate(30)
            ->through(fn (TowerApproval $approval) => [
                'id' => $approval->id,
                'mission' => ['id' => $approval->mission->id, 'title' => $approval->mission->title],
                'stepTitle' => $approval->step->title,
                'tool' => $approval->tool,
                'risk' => $approval->risk,
                'status' => $approval->status,
                'message' => $approval->message,
                'arguments' => $approval->arguments ?? [],
                'requiredPhrase' => $approval->required_phrase,
                'receiptId' => $approval->receipt_id,
                'expiresAt' => $approval->expires_at?->toIso8601String(),
                'decidedBy' => $approval->decidedBy?->name,
                'decidedAt' => $approval->decided_at?->toIso8601String(),
                'createdAt' => $approval->created_at?->toIso8601String(),
            ]);

        return Inertia::render('mission-tower/approvals', ['approvals' => $approvals]);
    }

    public function decide(Request $request, TowerApproval $approval): RedirectResponse
    {
        $this->access->assertApproval($request->user(), $approval);
        $data = $request->validate([
            'decision' => ['required', Rule::in(['approve', 'reject'])],
            'phrase' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $this->decisions->decide($approval, $request->user(), $data['decision'], $data['phrase'] ?? null);
        } catch (Throwable $error) {
            if ($error instanceof \Illuminate\Validation\ValidationException) {
                throw $error;
            }

            return back()->withErrors(['approval' => $error->getMessage()]);
        }

        return redirect()->route('tower.missions.show', $approval->mission_id)->with('success', $data['decision'] === 'approve'
            ? 'Action approuvée et mission reprise.'
            : 'Action refusée; mission arrêtée.');
    }
}
