package com.azwalt.socialmedia.user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component

public class UserUtil {

	private static UserService userService;
 
	public UserUtil(UserService userService) {
		UserUtil.userService = userService;
	}

	public static User getCurrentUser() throws Exception {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		return userService.findUserByUsername(username);
	}

	public static boolean isReqUser(User reqUser, User user) {
		return reqUser.getId().equals(user.getId());
	}

	public static boolean isFollowedByReqUser(User reqUser, User user) {
		return reqUser.getFollowing().contains(user);
	}
}
