package com.azwalt.socialmedia.post.like;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.azwalt.socialmedia.shared.ApiConstants;
import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserUtil;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiConstants.BASE_API_PATH + "/likes")
public class LikeController {

	private final LikeService likeService;
	private final LikeDtoMapper likeDtoMapper;
	private final UserUtil userUtil;

	@PutMapping("/{postId}")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public LikeDto likePost(@PathVariable @NotNull Long postId) throws Exception {
		User user = userUtil.getCurrentUser();
		Like like = likeService.likePost(postId, user);
		return likeDtoMapper.toLikeDto(like, user);
	}

}
