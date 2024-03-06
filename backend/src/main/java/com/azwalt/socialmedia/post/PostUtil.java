package com.azwalt.socialmedia.post;

import com.azwalt.socialmedia.post.like.Like;
import com.azwalt.socialmedia.user.User;

public class PostUtil {

	public static boolean isLikedByReqUser(User reqUser, Post post) {
		for (Like like : post.getLikes()) {
			if (like.getUser().getId().equals(reqUser.getId())) {
				return true;
			}
		}
		return false;
	}

	public static boolean isRepostedByReqUser(User reqUser, Post post) {
		for (User user : post.getRepostedUsers()) {
			if (user.getId().equals(reqUser.getId())) {
				return true;
			}
		}
		return false;
	}

}
