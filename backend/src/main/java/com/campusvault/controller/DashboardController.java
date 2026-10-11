package com.campusvault.controller;

import com.campusvault.dto.ApiResponse;
import com.campusvault.dto.DashboardStatsResponse;
import com.campusvault.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAdminStats() {
        DashboardStatsResponse stats = dashboardService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success("Admin statistics loaded", stats));
    }
}
