<?php

use function Pest\Laravel\put;

it('Accepts the edit Value', function () {
    put('/users/edit/{2}', [
        'id' => '2',
        'first_name' => 'Zeus',
        'last_name' => 'Tenerife',
        'email' => 'zeus@mail.com',
        'role' => 'professor',
        'gender' => 'Male',
        'birthdate' => '2000-01-01',
    ])->assertSessionDoesntHaveErrors(); // Asserts validation failure
});

