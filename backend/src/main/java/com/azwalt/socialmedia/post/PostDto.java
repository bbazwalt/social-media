package com.azwalt.socialmedia.post;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

import com.azwalt.socialmedia.user.UserDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

	private Long id;
	private String content;
	private String image;
	private UserDto user;
	private Instant createdAt;
	private int totalLikes;
	private int totalReplies;
	private int totalReposts;
	private boolean isLiked;
	private boolean isReposted;
	private boolean isReplyPost;
	private Long replyFor;
	private Set<Long> repostedUserIds = new LinkedHashSet<>();
	private Set<PostDto> replyPosts = new LinkedHashSet<>();
	
}
