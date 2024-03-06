package com.azwalt.socialmedia.post;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.azwalt.socialmedia.user.User;

public interface PostRepository extends JpaRepository<Post, Long> {
	@Query("SELECT p FROM Post p WHERE p.replyFor IS NOT NULL AND p.replyFor.id = :parentPostId ORDER BY p.createdAt DESC")
	public Set<Post> findAllReplyPostsByParentPostId(@Param("parentPostId") Long parentPostId);

	@Query("SELECT p FROM Post p WHERE p.user IN (SELECT f FROM User u JOIN u.following f WHERE u.id = :userId)")
	public Set<Post> findAllByFollowingUserId(@Param("userId") Long userId);

	public Set<Post> findAllByIsPostTrueOrderByCreatedAtDesc();

	public Set<Post> findByRepostedUsersContainsAndIsPostTrueOrUser_IdAndIsPostTrueOrderByCreatedAtDesc(User user,
			Long userId);

	public Set<Post> findByUserAndIsReplyTrueAndIsPostFalseOrderByCreatedAtDesc(User user);

	@Query("SELECT p FROM Post p WHERE p.user = :user AND (p.image IS NOT NULL) ORDER BY p.createdAt DESC")
	public Set<Post> findAllMediaPostsByUser(@Param("user") User user);

	@Query("SELECT p FROM Post p JOIN p.likes l WHERE l.user.id=:userId ORDER BY p.createdAt DESC")
	public Set<Post> findAllUserLikedPosts(@Param("userId") Long userId);

}
