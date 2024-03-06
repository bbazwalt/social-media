package com.azwalt.socialmedia.post;

import java.util.Set;

import com.azwalt.socialmedia.user.User;

public interface PostService {

	public Post createPost(CreatePostRequest createPostRequest, User user);

	public Post createReplyPost(CreateReplyPostRequest createReplyPostRequest, User user) throws Exception;

	public Post findPostById(Long postId) throws Exception;

	public Post repost(Long postId, User user) throws Exception;

	public void deletePostById(Long postId, Long userId) throws Exception;

	public Set<Post> findAllReplyPostsByParentPostId(Long parentPostId);

	public Set<Post> findAllFollowingUserPosts(Long userId);

	public Set<Post> findAllPosts();

	public Set<Post> findAllUserPosts(User user);

	public Set<Post> findAllUserReplyPosts(User user);

	public Set<Post> findAllUserMediaPosts(User user);

	public Set<Post> findAllUserLikedPosts(Long userId);

}
