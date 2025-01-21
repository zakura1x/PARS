<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use App\Models\Subject;
use App\Models\Topics;

class QuestionTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Template' => new TemplateSheet(),
            'Dropdowns' => new DropdownSheet(),
        ];
    }
}

class TemplateSheet implements WithEvents
{
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Set headers
                $sheet->setCellValue('A1', 'subject_name');
                $sheet->setCellValue('B1', 'topic_name');
                $sheet->setCellValue('C1', 'format_type');
                $sheet->setCellValue('D1', 'purpose_type');
                $sheet->setCellValue('E1', 'difficulty');
                $sheet->setCellValue('F1', 'question_text');
                $sheet->setCellValue('G1', 'options');
                $sheet->setCellValue('H1', 'correct_answer');
                $sheet->setCellValue('I1', 'weight');

                // Example entries
                // $sheet->setCellValue('A2', 'Mathematics');
                // $sheet->setCellValue('B2', 'Algebra');
                // $sheet->setCellValue('C2', 'multiple_choice');
                // $sheet->setCellValue('D2', 'practice');
                // $sheet->setCellValue('E2', 'understanding');
                // $sheet->setCellValue('F2', 'What is 2 + 2?');
                // $sheet->setCellValue('G2', '4,5,6,7');
                // $sheet->setCellValue('H2', '4');
                // $sheet->setCellValue('I2', '1');

                // $sheet->setCellValue('A3', 'Science');
                // $sheet->setCellValue('B3', 'Biology');
                // $sheet->setCellValue('C3', 'true_or_false');
                // $sheet->setCellValue('D3', 'assessment');
                // $sheet->setCellValue('E3', 'remembering');
                // $sheet->setCellValue('F3', 'The heart is a muscle.');
                // $sheet->setCellValue('G3', 'true,false');
                // $sheet->setCellValue('H3', 'true');
                // $sheet->setCellValue('I3', '1');

                // Apply dropdowns for specific columns
                $this->applyDropdown($sheet, 'C2:C1000', "'Worksheet 1'!A2:A5"); // format_type
                $this->applyDropdown($sheet, 'D2:D1000', "'Worksheet 1'!B2:B4"); // purpose_type
                $this->applyDropdown($sheet, 'E2:E1000', "'Worksheet 1'!C2:C7"); // difficulty
                $this->applyDropdown($sheet, 'A2:A1000', "'Worksheet 1'!D2:D20"); // subject_name
                $this->applyDropdown($sheet, 'B2:B1000', "'Worksheet 1'!E2:E20"); // topic_name
            },
        ];
    }

    private function applyDropdown(Worksheet $sheet, string $range, string $source)
    {
        // Create a data validation object
        $validation = new DataValidation();
        $validation->setType(DataValidation::TYPE_LIST);
        $validation->setErrorStyle(DataValidation::STYLE_STOP);
        $validation->setAllowBlank(false);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setErrorTitle('Invalid Input');
        $validation->setError('Please select a value from the dropdown.');
        $validation->setFormula1($source); // The source for the dropdown (e.g., 'Dropdowns!A2:A5')

        // Apply the data validation to each cell in the range
        foreach (\PhpOffice\PhpSpreadsheet\Cell\Coordinate::extractAllCellReferencesInRange($range) as $cellReference) {
            $sheet->getCell($cellReference)->setDataValidation(clone $validation);
        }
    }


}

class DropdownSheet implements WithEvents
{
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // Set dropdown values
                $sheet->setCellValue('A1', 'format_type');
                $sheet->setCellValue('A2', 'multiple_choice');
                $sheet->setCellValue('A3', 'enumeration');
                $sheet->setCellValue('A4', 'true_or_false');
                $sheet->setCellValue('A5', 'fill_in_the_blank');

                $sheet->setCellValue('B1', 'purpose_type');
                $sheet->setCellValue('B2', 'practice');
                $sheet->setCellValue('B3', 'assessment');
                $sheet->setCellValue('B4', 'examination');

                $sheet->setCellValue('C1', 'difficulty');
                $sheet->setCellValue('C2', 'remembering');
                $sheet->setCellValue('C3', 'understanding');
                $sheet->setCellValue('C4', 'applying');
                $sheet->setCellValue('C5', 'analyzing');
                $sheet->setCellValue('C6', 'evaluating');
                $sheet->setCellValue('C7', 'create');

                $sheet->setCellValue('D1', 'subject_name');
                $subjects = Subject::all();
                $row = 2;
                foreach ($subjects as $subject) {
                    $sheet->setCellValue("D$row", $subject->name);
                    $row++;
                }

                $sheet->setCellValue('E1', 'topic_name');
                $topics = Topics::all();
                $row = 2;
                foreach ($topics as $topic) {
                    $sheet->setCellValue("E$row", $topic->name);
                    $row++;
                }
            },
        ];
    }
}

