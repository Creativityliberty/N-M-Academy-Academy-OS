<?php

test('public pages return a successful response', function (string $route) {
    $response = $this->get(route($route));
    $response->assertOk();
})->with([
    'home',
    'about',
    'contact',
    'how-it-works',
    'pricing',
    'community.forum',
    'community.events',
    'legal.privacy',
    'legal.cgu',
    'legal.cookies',
    'legal.terms',
]);
