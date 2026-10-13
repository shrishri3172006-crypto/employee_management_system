package com.example.management.service;

import java.util.List;
import java.util.Optional;

import com.example.management.model.Department;

public interface DepartmentService {
	Department saveDepartment(Department department);

	List<Department> getAllDepartments();

	Optional<Department> getDepartmentById(Long id);

	void deleteDepartment(Long id);
}