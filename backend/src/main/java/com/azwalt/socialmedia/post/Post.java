package com.azwalt.socialmedia.post;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

import com.azwalt.socialmedia.post.like.Like;
import com.azwalt.socialmedia.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne
	private User user;

	private String content;
	private String image;

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Like> likes = new LinkedHashSet<>();

	@OneToMany(mappedBy = "replyFor", cascade = CascadeType.REMOVE, orphanRemoval = true)
	private Set<Post> replyPosts = new LinkedHashSet<>();

	@ManyToMany
	private Set<User> repostedUsers = new LinkedHashSet<>();

	@ManyToOne
	private Post replyFor;

	private boolean isReply;
	private boolean isPost;
	private Instant createdAt;

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

}
