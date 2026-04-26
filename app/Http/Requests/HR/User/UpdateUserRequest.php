<?php

namespace App\Http\Requests\HR\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'min:6'],
            'roles' => ['array'],
            'cover' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:2048'],
            'avatar' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:2048'],
        ];
    }
}