<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $row = array_change_key_case(array_map('trim', $row), CASE_LOWER);

        // Log the keys to debug
        //Log::info('Row keys: ', array_keys($row));

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
}

