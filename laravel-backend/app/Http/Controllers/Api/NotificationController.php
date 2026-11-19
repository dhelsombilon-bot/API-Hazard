<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success(['data' => [], 'unread_count' => 0]);
    }

    public function markRead(Request $request): JsonResponse
    {
        return $this->success(['ok' => true]);
    }

    public function markAllRead(): JsonResponse
    {
        return $this->success(['ok' => true]);
    }
}
