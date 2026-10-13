package com.example.management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.management.model.Department;
import com.example.management.repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

	private final DepartmentRepository departmentRepository;

	@Override
	public Department saveDepartment(Department department) {
		return departmentRepository.save(department);
	}

	@Override
	public List<Department> getAllDepartments() {
		return departmentRepository.findAll();
	}

	@Override
	public Optional<Department> getDepartmentById(Long id) {
		return departmentRepository.findById(id);
	}

	@Override
	public void deleteDepartment(Long id) {
		departmentRepository.deleteById(id);
	}
}