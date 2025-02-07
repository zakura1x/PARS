<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Events\AfterSheet;

class StudentsTemplateExport implements FromArray, WithHeadings
{
    public function array(): array
    {
        return [
            ['John', 'Doe', 'johndoe@example.com', '23-12345', 'Male', '2000-05-12'],
            ['Jane', 'Smith', 'janesmith@example.com', '24-67890', 'Female', '2001-08-20'],
        ];
    }

    public function headings(): array
    {
        return [
            'First Name',
            'Last Name',
            'Student Email',
            'ID-Number',
            'Gender',
            'Birthdate (YYYY-MM-DD)',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                
                // Define the dropdown values for Gender
                $validation = $sheet->getCell('E2')->getDataValidation();
                $validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
                $validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_INFORMATION);
                $validation->setAllowBlank(false);
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                $validation->setShowDropDown(true);
                $validation->setFormula1('"Male,Female,Other"');

                // Apply the validation to multiple rows (e.g., 100 rows)
                for ($i = 2; $i <= 100; $i++) {
                    $sheet->getCell("E$i")->setDataValidation(clone $validation);
                }
            },
        ];
    }
}

