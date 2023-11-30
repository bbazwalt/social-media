package com.social.backend.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.social.backend.user.vm.UserUpdateVM;

public interface UserService {

	public User save(User user);

	public Page<User> getUsers(User loggedInUser, Pageable pageable);

	public User getByUsername(String username);

	public User update(long id, UserUpdateVM userUpdate);

}
