<?php

declare(strict_types=1);
return array(
  'inertiajs/inertia-laravel' =>
    array(
      'providers' =>
        array(
          0 => 'Inertia\\ServiceProvider',
        ),
    ),
  'laravel/pail' =>
    array(
      'providers' =>
        array(
          0 => 'Laravel\\Pail\\PailServiceProvider',
        ),
    ),
  'laravel/sail' =>
    array(
      'providers' =>
        array(
          0 => 'Laravel\\Sail\\SailServiceProvider',
        ),
    ),
  'laravel/sanctum' =>
    array(
      'providers' =>
        array(
          0 => 'Laravel\\Sanctum\\SanctumServiceProvider',
        ),
    ),
  'laravel/scout' =>
    array(
      'providers' =>
        array(
          0 => 'Laravel\\Scout\\ScoutServiceProvider',
        ),
    ),
  'laravel/tinker' =>
    array(
      'providers' =>
        array(
          0 => 'Laravel\\Tinker\\TinkerServiceProvider',
        ),
    ),
  'laravel/wayfinder' =>
    array(
      'providers' =>
        array(
          0 => 'Laravel\\Wayfinder\\WayfinderServiceProvider',
        ),
    ),
  'nesbot/carbon' =>
    array(
      'providers' =>
        array(
          0 => 'Carbon\\Laravel\\ServiceProvider',
        ),
    ),
  'nunomaduro/collision' =>
    array(
      'providers' =>
        array(
          0 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
        ),
    ),
  'nunomaduro/termwind' =>
    array(
      'providers' =>
        array(
          0 => 'Termwind\\Laravel\\TermwindServiceProvider',
        ),
    ),
  'pestphp/pest-plugin-laravel' =>
    array(
      'providers' =>
        array(
          0 => 'Pest\\Laravel\\PestServiceProvider',
        ),
    ),
  'stancl/tenancy' =>
    array(
      'aliases' =>
        array(
          'Tenancy' => 'Stancl\\Tenancy\\Facades\\Tenancy',
          'GlobalCache' => 'Stancl\\Tenancy\\Facades\\GlobalCache',
        ),
      'providers' =>
        array(
          0 => 'Stancl\\Tenancy\\TenancyServiceProvider',
        ),
    ),
  'tightenco/ziggy' =>
    array(
      'providers' =>
        array(
          0 => 'Tighten\\Ziggy\\ZiggyServiceProvider',
        ),
    ),
);