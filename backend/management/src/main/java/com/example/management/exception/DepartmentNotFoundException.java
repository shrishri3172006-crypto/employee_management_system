package com.example.management.exception;

public class DepartmentNotFoundException extends RuntimeException {

	public DepartmentNotFoundException(String message) {
		super(message);
	}
}