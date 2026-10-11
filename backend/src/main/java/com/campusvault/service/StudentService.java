package com.campusvault.service;

import com.campusvault.dto.StudentRequest;
import com.campusvault.dto.StudentResponse;
import com.campusvault.entity.Role;
import com.campusvault.entity.Student;
import com.campusvault.entity.User;
import com.campusvault.exception.ConflictException;
import com.campusvault.exception.ResourceNotFoundException;
import com.campusvault.repository.CertificateRepository;
import com.campusvault.repository.StudentRepository;
import com.campusvault.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository,
                          CertificateRepository certificateRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.certificateRepository = certificateRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<StudentResponse> getAllStudents(String query) {
        List<Student> students;
        if (query != null && !query.isBlank()) {
            students = studentRepository.searchStudents(query.trim());
        } else {
            students = studentRepository.findAllByOrderByCreatedAtDesc();
        }

        return students.stream()
                .map(s -> StudentResponse.fromEntity(s, certificateRepository.findByStudentIdOrderByIssueDateDesc(s.getId()).size()))
                .collect(Collectors.toList());
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return StudentResponse.fromEntity(student, certificateRepository.findByStudentIdOrderByIssueDateDesc(student.getId()).size());
    }

    public StudentResponse getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
        return StudentResponse.fromEntity(student, certificateRepository.findByStudentIdOrderByIssueDateDesc(student.getId()).size());
    }

    public StudentResponse getStudentByEmail(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for email: " + email));
        return StudentResponse.fromEntity(student, certificateRepository.findByStudentIdOrderByIssueDateDesc(student.getId()).size());
    }

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("User account with email " + email + " already exists");
        }

        String studentCode = request.getStudentId();
        if (studentCode == null || studentCode.isBlank()) {
            studentCode = "AU-" + LocalDate.now().getYear() + "-" + String.format("%05d", (int)(Math.random() * 90000 + 10000));
        } else {
            studentCode = studentCode.trim().toUpperCase();
            if (studentRepository.existsByStudentId(studentCode)) {
                throw new ConflictException("Student ID " + studentCode + " already exists");
            }
        }

        String rawPassword = request.getPassword() != null && !request.getPassword().isBlank() ? request.getPassword() : "Student@123";
        User user = new User(
                email,
                passwordEncoder.encode(rawPassword),
                request.getFullName().trim(),
                Role.ROLE_STUDENT
        );
        User savedUser = userRepository.save(user);

        Student student = new Student(
                studentCode,
                savedUser,
                request.getFullName().trim(),
                email,
                request.getCollege().trim(),
                request.getDepartment().trim(),
                request.getAcademicYear().trim()
        );
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            student.setStatus(request.getStatus().trim().toUpperCase());
        }

        Student savedStudent = studentRepository.save(student);
        return StudentResponse.fromEntity(savedStudent, 0);
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            student.setFullName(request.getFullName().trim());
            student.getUser().setFullName(request.getFullName().trim());
        }
        if (request.getCollege() != null && !request.getCollege().isBlank()) {
            student.setCollege(request.getCollege().trim());
        }
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            student.setDepartment(request.getDepartment().trim());
        }
        if (request.getAcademicYear() != null && !request.getAcademicYear().isBlank()) {
            student.setAcademicYear(request.getAcademicYear().trim());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            student.setStatus(request.getStatus().trim().toUpperCase());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            student.getUser().setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(student.getUser());
        Student updated = studentRepository.save(student);
        return StudentResponse.fromEntity(updated, certificateRepository.findByStudentIdOrderByIssueDateDesc(updated.getId()).size());
    }
}
