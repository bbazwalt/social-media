package com.azwalt.socialmedia.post;

import org.springframework.stereotype.Component;

import com.azwalt.socialmedia.post.like.Like;
import com.azwalt.socialmedia.user.User;

@Component
public class PostUtil {

	public boolean isLikedByReqUser(User reqUser, Post post) {
		for (Like like : post.getLikes()) {
			if (like.getUser().getId().equals(reqUser.getId())) {
				return true;
			}
		}
		return false;
	}

	public boolean isRepostedByReqUser(User reqUser, Post post) {
		for (User user : post.getRepostedUsers()) {
			if (user.getId().equals(reqUser.getId())) {
				return true;
			}
		}
		return false;
	}

}
