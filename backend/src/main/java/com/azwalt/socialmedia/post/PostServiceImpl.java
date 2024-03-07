package com.azwalt.socialmedia.post;

import java.time.Instant;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserException;

@Service
public class PostServiceImpl implements PostService {

	private PostRepository postRepository;

	public PostServiceImpl(PostRepository postRepository) {
		this.postRepository = postRepository;
	}

	@Override
	public Post createPost(CreatePostRequest createPostRequest, User user) {
		Post post = new Post();
		post.setContent(createPostRequest.getContent());
		post.setCreatedAt(Instant.now());
		post.setImage(createPostRequest.getImage());
		post.setUser(user);
		post.setReply(false);
		post.setPost(true);
		post.setViews(1L);
		return postRepository.save(post);
	}

	@Override
	public Post createReplyPost(CreateReplyPostRequest createReplyPostRequest, User user) throws Exception {
		Post replyFor = findPostById(createReplyPostRequest.getPostId());
		replyFor.setViews(replyFor.getViews() - 1);
		Post post = new Post();
		post.setContent(createReplyPostRequest.getContent());
		post.setCreatedAt(Instant.now());
		post.setImage(createReplyPostRequest.getImage());
		post.setUser(user);
		post.setReply(true);
		post.setPost(false);
		post.setReplyFor(replyFor);
		post.setViews(1L);
		Post savedReply = postRepository.save(post);
		replyFor.getReplyPosts().add(savedReply);
		postRepository.save(replyFor);
		return replyFor;
	}

	@Override
	public Post findPostById(Long postId) throws Exception {
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new PostException("No post found with the given ID."));
		post.setViews(post.getViews() + 1);
		postRepository.save(post);
		return post;
	}

	@Override
	public Post repost(Long postId, User user) throws Exception {
		Post post = findPostById(postId);
		post.setViews(post.getViews() - 1);
		if (post.getRepostedUsers().contains(user)) {
			post.getRepostedUsers().remove(user);
		} else {
			post.getRepostedUsers().add(user);
		}
		return postRepository.save(post);
	}

	@Override
	public void deletePostById(Long postId, Long userId) throws Exception {
		Post post = findPostById(postId);
		if (!userId.equals(post.getUser().getId())) {
			throw new UserException("You can't delete another user's post.");
		}
		post.getRepostedUsers().clear();
		post.getReplyPosts().clear();
		post.setReplyFor(null);
		post.setUser(null);
		postRepository.delete(post);
	}

	@Override
	public Set<Post> findAllReplyPostsByParentPostId(Long parentPostId) {
		Set<Post> posts = postRepository.findAllReplyPostsByParentPostId(parentPostId);
		for (Post post : posts) {
			post.setViews(post.getViews() + 1);
			postRepository.save(post);
		}
		return posts;
	}

	@Override
	public Set<Post> findAllFollowingUserPosts(Long userId) {
		Set<Post> posts = postRepository.findAllByFollowingUserId(userId);
		for (Post post : posts) {
			post.setViews(post.getViews() + 1);
			postRepository.save(post);
		}
		return posts;
	}

	@Override
	public Set<Post> findAllPosts() {
		Set<Post> posts = postRepository.findAllByIsPostTrueOrderByCreatedAtDesc();
		for (Post post : posts) {
			post.setViews(post.getViews() + 1);
			postRepository.save(post);
		}
		return posts;
	}

	@Override
	public Set<Post> findAllUserPosts(User user) {
		Set<Post> posts = postRepository
				.findByRepostedUsersContainsAndIsPostTrueOrUser_IdAndIsPostTrueOrderByCreatedAtDesc(user, user.getId());
		for (Post post : posts) {
			post.setViews(post.getViews() + 1);
			postRepository.save(post);
		}
		return posts;
	}

	@Override
	public Set<Post> findAllUserReplyPosts(User user) {
		Set<Post> posts = postRepository.findByUserAndIsReplyTrueAndIsPostFalseOrderByCreatedAtDesc(user);
		for (Post post : posts) {
			post.setViews(post.getViews() + 1);
			postRepository.save(post);
		}
		return posts;
	}

	@Override
	public Set<Post> findAllUserMediaPosts(User user) {
		Set<Post> posts = postRepository.findAllMediaPostsByUser(user);
		for (Post post : posts) {
			post.setViews(post.getViews() + 1);
			postRepository.save(post);
		}
		return posts;
	}

	@Override
	public Set<Post> findAllUserLikedPosts(Long userId) {
		return postRepository.findAllUserLikedPosts(userId);
	}

}
