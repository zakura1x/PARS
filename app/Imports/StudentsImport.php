<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $user = User::create([
            'first_name' => $row['First Name'],
            'last_name' => $row['Last Name'],
            'email' => $row['Student Email'],
            'idNumber' => $row['ID-Number'],
            'role' => 'student',
            'password' => Hash::make($row['birthdate']),
        ]);

        return new Student([
            'user_id' => $user->id,
            'gender' => strtolower($row['gender']),
            'birth_date' => $row['birthdate'],
        ]);
    }
}

