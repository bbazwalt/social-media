package com.azwalt.socialmedia.post.like;

import com.azwalt.socialmedia.post.Post;
import com.azwalt.socialmedia.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "\"Like\"")
public class Like {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne
	private User user;

	@ManyToOne
	private Post post;

}
