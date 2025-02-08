<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;

class StudentsTemplateExport implements FromArray, WithHeadings, WithEvents
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

                // Define dropdown values for Gender
                $validation = $sheet->getCell('E2')->getDataValidation();
                $validation->setType(DataValidation::TYPE_LIST);
                $validation->setErrorStyle(DataValidation::STYLE_STOP);
                $validation->setAllowBlank(false);
                $validation->setShowDropDown(true);
                $validation->setFormula1('"Male,Female,Other"');

                // Apply the validation to multiple rows (e.g., E2:E100)
                for ($i = 2; $i <= 100; $i++) {
                    $cell = "E$i";
                    $sheet->getCell($cell)->setDataValidation(clone $validation);
                }
            },
        ];
    }
}
