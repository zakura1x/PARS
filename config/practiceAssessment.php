<?php
// config/assessment.php

return [
    'assessment' => [
        // Base values per topic
        'base_items_per_topic' => 7,
        'base_minutes_per_item' => 1.2,
        
        // Proficiency level multipliers
        'proficiency_multipliers' => [
            'beginner' => [
                'items' => 1.4,
                'time' => 1.5
            ],
            'intermediate' => [
                'items' => 1.1,
                'time' => 1.1
            ],
            'advanced' => [
                'items' => 0.8,
                'time' => 0.8
            ]
        ],
        
        // Minimum and maximum values
        'min_items' => 10,
        'max_items' => 50,
        'min_time' => 15,
        'max_time' => 120
    ]
];