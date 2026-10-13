package com.example.management.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.management.model.User;
import com.example.management.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

	@Autowired
	private UserService userService;

	@PostMapping("/signup")
	public ResponseEntity<Map<String, String>> signup(@RequestBody User user) {
		if (userService.getUserByUsername(user.getUsername()).isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(Map.of("message", "Username already exists"));
		}

		user.setRole("USER");
		User savedUser = userService.saveUser(user);

		Map<String, String> response = new HashMap<>();
		response.put("message", "Signup successful");
		response.put("username", savedUser.getUsername());
		response.put("name", savedUser.getName());
		response.put("email", savedUser.getEmail());
		response.put("role", savedUser.getRole());

		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
		Optional<User> matchingUser = userService.getUserByUsername(user.getUsername());

		if (matchingUser.isEmpty()
				|| user.getPassword() == null
				|| !user.getPassword().equals(matchingUser.get().getPassword())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid username or password"));
		}

		User authenticatedUser = matchingUser.get();
		Map<String, String> response = new HashMap<>();
		response.put("message", "Login successful");
		response.put("username", authenticatedUser.getUsername());
		response.put("name", authenticatedUser.getName());
		response.put("role", authenticatedUser.getRole());

		return ResponseEntity.ok(response);
	}
}