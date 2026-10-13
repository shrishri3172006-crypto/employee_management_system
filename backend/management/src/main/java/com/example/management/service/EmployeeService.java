package com.example.management.service;

import java.util.List;
import java.util.Optional;

import com.example.management.model.Employee;

public interface EmployeeService {
	Employee saveEmployee(Employee employee);

	List<Employee> getAllEmployees();

	Optional<Employee> getEmployeeById(Long empid);

	void deleteEmployee(Long empid);
}