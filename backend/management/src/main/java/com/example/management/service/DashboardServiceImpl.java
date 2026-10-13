package com.example.management.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.management.repository.DepartmentRepository;
import com.example.management.repository.EmployeeRepository;
import com.example.management.repository.UserRepository;

@Service
public class DashboardServiceImpl implements DashboardService {
	private final EmployeeRepository employeeRepository;
	private final DepartmentRepository departmentRepository;
	private final UserRepository userRepository;

	public DashboardServiceImpl(EmployeeRepository employeeRepository,
			DepartmentRepository departmentRepository,
			UserRepository userRepository) {
		this.employeeRepository = employeeRepository;
		this.departmentRepository = departmentRepository;
		this.userRepository = userRepository;
	}

	@Override
	public long getTotalEmployees() {
		return employeeRepository.count();
	}

	@Override
	public long getActiveEmployees() {
		return employeeRepository.findAll().stream()
				.filter(employee -> "Active".equals(employee.getStatus()))
				.count();
	}

	@Override
	public long getInactiveEmployees() {
		return employeeRepository.findAll().stream()
				.filter(employee -> "Inactive".equals(employee.getStatus()))
				.count();
	}

	@Override
	public long getTotalDepartments() {
		return departmentRepository.count();
	}

	@Override
	public long getTotalUsers() {
		return userRepository.count();
	}

	@Override
	public Map<String, Long> getDashboardSummary() {
		Map<String, Long> summary = new LinkedHashMap<>();
		summary.put("totalEmployees", getTotalEmployees());
		summary.put("activeEmployees", getActiveEmployees());
		summary.put("inactiveEmployees", getInactiveEmployees());
		summary.put("totalDepartments", getTotalDepartments());
		summary.put("totalUsers", getTotalUsers());
		return summary;
	}
}