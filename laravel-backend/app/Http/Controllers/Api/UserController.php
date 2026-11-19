<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->isAdmin()) {
            return $this->forbidden();
        }

        $query = User::with('role');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($roleId = $request->query('role_id')) {
            $query->where('role_id', $roleId);
        }

        $perPage = min((int) $request->query('per_page', 15), 100);
        $users = $query->orderBy('last_name')->paginate($perPage);

        return $this->success([
            'data'       => UserResource::collection($users->items()),
            'pagination' => [
                'total'        => $users->total(),
                'per_page'     => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
            ],
        ]);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);
        $user->load('role');

        return $this->created(new UserResource($user), 'User created successfully.');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isAdmin() && $request->user()->user_id !== $id) {
            return $this->forbidden();
        }

        $user = User::with('role')->find($id);

        if (! $user) {
            return $this->notFound('User not found.');
        }

        return $this->success(new UserResource($user));
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = User::find($id);

        if (! $user) {
            return $this->notFound('User not found.');
        }

        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        $user->load('role');

        return $this->success(new UserResource($user), 'User updated successfully.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->isAdmin()) {
            return $this->forbidden();
        }

        $user = User::find($id);

        if (! $user) {
            return $this->notFound('User not found.');
        }

        if ($user->user_id === $request->user()->user_id) {
            return $this->error('You cannot delete your own account.', 422);
        }

        $user->delete();

        return $this->success(null, 'User deleted successfully.');
    }
}
