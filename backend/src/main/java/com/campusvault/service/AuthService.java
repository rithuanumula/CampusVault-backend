package com.campusvault.service;

import com.campusvault.dto.*;
import com.campusvault.entity.Role;
import com.campusvault.entity.Student;
import com.campusvault.entity.User;
import com.campusvault.exception.BadRequestException;
import com.campusvault.exception.ConflictException;
import com.campusvault.exception.ResourceNotFoundException;
import com.campusvault.repository.StudentRepository;
import com.campusvault.repository.UserRepository;
import com.campusvault.security.CustomUserDetailsService;
import com.campusvault.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User record not found"));

        String token = jwtService.generateToken(userDetails, user.getRole().name(), user.getFullName());

        String studentCode = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                studentCode = studentOpt.get().getStudentId();
            }
        }

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName(),
                studentCode
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email is already registered. Please login instead.");
        }

        String studentCode = request.getStudentId();
        if (studentCode == null || studentCode.isBlank()) {
            studentCode = "AU-" + LocalDate.now().getYear() + "-" + String.format("%05d", (int)(Math.random() * 90000 + 10000));
        } else {
            studentCode = studentCode.trim().toUpperCase();
            if (studentRepository.existsByStudentId(studentCode)) {
                throw new ConflictException("Student ID " + studentCode + " already exists.");
            }
        }

        User user = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                Role.ROLE_STUDENT
        );
        User savedUser = userRepository.save(user);

        Student student = new Student(
                studentCode,
                savedUser,
                request.getFullName().trim(),
                email,
                request.getCollege() != null && !request.getCollege().isBlank() ? request.getCollege().trim() : "Apex University",
                request.getDepartment() != null && !request.getDepartment().isBlank() ? request.getDepartment().trim() : "Computer Science and Engineering",
                request.getAcademicYear() != null && !request.getAcademicYear().isBlank() ? request.getAcademicYear().trim() : "4th Year (2023-2027)"
        );
        studentRepository.save(student);

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails, savedUser.getRole().name(), savedUser.getFullName());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getFullName(),
                studentCode
        );
    }

    public UserProfileResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().name());

        if (user.getRole() == Role.ROLE_STUDENT) {
            studentRepository.findByUserId(user.getId()).ifPresent(s -> {
                response.setStudentId(s.getStudentId());
                response.setCollege(s.getCollege());
                response.setDepartment(s.getDepartment());
                response.setAcademicYear(s.getAcademicYear());
            });
        }

        return response;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
