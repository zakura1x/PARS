<?php

namespace App\Http\Controllers;

use App\Exports\StudentsTemplateExport;
use App\Imports\StudentsImport;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchQuery = $request->input('search', '');

        $students = Student::with('user')
            ->when($searchQuery, function ($query, $searchQuery) {
                $query->whereHas('user', function ($q) use ($searchQuery) {
                    $q->where('first_name', 'like', '%' . $searchQuery . '%')
                      ->orWhere('last_name', 'like', '%' . $searchQuery . '%')
                      ->orWhere('email', 'like', '%' . $searchQuery . '%');
                });
            })
            ->latest()
            ->paginate(10);

        return inertia('StudentManagement/StudentManagementIndex', [
            'students' => $students,
            'searchQuery' => $searchQuery
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('StudentManagement/CreateStudent');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the user data
        $validateUser = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'idNumber' => ['required', 'string', 'regex:/^[0-9]{2}-[0-9]{5}$/', 'unique:users,idNumber'],
            //'role' => 'required|string|in:professor,program_head,dean',
            'gender' => 'required|string|in:Male,Female,Other',
            'birthdate' => 'required|date|before:today',
        ]);

        // Create the user
        $user = User::create([
            'first_name' => $validateUser['first_name'],
            'last_name' => $validateUser['last_name'],
            'email' => $validateUser['email'],
            'idNumber' => $validateUser['idNumber'],
            'role' => 'student',
            'password' => Hash::make($validateUser['birthdate']),
        ]);

        //Create the student details
        $student = Student::create([
            'user_id' => $user->id,
            'gender' => $validateUser['gender'],
            'birth_date' => $validateUser['birthdate'],
        ]);

        return to_route('student.list')->with('message', 'Student was Added Successfully');
    }

    public function massUploadStudentForm(){
        return inertia('StudentManagement/MassUploadStudent');
    }

    public function exportTemplate(){
        return Excel::download(new StudentsTemplateExport, 'students_template.xlsx');
    }


    public function massUploadStudent(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        $import = new StudentsImport();
        
        try {
            Excel::import($import, $request->file('file'));
            
            $total = $import->getTotalCount();
            $success = $import->getSuccessCount();
            $failures = $import->failures();
            $errors = $import->errors();
            
            // Make sure we only return errors if they exist
            // if ($errors->isNotEmpty() || $failures->isNotEmpty()) {
            //     return redirect()
            //         ->back()
            //         ->with('import_errors', array_merge(
            //             $errors->toArray(),
            //             $failures->toArray()
            //         ))
            //         ->with('import_success', $success)
            //         ->with('import_total', $total);
            // }
            
            return to_route('student.list')
                ->with('message', "Successfully imported {$success} students");
                
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Import failed: ' . $e->getMessage());
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::find($id);
        $student = Student::where('user_id', $id)->first();

        return response()->json([
            'user' => $user,
            'student' => $student
        ]);
    }

    /**
     * Fetch the student details for editing.
     */
    public function edit($id)
    {
        $user = User::find($id);
        $student = Student::where('user_id', $id)->first();

        return Inertia::render('StudentManagement/EditStudent', [
            'user' => $user,
            'student' => $student
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        //also get the student details
        $student = Student::where('user_id', $id)->first();

        //Validate the data
        $validateData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'. $user->id,
            'idNumber' => ['required', 'string', 'regex:/^[0-9]{2}-[0-9]{5}$/', 'unique:users,idNumber,'. $user->id],
            'gender' => 'required|string|in:Male,Female,Other',
            'birthdate' => 'required|date|before:today',
        ]);

        $user->update([
            'first_name'=> $validateData['first_name'],
            'last_name'=> $validateData['last_name'],
            'email'=> $validateData['email'],
            'idNumber'=> $validateData['idNumber'],
        ]);

        $student->update([
            'gender'=> $validateData['gender'],
            'birth_date'=> $validateData['birthdate'],
        ]);

        return to_route('student.list')->with('message', 'Student was Updated Successfully');
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //Find the user
        $user = User::findOrFail($id);
        //Find the student
        $student = Student::where('user_id', $user->id)->delete();
        $user->delete();

        return to_route('student.list')->with('message', 'Student was Deleted Successfully');
    }
}
