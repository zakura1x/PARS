<?php

use Illuminate\Support\Facades\Schedule;
use App\Jobs\AutoSubmitPracticeAssessment;
use App\Jobs\AutoSubmitAssessment;
use Illuminate\Support\Facades\Artisan;

// Register commands
Artisan::command('assessment:auto-submit', function () {
    dispatch(new AutoSubmitPracticeAssessment);
    dispatch(new AutoSubmitAssessment);
    $this->info('Auto-submit jobs dispatched!');
})->purpose('Dispatch assessment auto-submit jobs');

// Schedule them to run every minute
Schedule::command('assessment:auto-submit')->everyMinute();