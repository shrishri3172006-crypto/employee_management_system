package com.example.management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.management.model.Employee;
import com.example.management.repository.EmployeeRepository;

@Service
public class EmployeeServiceImple implements EmployeeService {

	private final EmployeeRepository employeeRepository;

	public EmployeeServiceImple(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}

	@Override
	public Employee saveEmployee(Employee employee) {
		return employeeRepository.save(employee);
	}

	@Override
	public List<Employee> getAllEmployees() {
		return employeeRepository.findAll();
	}

	@Override
	public Optional<Employee> getEmployeeById(Long empid) {
		return employeeRepository.findById(empid);
	}

	@Override
	public void deleteEmployee(Long empid) {
		employeeRepository.deleteById(empid);
	}
}