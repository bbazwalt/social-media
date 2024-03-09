package com.azwalt.socialmedia.post.like;

import org.springframework.stereotype.Component;

import com.azwalt.socialmedia.post.PostDto;
import com.azwalt.socialmedia.post.PostDtoMapper;
import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserDto;
import com.azwalt.socialmedia.user.UserDtoMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LikeDtoMapper {

	private final UserDtoMapper userDtoMapper;
	private final PostDtoMapper postDtoMapper;

	public LikeDto toLikeDto(Like like, User reqUser) {
		UserDto user = userDtoMapper.toUserDto(like.getUser());
		PostDto post = postDtoMapper.toPostDto(like.getPost(), reqUser);
		LikeDto likeDto = new LikeDto();
		likeDto.setId(like.getId());
		likeDto.setPost(post);
		likeDto.setUser(user);
		return likeDto;
	}

}
