package com.social.backend;

import com.social.backend.post.Post;
import com.social.backend.user.User;

public class TestUtil {

	public static User createValidUser() {
		User user = new User();
		user.setUsername("test-user");
		user.setDisplayName("test-display");
		user.setPassword("P4ssword");
		user.setImage("profile-image.png");
		return user;
	}

	public static User createValidUser(String username) {
		User user = createValidUser();
		user.setUsername(username);
		return user;
	}

	public static Post createValidPost() {
		Post post = new Post();
		post.setContent("test content for the test post");
		return post;
	}
}
