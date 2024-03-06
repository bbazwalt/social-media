package com.azwalt.socialmedia.user;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

import com.azwalt.socialmedia.post.Post;
import com.azwalt.socialmedia.post.like.Like;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

	private Long id;
	private String fullName;
	private String username;
	private String location;
	private String website;
	private String profilePicture;
	private String coverPicture;
	private String bio;
	private boolean reqUser;
	private Instant createdAt;
	private String dateOfBirth;
	private Set<Post> posts = new LinkedHashSet<>();
	private Set<Like> likes = new LinkedHashSet<>();
	private Set<UserDto> following = new LinkedHashSet<>();
	private Set<UserDto> followers = new LinkedHashSet<>();
	private boolean isFollowed;
}
