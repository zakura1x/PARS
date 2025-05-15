<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class ImportException extends Exception
{
    /**
     * The collection of errors.
     *
     * @var \Illuminate\Support\Collection
     */
    protected $errors;

    /**
     * The row numbers where errors occurred.
     *
     * @var array
     */
    protected $failedRows = [];

    /**
     * Create a new import exception instance.
     *
     * @param string $message
     * @param array|\Illuminate\Support\Collection $errors
     * @param int $code
     * @param \Exception|null $previous
     */
    public function __construct($message = "", $errors = [], $code = 0, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);

        $this->errors = is_array($errors) ? collect($errors) : $errors;
        $this->extractFailedRows();
    }

    /**
     * Extract row numbers from the errors.
     */
    protected function extractFailedRows()
    {
        $this->errors->each(function ($error) {
            if (isset($error['row'])) {
                $this->failedRows[] = $error['row'];
            }
        });

        $this->failedRows = array_unique($this->failedRows);
    }

    /**
     * Get all errors.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * Get the failed row numbers.
     *
     * @return array
     */
    public function getFailedRows()
    {
        return $this->failedRows;
    }

    /**
     * Get the first error message.
     *
     * @return string|null
     */
    public function getFirstError()
    {
        return $this->errors->first()['message'] ?? null;
    }

    /**
     * Convert validation exception to ImportException.
     *
     * @param \Illuminate\Validation\ValidationException $exception
     * @param int $rowNumber
     * @return static
     */
    public static function fromValidation(ValidationException $exception, $rowNumber)
    {
        $errors = collect($exception->errors())->map(function ($messages, $attribute) use ($rowNumber) {
            return [
                'row' => $rowNumber,
                'attribute' => $attribute,
                'message' => implode(' ', $messages),
                'type' => 'validation'
            ];
        });

        return new static(
            "Validation failed for row {$rowNumber}",
            $errors,
            $exception->getCode(),
            $exception
        );
    }

    /**
     * Convert a generic exception to ImportException.
     *
     * @param \Exception $exception
     * @param int $rowNumber
     * @return static
     */
    public static function fromGeneric(Exception $exception, $rowNumber)
    {
        return new static(
            "Error on row {$rowNumber}: {$exception->getMessage()}",
            [[
                'row' => $rowNumber,
                'message' => $exception->getMessage(),
                'type' => 'error'
            ]],
            $exception->getCode(),
            $exception
        );
    }

    /**
     * Convert the exception to an array.
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'message' => $this->getMessage(),
            'errors' => $this->errors->toArray(),
            'failed_rows' => $this->failedRows,
        ];
    }
}