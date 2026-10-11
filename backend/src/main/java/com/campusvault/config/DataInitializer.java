package com.campusvault.config;

import com.campusvault.dto.CertificateRequest;
import com.campusvault.entity.*;
import com.campusvault.repository.*;
import com.campusvault.service.CertificateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final EventRepository eventRepository;
    private final CertificateRepository certificateRepository;
    private final CertificateService certificateService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.init.admin.email:admin@campusvault.edu}")
    private String adminEmail;

    @Value("${app.init.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${app.init.admin.name:Dean of Academic Records}")
    private String adminName;

    @Value("${app.init.seed-sample-data:true}")
    private boolean seedSampleData;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           EventRepository eventRepository,
                           CertificateRepository certificateRepository,
                           CertificateService certificateService,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.eventRepository = eventRepository;
        this.certificateRepository = certificateRepository;
        this.certificateService = certificateService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Checking CampusVault initial database state...");

        // 1. Ensure Admin Account Exists
        User adminUser = userRepository.findByEmail(adminEmail).orElseGet(() -> {
            log.info("Initializing system administrator account: {}", adminEmail);
            User admin = new User(
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    adminName,
                    Role.ROLE_ADMIN
            );
            return userRepository.save(admin);
        });

        if (!seedSampleData) {
            return;
        }

        // 2. Ensure Sample Events Exist
        Event reactWorkshop = eventRepository.findByEventCode("EVT-REACT-2026").orElseGet(() -> {
            Event e = new Event(
                    "EVT-REACT-2026",
                    "React & Full-Stack Cloud Architecture Workshop",
                    EventCategory.WORKSHOP,
                    "Hands-on masterclass covering production React architectures, JWT security, and resilient Spring Boot REST APIs.",
                    LocalDate.of(2026, 9, 21),
                    "School of Computing & Department of CSE"
            );
            return eventRepository.save(e);
        });

        if (!eventRepository.existsByEventCode("EVT-HACK-2026")) {
            Event hackathon = new Event(
                    "EVT-HACK-2026",
                    "InnovateX 36-Hour National Hackathon",
                    EventCategory.HACKATHON,
                    "Prestigious nationwide hackathon building decentralized trust solutions and academic credential systems.",
                    LocalDate.of(2026, 8, 15),
                    "Apex University Innovation Council"
            );
            eventRepository.save(hackathon);
        }

        if (!eventRepository.existsByEventCode("EVT-AI-2026")) {
            Event internship = new Event(
                    "EVT-AI-2026",
                    "Advanced Machine Learning & AI Summer Internship",
                    EventCategory.INTERNSHIP,
                    "Accredited summer fellowship focused on generative intelligence and computer vision research.",
                    LocalDate.of(2026, 7, 30),
                    "Center for Artificial Intelligence Research"
            );
            internship.setStatus(EventStatus.COMPLETED);
            eventRepository.save(internship);
        }

        // 3. Ensure Sample Student Exists
        Student rithika = studentRepository.findByEmail("rithika@campusvault.edu").orElseGet(() -> {
            User studentUser = userRepository.findByEmail("rithika@campusvault.edu").orElseGet(() -> {
                User u = new User(
                        "rithika@campusvault.edu",
                        passwordEncoder.encode("Student@123"),
                        "A Rithika Reddy",
                        Role.ROLE_STUDENT
                );
                return userRepository.save(u);
            });

            Student s = new Student(
                    "AU-2026-00421",
                    studentUser,
                    "A Rithika Reddy",
                    "rithika@campusvault.edu",
                    "Apex University Institute of Technology",
                    "Computer Science and Engineering",
                    "4th Year (2023-2027)"
            );
            return studentRepository.save(s);
        });

        // 4. Ensure Sample Certificate Exists
        if (!certificateRepository.existsByCertificateId("AU-WEB-2026-00421")) {
            try {
                CertificateRequest certReq = new CertificateRequest();
                certReq.setStudentId(rithika.getId());
                certReq.setEventId(reactWorkshop.getId());
                certReq.setCertificateTitle("Certificate of Excellence & Completion");
                certReq.setDescription("Successfully demonstrated superior expertise in Full-Stack Web Engineering, Spring Boot REST Architecture, and Secure Certificate Verification Systems.");
                certReq.setIssueDate(LocalDate.of(2026, 9, 21));
                certReq.setCustomCertificateId("AU-WEB-2026-00421");

                // Generate via service so PDF & QR are physically created on disk
                certificateService.generateCertificate(certReq, adminUser);
                log.info("Initialized sample certificate AU-WEB-2026-00421 with QR code and PDF artifact.");
            } catch (Exception e) {
                log.warn("Sample certificate initialization note: {}", e.getMessage());
            }
        }

        log.info("CampusVault database initialization complete.");
    }
}
