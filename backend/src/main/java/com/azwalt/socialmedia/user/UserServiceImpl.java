package com.azwalt.socialmedia.user;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.azwalt.socialmedia.auth.SignUpRequest;

@Service
public class UserServiceImpl implements UserService {

	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;

	public UserServiceImpl(UserRepository userRepository,
			PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public User createUser(SignUpRequest signUpRequest) throws Exception {
		String username = signUpRequest.getUsername();

		Optional<User> isUser = userRepository.findByUsername(username);
		if (isUser.isPresent()) {
			throw new UserException("A user with the given username already exists.");
		}
		User createdUser = new User();
		createdUser.setUsername(username);
		createdUser.setFullName(signUpRequest.getFullName());
		createdUser.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
		createdUser.setDateOfBirth(signUpRequest.getDateOfBirth());
		createdUser.setCreatedAt(Instant.now());
		return userRepository.save(createdUser);
	}

	@Override
	public User findUserById(Long id) throws Exception {
		Optional<User> opt = userRepository.findById(id);
		if (opt.isPresent()) {
			return opt.get();
		}
		throw new UserException("No user found with the given ID.");
	}

	@Override
	public User findUserByUsername(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("No user found with the given username."));
	}

	@Override
	public Set<User> searchUsers(String query) {
		return userRepository.searchUsers(query.toLowerCase());
	}

	@Override
	public User followUser(Long id, User user) throws Exception {
		if (id.equals(user.getId())) {
			throw new UserException("You can not follow yourself.");
		}
		User followToUser = findUserById(id);
		if (user.getFollowing().contains(followToUser) && followToUser.getFollowers().contains(user)) {
			user.getFollowing().remove(followToUser);
			followToUser.getFollowers().remove(user);
		} else {
			user.getFollowing().add(followToUser);
			followToUser.getFollowers().add(user);
		}
		userRepository.save(followToUser);
		userRepository.save(user);
		return user;
	}

	@Override
	public User updateUser(Long id, UserUpdateRequest userUpdateRequest) throws Exception {
		User user = findUserById(id);
		if (userUpdateRequest.getFullName() != null) {
			user.setFullName(userUpdateRequest.getFullName());
		}
		if (userUpdateRequest.getBio() != null) {
			user.setBio(userUpdateRequest.getBio());
		}
		if (userUpdateRequest.getWebsite() != null) {
			user.setWebsite(userUpdateRequest.getWebsite());
		}
		if (userUpdateRequest.getLocation() != null) {
			user.setLocation(userUpdateRequest.getLocation());
		}
		if (userUpdateRequest.getProfilePicture() != null) {
			user.setProfilePicture(userUpdateRequest.getProfilePicture());
		}
		if (userUpdateRequest.getCoverPicture() != null) {
			user.setCoverPicture(userUpdateRequest.getCoverPicture());
		}
		return userRepository.save(user);
	}

}
