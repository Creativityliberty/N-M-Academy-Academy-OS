<?php

use Inertia\Testing\AssertableInertia as Assert;

test('public pages expose the academy brand and theme configuration', function () {
    config()->set('academy.name', 'Maison Exemple');
    config()->set('academy.short_name', 'ME');
    config()->set('academy.descriptor', 'Learning OS');
    config()->set('academy.logo_url', null);
    config()->set('academy.theme.preset', 'soft-glass');
    config()->set('academy.theme.primary', '#6F7F70');
    config()->set('academy.theme.radius', '1rem');

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('academy.name', 'Maison Exemple')
            ->where('academy.short_name', 'ME')
            ->where('academy.descriptor', 'Learning OS')
            ->where('academy.logoUrl', null)
            ->where('academy.theme.preset', 'soft-glass')
            ->where('academy.theme.primary', '#6F7F70')
            ->where('academy.theme.radius', '1rem')
        );
});
