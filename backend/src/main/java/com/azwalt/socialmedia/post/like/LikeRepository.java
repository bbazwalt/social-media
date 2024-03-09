package com.azwalt.socialmedia.post.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LikeRepository extends JpaRepository<Like, Long> {

	@Query("SELECT l FROM Like l WHERE l.user.id=:userId AND l.post.id=:postId")
	public Like isLikeExists(@Param("userId") Long userId, @Param("postId") Long postId);

}
