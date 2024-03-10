package com.azwalt.socialmedia.post;

import java.time.Instant;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

	private final PostRepository postRepository;

	@Override
	public Post createPost(CreatePostRequest createPostRequest, User user) {
		Post post = new Post();
		post.setContent(createPostRequest.getContent());
		post.setCreatedAt(Instant.now());
		post.setImage(createPostRequest.getImage());
		post.setUser(user);
		post.setReply(false);
		post.setPost(true);
		return postRepository.save(post);
	}

	@Override
	public Post createReplyPost(CreateReplyPostRequest createReplyPostRequest, User user) throws Exception {
		Post replyFor = findPostById(createReplyPostRequest.getPostId());
		Post post = new Post();
		post.setContent(createReplyPostRequest.getContent());
		post.setCreatedAt(Instant.now());
		post.setImage(createReplyPostRequest.getImage());
		post.setUser(user);
		post.setReply(true);
		post.setPost(false);
		post.setReplyFor(replyFor);
		Post savedReply = postRepository.save(post);
		replyFor.getReplyPosts().add(savedReply);
		return postRepository.save(replyFor);
	}

	@Override
	public Post findPostById(Long postId) throws Exception {
		return postRepository.findById(postId)
				.orElseThrow(() -> new PostException("No post found with the given ID."));
	}

	@Override
	public Post repost(Long postId, User user) throws Exception {
		Post post = findPostById(postId);
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
		post.setUser(null);
		post.getLikes().clear();
		post.getReplyPosts().clear();
		post.getRepostedUsers().clear();
		post.setReplyFor(null);
		postRepository.delete(post);
	}

	@Override
	public Set<Post> findAllReplyPostsByParentPostId(Long parentPostId) {
		return postRepository.findAllReplyPostsByParentPostId(parentPostId);
	}

	@Override
	public Set<Post> findAllFollowingUserPosts(Long userId) {
		return postRepository.findAllByFollowingUserId(userId);
	}

	@Override
	public Set<Post> findAllPosts() {
		return postRepository.findAllByIsPostTrueOrderByCreatedAtDesc();
	}

	@Override
	public Set<Post> findAllUserPosts(User user) {
		return postRepository
				.findByRepostedUsersContainsAndIsPostTrueOrUser_IdAndIsPostTrueOrderByCreatedAtDesc(user, user.getId());
	}

	@Override
	public Set<Post> findAllUserReplyPosts(User user) {
		return postRepository.findByUserAndIsReplyTrueAndIsPostFalseOrderByCreatedAtDesc(user);
	}

	@Override
	public Set<Post> findAllUserMediaPosts(User user) {
		return postRepository.findAllMediaPostsByUser(user);

	}

	@Override
	public Set<Post> findAllUserLikedPosts(Long userId) {
		return postRepository.findAllUserLikedPosts(userId);
	}

}
