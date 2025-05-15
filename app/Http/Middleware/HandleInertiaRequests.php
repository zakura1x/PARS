<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth.user' => fn() => $request->user() ? $request->user()->only('id', 'full_name', 'email', 'role', 'idNumber') : null,
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                // Add these for import handling
                'import_errors' => fn() => $request->session()->get('import_errors'),
                'import_success' => fn() => $request->session()->get('import_success'),
                'import_total' => fn() => $request->session()->get('import_total'),
            ],
            // Optional: share global error bag if you're using validation errors
            'errors' => fn() => $request->session()->get('errors') ? $request->session()->get('errors')->getBag('default')->getMessages() : [],
        ]);
    }
}
