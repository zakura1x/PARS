<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  ...$roles
     * @return \Symfony\Component\HttpFoundation\Response
    */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Check if the user is authenticated
        $user = $request->user();

        // If the user is not authenticated, abort with a 403 Forbidden response
        if (!$user) {
            abort(403, 'Unauthorized access');
        }

        // Check if the user's role is one of the allowed roles
        if (!in_array($user->role, $roles)) {
            abort(403, 'Unauthorized access');
        }

        // Proceed with the request if the user is authenticated and has the correct role
        return $next($request);
    }
}
