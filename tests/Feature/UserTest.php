<?php

use function Pest\Laravel\post;

// it('rejects a request with an invalid idNumber', function () {
//     post('/register', [
//         'first_name' => 'Zeus',
//         'last_name' => 'Tenerife',
//         'email' => 'zeus@mail.com',
//         'idNumber' => 'AC-12345', // Invalid format
//         'role' => 'professor',
//         'gender' => 'Male',
//         'birthdate' => '2000-01-01',
//     ])->assertSessionHasErrors(['idNumber']); // Asserts validation failure
// });

it('accepts a request with a valid idNumber', function () {
    post('/register', [
        'first_name' => 'Zeus',
        'last_name' => 'Tenerife',
        'email' => 'zeus@mail.com',
        'idNumber' => '12-12345', // Valid format
        'role' => 'professor',
        'gender' => 'Male',
        'birthdate' => '2000-01-01',
    ])->assertSessionDoesntHaveErrors(); // Asserts no validation errors
});

it('accepts a request with a valid role', function () {
    post('/register', [
        'first_name' => 'Zeus',
        'last_name' => 'Tenerife',
        'email' => 'zeus@mail.com',
        'idNumber' => '12-12345',
        'role' => 'professor', // Valid role
        'gender' => 'Male',
        'birthdate' => '2000-01-01',
    ])->assertSessionDoesntHaveErrors();
});

it('rejects a request with an invalid role', function () {
    post('/register', [
        'first_name' => 'Zeus',
        'last_name' => 'Tenerife',
        'email' => 'zeus@mail.com',
        'idNumber' => '12-12345',
        'role' => 'invalid_role', // Invalid role
        'gender' => 'Male',
        'birthdate' => '2000-01-01',
    ])->assertSessionHasErrors(['role']);
});


