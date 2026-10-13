package com.example.management.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.management.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
	private final DashboardService dashboardService;

	public DashboardController(DashboardService dashboardService) {
		this.dashboardService = dashboardService;
	}

	@GetMapping("/total-employees")
	public long getTotalEmployees() {
		return dashboardService.getTotalEmployees();
	}

	@GetMapping("/active-employees")
	public long getActiveEmployees() {
		return dashboardService.getActiveEmployees();
	}

	@GetMapping("/inactive-employees")
	public long getInactiveEmployees() {
		return dashboardService.getInactiveEmployees();
	}

	@GetMapping("/total-departments")
	public long getTotalDepartments() {
		return dashboardService.getTotalDepartments();
	}

	@GetMapping("/total-users")
	public long getTotalUsers() {
		return dashboardService.getTotalUsers();
	}

	@GetMapping("/summary")
	public Map<String, Long> getDashboardSummary() {
		return dashboardService.getDashboardSummary();
	}
}