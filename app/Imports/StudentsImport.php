<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class StudentsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure
{
    use SkipsErrors, SkipsFailures;

    private $rowCount = 0;
    private $successCount = 0;

    public function model(array $row)
    {
        $this->rowCount++;
        
        // Skip empty rows
        if (empty(array_filter($row))) {
            return null;
        }

        try {
            $user = User::create([
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name'],
                'email' => $row['student_email'],
                'idNumber' => $row['id_number'],
                'role' => 'student',
                'password' => Hash::make($row['birthdate_yyyy_mm_dd']),
            ]);

            $birthDate = $row['birthdate_yyyy_mm_dd'];
            if (is_numeric($birthDate)) {
                $birthDate = Carbon::instance(
                    ExcelDate::excelToDateTimeObject($birthDate)
                )->format('Y-m-d');
            }

            $this->successCount++;
            
            return new Student([
                'user_id' => $user->id,
                'birth_date' => $birthDate,
                'gender' => strtolower($row['gender']),
            ]);
            
        } catch (\Exception $e) {
            // Use the trait's error handling
            $this->onError($e);
            return null;
        }
    }
    
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'student_email' => 'required|email|unique:users,email',
            'id_number' => 'required|unique:users,idNumber',
            'birthdate_yyyy_mm_dd' => 'required',
            'gender' => 'required|in:male,female,other,Male,Female,Other',
        ];
    }
    
    public function getSuccessCount()
    {
        return $this->successCount;
    }
    
    public function getTotalCount()
    {
        return $this->rowCount;
    }
}