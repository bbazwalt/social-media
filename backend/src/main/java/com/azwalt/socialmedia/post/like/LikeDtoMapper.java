package com.azwalt.socialmedia.post.like;

import com.azwalt.socialmedia.post.PostDto;
import com.azwalt.socialmedia.post.PostDtoMapper;
import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserDto;
import com.azwalt.socialmedia.user.UserDtoMapper;

public class LikeDtoMapper {

	public static LikeDto toLikeDto(Like like, User reqUser) {
		UserDto user = UserDtoMapper.toUserDto(like.getUser());
		PostDto post = PostDtoMapper.toPostDto(like.getPost(), reqUser);
		LikeDto likeDto = new LikeDto();
		likeDto.setId(like.getId());
		likeDto.setPost(post);
		likeDto.setUser(user);
		return likeDto;
	}

}
