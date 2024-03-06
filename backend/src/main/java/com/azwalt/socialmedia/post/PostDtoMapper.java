package com.azwalt.socialmedia.post;

import java.util.LinkedHashSet;
import java.util.Set;

import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserDto;
import com.azwalt.socialmedia.user.UserDtoMapper;

public class PostDtoMapper {

	public static PostDto toPostDto(Post post, User reqUser) {
		UserDto user = UserDtoMapper.toUserDto(post.getUser());
		boolean isLiked = PostUtil.isLikedByReqUser(reqUser, post);
		boolean isReposted = PostUtil.isRepostedByReqUser(reqUser, post);
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
		postDto.setTotalViews(post.getViews());
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

	public static Set<PostDto> toPostDtos(Set<Post> posts, User reqUser) {
		Set<PostDto> postsDtos = new LinkedHashSet<>();
		for (Post post : posts) {
			PostDto postDto = toPostDto(post, reqUser);
			postsDtos.add(postDto);
		}
		return postsDtos;
	}

}
