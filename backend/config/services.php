<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'pronofoot' => [
        'odds_driver' => env('ODDS_DRIVER', 'fake'),
        'football_driver' => env('FOOTBALL_DRIVER', 'fake'),
        'fake_scenario' => env('FAKE_PROVIDER_SCENARIO', 'baseline'),
        'notifications' => [
            'mode' => env('NOTIFICATION_MODE', 'fake'),
            'channel' => env('NOTIFICATION_CHANNEL', 'log'),
            'fallback' => env('NOTIFICATION_FALLBACK', 'none'),
            'fake_fail_channels' => [],
        ],
    ],

    'odds_api' => [
        'api_key' => env('ODDS_API_KEY'),
    ],

    'football_api' => [
        'probe_url' => env('API_FOOTBALL_PROBE_URL'),
        'api_key' => env('API_FOOTBALL_API_KEY'),
        'api_key_header' => env('API_FOOTBALL_API_KEY_HEADER'),
        'timeout' => env('API_FOOTBALL_TIMEOUT', 10),
    ],

];
