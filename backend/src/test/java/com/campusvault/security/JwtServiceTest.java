package com.campusvault.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", "4c616d7075735661756c745365637572654a77745365637265744b657932303236303432314175576562");
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 3600000L); // 1 hour
    }

    @Test
    @DisplayName("Should generate valid JWT token with correct subject and claims")
    void testGenerateTokenAndValidate() {
        UserDetails userDetails = new User(
                "student@campusvault.edu",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        String token = jwtService.generateToken(userDetails, "ROLE_STUDENT", "John Doe");
        assertNotNull(token);
        assertFalse(token.isBlank());

        String username = jwtService.extractUsername(token);
        assertEquals("student@campusvault.edu", username);

        boolean isValid = jwtService.isTokenValid(token, userDetails);
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should reject token for different user")
    void testTokenValidationForWrongUser() {
        UserDetails user1 = new User("user1@campusvault.edu", "password", Collections.emptyList());
        UserDetails user2 = new User("user2@campusvault.edu", "password", Collections.emptyList());

        String token = jwtService.generateToken(user1, "ROLE_STUDENT", "User One");
        boolean isValid = jwtService.isTokenValid(token, user2);
        assertFalse(isValid);
    }
}
