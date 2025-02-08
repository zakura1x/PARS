<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Validators\Failure;
use Maatwebsite\Excel\Concerns\WithValidation;

class StudentsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    public function model(array $row)
    {
        $row = array_change_key_case(array_map('trim', $row), CASE_LOWER);

        // Check if idNumber already exists
        if (User::where('idNumber', $row['id_number'])->exists()) {
            Log::warning("Skipping row: ID Number {$row['id_number']} already exists.");
            return null; // Skip this row
        }

        $user = User::create([
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'email' => $row['student_email'],
            'idNumber' => $row['id_number'],
            'role' => 'student',
            'password' => Hash::make($row['birthdate_yyyy_mm_dd']),
        ]);

        return new Student([
            'user_id' => $user->id,
            'gender' => strtolower($row['gender']),
            'birth_date' => $row['birthdate_yyyy_mm_dd'],
        ]);
    }

    public function rules(): array
    {
        return [
            'id_number' => 'required|unique:users,idNumber',
            'student_email' => 'required|email|unique:users,email',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'gender' => 'required|in:male,female,other',
            'birthdate_yyyy_mm_dd' => 'required|date|before:today',
        ];
    }
}
