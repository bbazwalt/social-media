package com.social.backend.post;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.social.backend.user.User;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@NoArgsConstructor
@AllArgsConstructor
public class PostSecurityService {

	@Autowired
	PostRepository postRepository;

	public boolean isAllowedToDelete(long postId, User loggedInUser) {
		Optional<Post> optionalPost = postRepository.findById(postId);
		if (optionalPost.isPresent()) {
			Post inDB = optionalPost.get();
			return inDB.getUser().getId() == loggedInUser.getId();
		}
		return false;
	}

}