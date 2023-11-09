package com.social.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.social.backend.file.FileAttachmentRepository;
import com.social.backend.post.PostRepository;
import com.social.backend.user.UserRepository;
import com.social.backend.user.UserService;

@SpringBootApplication
public class BackendApplication {

	@Autowired
	UserRepository userRepository;

	@Autowired
	PostRepository postRepository;

	@Autowired
	FileAttachmentRepository fileAttachmentRepository;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	@Profile("dev")
	CommandLineRunner run(UserService userService) {
		fileAttachmentRepository.deleteAll();
		postRepository.deleteAll();
		userRepository.deleteAll();
		return null;
	}
}
