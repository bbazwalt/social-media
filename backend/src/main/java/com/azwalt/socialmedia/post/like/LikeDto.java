package com.azwalt.socialmedia.post.like;

import com.azwalt.socialmedia.post.PostDto;
import com.azwalt.socialmedia.user.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeDto {

	private Long id;
	private UserDto user;
	private PostDto post;

}
