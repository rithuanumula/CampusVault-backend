package com.campusvault.controller;

import com.campusvault.dto.AuthRequest;
import com.campusvault.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should reject invalid login credentials with 401 Unauthorized")
    void testInvalidLoginReturnsUnauthorized() throws Exception {
        AuthRequest badRequest = new AuthRequest("nonexistent@campusvault.edu", "WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("Should successfully register a new student and authenticate")
    void testRegisterAndLoginWorkflow() throws Exception {
        String uniqueEmail = "student_" + System.currentTimeMillis() + "@campusvault.edu";
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setEmail(uniqueEmail);
        registerReq.setPassword("SecurePass123");
        registerReq.setFullName("Test Student Registration");
        registerReq.setCollege("Apex University");
        registerReq.setDepartment("Computer Science");
        registerReq.setAcademicYear("3rd Year");

        // 1. Register
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.email").value(uniqueEmail));

        // 2. Login with registered credentials
        AuthRequest loginReq = new AuthRequest(uniqueEmail, "SecurePass123");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty());
    }

    @Test
    @DisplayName("Should reject unauthenticated access to admin endpoints with 401")
    void testProtectedAdminEndpointRequiresAuth() throws Exception {
        mockMvc.perform(get("/api/admin/stats"))
                .andExpect(status().isUnauthorized());
    }
}
