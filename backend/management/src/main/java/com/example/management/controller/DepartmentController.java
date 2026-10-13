package com.example.management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.management.exception.DepartmentNotFoundException;
import com.example.management.model.Department;
import com.example.management.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

	@Autowired
	private DepartmentService departmentService;

	@PostMapping
	public ResponseEntity<Department> addDepartment(@RequestBody Department department) {
		Department savedDepartment = departmentService.saveDepartment(department);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedDepartment);
	}

	@GetMapping
	public ResponseEntity<List<Department>> getAllDepartments() {
		return ResponseEntity.ok(departmentService.getAllDepartments());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
		Department department = departmentService.getDepartmentById(id)
				.orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + id));
		return ResponseEntity.ok(department);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {
		if (departmentService.getDepartmentById(id).isEmpty()) {
			throw new DepartmentNotFoundException("Department not found with id: " + id);
		}

		departmentService.deleteDepartment(id);
		return ResponseEntity.ok("Department deleted successfully");
	}
}