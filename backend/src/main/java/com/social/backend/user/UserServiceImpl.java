package com.social.backend.user;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.social.backend.exception.NotFoundException;
import com.social.backend.file.FileService;
import com.social.backend.user.vm.UserUpdateVM;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	FileService fileService;

	public User save(User user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	public Page<User> getUsers(User loggedInUser, Pageable pageable) {
		if (loggedInUser != null) {
			return userRepository.findByUsernameNot(loggedInUser.getUsername(), pageable);
		}
		return userRepository.findAll(pageable);
	}

	public User getByUsername(String username) {
		User inDB = userRepository.findByUsername(username);
		if (inDB == null) {
			throw new NotFoundException(username + " not found");
		}
		return inDB;
	}

	public User update(long id, UserUpdateVM userUpdate) {
		User inDB = userRepository.getReferenceById(id);
		inDB.setDisplayName(userUpdate.getDisplayName());
		if (userUpdate.getImage() != null) {
			String savedImageName;
			try {
				savedImageName = fileService.saveProfileImage(userUpdate.getImage());
				fileService.deleteProfileImage(inDB.getImage());
				inDB.setImage(savedImageName);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return userRepository.save(inDB);
	}

}
