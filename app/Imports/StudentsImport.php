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
        // Transform the row keys to match your export format
        $row = array_map('trim', $row);

        // Skip empty rows
        if (empty(array_filter($row))) {
            return null;
        }

        try {
            $user = User::create([
                'first_name' => $row['First Name'],
                'last_name' => $row['Last Name'],
                'email' => $row['Student Email'],
                'idNumber' => $row['ID-Number'],
                'role' => 'student',
                'password' => Hash::make($row['Birthdate (YYYY-MM-DD)']),
            ]);

            return new Student([
                'user_id' => $user->id,
                'birth_date' => $row['Birthdate (YYYY-MM-DD)'],
                'gender' => strtolower($row['Gender']),
            ]);
        } catch (\Exception $e) {
            Log::error('Import error: '.$e->getMessage());
            return null;
        }
    }
}

