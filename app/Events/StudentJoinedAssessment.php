<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class StudentJoinedAssessment
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $student;
    public $assessmentId;

    public function __construct($student, $assessmentId)
    {
        $this->student = $student;
        $this->assessmentId = $assessmentId;
    }

    public function broadcastOn()
    {
        return new Channel("assessment.{$this->assessmentId}");
    }

    public function broadcastAs()
    {
        return 'student.joined';
    }
}

