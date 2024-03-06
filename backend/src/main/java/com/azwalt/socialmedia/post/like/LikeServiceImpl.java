package com.azwalt.socialmedia.post.like;

import org.springframework.stereotype.Service;

import com.azwalt.socialmedia.post.Post;
import com.azwalt.socialmedia.post.PostRepository;
import com.azwalt.socialmedia.post.PostService;
import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserRepository;

@Service
public class LikeServiceImpl implements LikeService {

	private LikeRepository likeRepository;
	private PostService postService;
	private PostRepository postRepository;
	private UserRepository userRepository;

	public LikeServiceImpl(LikeRepository likeRepository, PostService postService, PostRepository postRepository,
			UserRepository userRepository) {
		this.likeRepository = likeRepository;
		this.postService = postService;
		this.postRepository = postRepository;
		this.userRepository = userRepository;
	}

	@Override
	public Like likePost(Long postId, User user) throws Exception {
		Like isLikeExists = likeRepository.isLikeExists(user.getId(), postId);
		if (isLikeExists != null) {
			user.getLikes().remove(isLikeExists);
			userRepository.save(user);
			likeRepository.deleteById(isLikeExists.getId());
			Post post = postService.findPostById(postId);
			post.getLikes().remove(isLikeExists);
			post.setViews(post.getViews() - 1);
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
		post.setViews(post.getViews() - 1);
		postRepository.save(post);
		return savedLike;
	}

}
