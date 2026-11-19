<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanEdit
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->canEdit()) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Edit access required.',
            ], 403);
        }

        return $next($request);
    }
}
