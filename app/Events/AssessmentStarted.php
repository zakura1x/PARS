<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AssessmentStarted implements ShouldBroadcast

{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $assessment;

    /**
     * Create a new event instance.
     */
    public function __construct($assessment)
    {
        $this->assessment = $assessment;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * 
     */
    public function broadcastOn()
    {
        return new Channel('assessment.' . $this->assessment->id);
    }

    public function broadcastAs()
    {
        return 'assessment.started';
    }
}
