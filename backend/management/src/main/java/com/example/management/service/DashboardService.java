package com.example.management.service;

import java.util.Map;

public interface DashboardService {
	long getTotalEmployees();

	long getActiveEmployees();

	long getInactiveEmployees();

	long getTotalDepartments();

	long getTotalUsers();

	Map<String, Long> getDashboardSummary();
}