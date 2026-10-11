package com.campusvault.controller;

import com.campusvault.dto.ApiResponse;
import com.campusvault.dto.StudentRequest;
import com.campusvault.dto.StudentResponse;
import com.campusvault.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Admin endpoints
    @GetMapping("/admin/students")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents(@RequestParam(required = false) String query) {
        List<StudentResponse> students = studentService.getAllStudents(query);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    @GetMapping("/admin/students/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student details retrieved", student));
    }

    @PostMapping("/admin/students")
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@Valid @RequestBody StudentRequest request) {
        StudentResponse created = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Student created successfully", created));
    }

    @PutMapping("/admin/students/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(@PathVariable Long id, @RequestBody StudentRequest request) {
        StudentResponse updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    // Student profile endpoint
    @GetMapping("/student/profile")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentProfile(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        StudentResponse student = studentService.getStudentByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Student profile loaded", student));
    }
}
