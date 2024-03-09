package com.azwalt.socialmedia.post.like;

import org.springframework.stereotype.Service;

import com.azwalt.socialmedia.post.Post;
import com.azwalt.socialmedia.post.PostRepository;
import com.azwalt.socialmedia.post.PostService;
import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

	private final LikeRepository likeRepository;
	private final PostService postService;
	private final PostRepository postRepository;
	private final UserRepository userRepository;

	@Override
	public Like likePost(Long postId, User user) throws Exception {
		Like isLikeExists = likeRepository.isLikeExists(user.getId(), postId);
		if (isLikeExists != null) {
			user.getLikes().remove(isLikeExists);
			userRepository.save(user);
			likeRepository.deleteById(isLikeExists.getId());
			Post post = postService.findPostById(postId);
			post.getLikes().remove(isLikeExists);
			postRepository.save(post);
			return isLikeExists;
		}
		Post post = postService.findPostById(postId);
		Like like = new Like();
		like.setPost(post);
		like.setUser(user);
		Like savedLike = likeRepository.save(like);
		user.getLikes().add(savedLike);
		userRepository.save(user);
		post.getLikes().add(savedLike);
		postRepository.save(post);
		return savedLike;
	}

}
