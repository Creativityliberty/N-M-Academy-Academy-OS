<?php

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Account;
use Stripe\AccountLink;
use Stripe\Stripe;

class StripeConnectController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/stripe-connect', [
            'has_account' => (bool) $user->stripe_account_id,
            'stripe_onboarding_completed' => (bool) $user->stripe_onboarding_completed,
        ]);
    }

    public function onboard(Request $request): RedirectResponse
    {
        $user = $request->user();

        Stripe::setApiKey(config('services.stripe.secret'));

        if (! $user->stripe_account_id) {
            $account = Account::create([
                'type' => 'express',
                'country' => 'FR',
                'email' => $user->email,
                'business_type' => 'individual',
                'business_profile' => [
                    'product_description' => 'Vente de formations en ligne sur la plateforme pmindfull.',
                ],
                'capabilities' => [
                    'card_payments' => ['requested' => true],
                    'transfers' => ['requested' => true],
                ],
            ]);

            $user->update(['stripe_account_id' => $account->id]);
        }

        $accountLink = AccountLink::create([
            'account' => $user->stripe_account_id,
            'refresh_url' => route('trainer.stripe-connect.onboard'),
            'return_url' => route('trainer.stripe-connect.return'),
            'type' => 'account_onboarding',
        ]);

        return redirect($accountLink->url);
    }

    public function return(Request $request): RedirectResponse
    {
        $user = $request->user();

        Stripe::setApiKey(config('services.stripe.secret'));

        $account = Account::retrieve($user->stripe_account_id);

        $user->update([
            'stripe_onboarding_completed' => $account->details_submitted,
        ]);

        $message = $account->details_submitted
            ? 'Votre compte Stripe est actif, vous pouvez recevoir des paiements.'
            : 'Onboarding incomplet. Cliquez à nouveau pour finaliser les étapes manquantes.';

        return redirect()->route('trainer.stripe-connect.edit')->with('success', $message);
    }

    public function disconnect(Request $request): RedirectResponse
    {
        // On conserve stripe_account_id — la reconnexion ne refait pas le KYC.
        $request->user()->update(['stripe_onboarding_completed' => false]);

        return redirect()->route('trainer.stripe-connect.edit')
            ->with('success', 'Votre compte Stripe a été déconnecté de la plateforme.');
    }
}
