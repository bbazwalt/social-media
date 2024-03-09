package com.azwalt.socialmedia.post;

import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserDto;
import com.azwalt.socialmedia.user.UserDtoMapper;
import com.azwalt.socialmedia.user.UserUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PostDtoMapper {

	private final UserDtoMapper userDtoMapper;
	private final UserUtil userUtil;
	private final PostUtil postUtil;

	public PostDto toPostDto(Post post, User reqUser) {
		UserDto user = userDtoMapper.toUserDto(post.getUser(), false);
		user.setReqUser(userUtil.isReqUser(reqUser, post.getUser()));
		user.setFollowed(userUtil.isFollowedByReqUser(reqUser, post.getUser()));
		boolean isLiked = postUtil.isLikedByReqUser(reqUser, post);
		boolean isReposted = postUtil.isRepostedByReqUser(reqUser, post);
		Set<Long> repostedUserIds = new LinkedHashSet<>();
		for (User repostedUser : post.getRepostedUsers()) {
			repostedUserIds.add(repostedUser.getId());
		}
		PostDto postDto = new PostDto();
		postDto.setId(post.getId());
		postDto.setContent(post.getContent());
		postDto.setCreatedAt(post.getCreatedAt());
		postDto.setImage(post.getImage());
		postDto.setTotalLikes(post.getLikes().size());
		postDto.setTotalReplies(post.getReplyPosts().size());
		postDto.setTotalReposts(post.getRepostedUsers().size());
		postDto.setUser(user);
		postDto.setLiked(isLiked);
		postDto.setReposted(isReposted);
		postDto.setRepostedUserIds(repostedUserIds);
		postDto.setReplyPost(post.isReply());
		if (post.isReply()) {
			postDto.setReplyFor(post.getReplyFor().getId());
		}
		postDto.setReplyPosts(toPostDtos(post.getReplyPosts(), reqUser));
		return postDto;
	}

	public Set<PostDto> toPostDtos(Set<Post> posts, User reqUser) {
		Set<PostDto> postsDtos = new LinkedHashSet<>();
		for (Post post : posts) {
			postsDtos.add(toPostDto(post, reqUser));
		}
		return postsDtos;
	}

}
