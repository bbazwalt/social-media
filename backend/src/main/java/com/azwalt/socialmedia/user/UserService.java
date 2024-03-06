package com.azwalt.socialmedia.user;

import java.util.Set;

import com.azwalt.socialmedia.auth.SignUpRequest;

public interface UserService {

	public User createUser(SignUpRequest signUpRequest) throws Exception;

	public User findUserById(Long id) throws Exception;

	public User findUserByUsername(String username) throws Exception;

	public Set<User> searchUsers(String query);

	public User followUser(Long id, User user) throws Exception;

	public User updateUser(Long id, UserUpdateRequest user) throws Exception;

}
