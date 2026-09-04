<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Factory\AcademyFactoryBlueprintBuilder;
use App\Factory\AcademyFactoryCapabilityRegistry;
use App\Factory\AcademyFactoryTemplateRegistry;
use App\Http\Controllers\Controller;
use App\Jobs\ProvisionAcademyDeployment;
use App\Jobs\VerifyAcademyDeployment;
use App\Models\AcademyFactoryDeployment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AcademyFactoryController extends Controller
{
    public function index(AcademyFactoryTemplateRegistry $templates, AcademyFactoryCapabilityRegistry $capabilities): Response
    {
        $this->ensureEnabled();
        return Inertia::render('admin/factory/index', [
            'templates' => $templates->all(),
            'capabilityProfiles' => $capabilities->all(),
            'source' => [
                'mode'=>config('factory.coolify.source_mode'),
                'repository'=>config('factory.coolify.git_repository'),
                'branch'=>config('factory.coolify.git_branch'),
                'serverConfigured'=>filled(config('factory.coolify.server_uuid')),
            ],
            'deployments' => AcademyFactoryDeployment::query()->latest()->limit(50)->get()->map(fn (AcademyFactoryDeployment $deployment) => [
                'id'=>$deployment->id,
                'receiptId'=>$deployment->receipt_id,
                'clientName'=>$deployment->client_name,
                'templateKey'=>$deployment->template_key,
                'domain'=>$deployment->domain,
                'status'=>$deployment->status,
                'phase'=>$deployment->phase,
                'steps'=>$deployment->steps ?: [],
                'applicationUuid'=>$deployment->coolify_application_uuid,
                'deploymentUuid'=>$deployment->coolify_deployment_uuid,
                'lastError'=>$deployment->last_error,
                'completedAt'=>$deployment->completed_at?->toIso8601String(),
                'liveUrl'=>'https://'.$deployment->domain,
            ])->values(),
        ]);
    }

    public function store(Request $request, AcademyFactoryBlueprintBuilder $builder, AcademyFactoryTemplateRegistry $templates, AcademyFactoryCapabilityRegistry $capabilities): RedirectResponse
    {
        $this->ensureEnabled();
        $validated = $request->validate([
            'client_name'=>['required','string','max:180'],
            'short_name'=>['nullable','string','max:12'],
            'descriptor'=>['nullable','string','max:180'],
            'domain'=>['required','string','max:253','regex:/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i', Rule::unique('academy_factory_deployments','domain')],
            'template_key'=>['required','string', Rule::in(collect($templates->all())->pluck('key')->all())],
            'capability_profile'=>['required','string', Rule::in(collect($capabilities->all())->pluck('key')->all())],
            'logo_url'=>['nullable','url:http,https','max:2048'],
            'theme'=>['nullable','array'],
            'theme.primary'=>['nullable','regex:/^#[0-9a-fA-F]{6}$/'],
            'theme.secondary'=>['nullable','regex:/^#[0-9a-fA-F]{6}$/'],
            'theme.accent'=>['nullable','regex:/^#[0-9a-fA-F]{6}$/'],
            'features'=>['nullable','array:community,events,ai,tutor,sales,pages,mcp,tower,assessments,assignments,completion,certificates'],
            'features.*'=>['boolean'],
            'learning'=>['nullable','array'],
            'learning.require_all_accessible_lessons'=>['nullable','boolean'],
            'learning.issuer_name'=>['nullable','string','max:160'],
            'learning.certificate_title'=>['nullable','string','max:160'],
            'learning.public_verification'=>['nullable','boolean'],
            'learning.pdf_download'=>['nullable','boolean'],
            'learning.student_sharing'=>['nullable','boolean'],
            'owner'=>['required','array'],
            'owner.name'=>['required','string','max:180'],
            'owner.email'=>['required','email','max:255'],
            'owner.password'=>['required','string','min:12','max:255'],
            'ai'=>['nullable','array'],
            'ai.provider'=>['nullable', Rule::in(['disabled','openai','deepseek'])],
            'ai.model'=>['nullable','string','max:180'],
            'ai.openai_api_key'=>['nullable','string','max:1000','required_if:ai.provider,openai','required_if:ai.image_provider,openai'],
            'ai.deepseek_api_key'=>['nullable','string','max:1000','required_if:ai.provider,deepseek'],
            'ai.image_provider'=>['nullable', Rule::in(['disabled','gemini','openai'])],
            'ai.image_model'=>['nullable', Rule::in(['gemini-3.1-flash-lite-image','gemini-3.1-flash-image','gemini-3-pro-image'])],
            'ai.image_size'=>['nullable', Rule::in(['1K','2K','4K'])],
            'ai.image_prompt_preset'=>['nullable', Rule::in(['academy-premium','editorial','cinematic','minimal'])],
            'ai.gemini_api_key'=>['nullable','string','max:1000','required_if:ai.image_provider,gemini'],
            'ai.embedding_provider'=>['nullable', Rule::in(['disabled','openai'])],
            'stripe'=>['nullable','array'],
            'stripe.key'=>['nullable','string','max:1000'],
            'stripe.secret'=>['nullable','string','max:1000'],
            'stripe.webhook_secret'=>['nullable','string','max:1000'],
            'stripe.client_id'=>['nullable','string','max:1000'],
            'stripe.platform_fee_bps'=>['nullable','integer','min:0','max:10000'],
            'stripe.affiliate_bps'=>['nullable','integer','min:0','max:10000'],
            'stripe.currency'=>['nullable','string','size:3'],
            'mail'=>['nullable','array'],
            'mail.mailer'=>['nullable','string','max:50'],
            'mail.host'=>['nullable','string','max:255'],
            'mail.port'=>['nullable','integer','min:1','max:65535'],
            'mail.username'=>['nullable','string','max:255'],
            'mail.password'=>['nullable','string','max:1000'],
            'mail.from_address'=>['nullable','email','max:255'],
            'mail.from_name'=>['nullable','string','max:255'],
        ]);

        $built = $builder->build($validated);
        $deployment = AcademyFactoryDeployment::create([
            'created_by'=>$request->user()->id,
            'receipt_id'=>(string) Str::uuid(),
            'client_name'=>$validated['client_name'],
            'slug'=>data_get($built, 'blueprint.slug'),
            'template_key'=>$validated['template_key'],
            'domain'=>data_get($built, 'blueprint.domain'),
            'status'=>'draft',
            'phase'=>'draft',
            'blueprint'=>$built['blueprint'],
            'secrets'=>$built['secrets'],
            'steps'=>['blueprint'=>['status'=>'done','message'=>'Configuration generated','at'=>now()->toIso8601String()]],
        ]);

        return back()->with('success', "Blueprint {$deployment->receipt_id} créé. Vérifiez puis lancez le provisioning.");
    }

    public function provision(AcademyFactoryDeployment $deployment): RedirectResponse
    {
        $this->ensureEnabled();
        abort_if($deployment->completed_at, 422, 'Cette Academy est déjà live.');
        ProvisionAcademyDeployment::dispatch($deployment->id);
        $deployment->forceFill(['status'=>'queued'])->save();
        return back()->with('success', 'Provisioning mis en file.');
    }

    public function verify(AcademyFactoryDeployment $deployment): RedirectResponse
    {
        $this->ensureEnabled();
        VerifyAcademyDeployment::dispatch($deployment->id);
        return back()->with('success', 'Vérification demandée.');
    }

    private function ensureEnabled(): void
    {
        abort_unless((bool) config('factory.enabled'), 404);
    }
}
