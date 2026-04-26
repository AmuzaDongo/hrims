<?php

namespace App\Http\Requests\HR\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:255', 'unique:users,name'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'roles' => ['array'],
            'cover' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:2048'],
            'avatar' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:2048'],
        ];
    }
}