package com.example.management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.management.model.User;
import com.example.management.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	@Override
	public User saveUser(User user) {
		return userRepository.save(user);
	}

	@Override
	public Optional<User> getUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}
}