package com.example.management.service;

import java.util.List;
import java.util.Optional;

import com.example.management.model.User;

public interface UserService {
	User saveUser(User user);

	Optional<User> getUserByUsername(String username);

	List<User> getAllUsers();
}