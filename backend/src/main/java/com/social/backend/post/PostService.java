package com.social.backend.post;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.social.backend.user.User;

public interface PostService {

	public Post save(User user, Post post);

	public Page<Post> getAllPosts(Pageable pageable);

	public Page<Post> getPostsOfUser(String username, Pageable pageable);

	public Page<Post> getOldPosts(long id, String username, Pageable pageable);

	public List<Post> getNewPosts(long id, String username, Pageable pageable);

	public long getNewPostsCount(long id, String username);

	public void deletePost(long id);
}