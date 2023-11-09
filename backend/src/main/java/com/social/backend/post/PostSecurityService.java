package com.social.backend.post;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.social.backend.user.User;

@Service
public class PostSecurityService {

	PostRepository postRepository;

	public PostSecurityService(PostRepository postRepository) {
		super();
		this.postRepository = postRepository;
	}

	public boolean isAllowedToDelete(long postId, User loggedInUser) {
		Optional<Post> optionalPost = postRepository.findById(postId);
		if (optionalPost.isPresent()) {
			Post inDB = optionalPost.get();
			return inDB.getUser().getId() == loggedInUser.getId();
		}
		return false;
	}

}