<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [
        // Handles trust proxies like load balancers
        \App\Http\Middleware\TrustProxies::class,

        // Handles CORS headers globally if desired; else rely on api group below
        \Illuminate\Http\Middleware\HandleCors::class,

        // Prevents requests during maintenance mode
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,

        // Validates post size
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,

        // Trims strings input
        \App\Http\Middleware\TrimStrings::class,

        // Converts empty strings to null
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    /**
     * Middleware groups.
     *
     * @var array<string, array<int, class-string|string>>
     */
    protected $middlewareGroups = [
        'web' => [
            // Encrypt cookies for web requests
            \App\Http\Middleware\EncryptCookies::class,

            // Add queued cookies to response
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,

            // Start session for web
            \Illuminate\Session\Middleware\StartSession::class,

            // Share errors from session to views
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,

            // CSRF protection for web
            \App\Http\Middleware\VerifyCsrfToken::class,

            // Substitute route bindings
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            // Throttle API requests
            'throttle:api',

            // Handle CORS for API requests
            \Illuminate\Http\Middleware\HandleCors::class,

            // Substitute route bindings
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * Route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        // Auth middleware
        'auth' => \App\Http\Middleware\Authenticate::class,

        // Auth basic HTTP authentication
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,

        // Authorization checks
        'can' => \Illuminate\Auth\Middleware\Authorize::class,

        // Redirect if authenticated
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,

        // Password confirmation
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,

        // Signed URL validation
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,

        // Request throttling
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,

        // Email verification
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
    ];
}