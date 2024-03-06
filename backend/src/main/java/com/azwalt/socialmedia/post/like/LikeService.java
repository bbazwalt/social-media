package com.azwalt.socialmedia.post.like;

import com.azwalt.socialmedia.user.User;

public interface LikeService {

	public Like likePost(Long postId, User user) throws Exception;

}
