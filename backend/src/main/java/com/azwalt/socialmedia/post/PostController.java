package com.azwalt.socialmedia.post;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.azwalt.socialmedia.shared.ApiConstants;
import com.azwalt.socialmedia.shared.ApiResponse;
import com.azwalt.socialmedia.user.User;
import com.azwalt.socialmedia.user.UserService;
import com.azwalt.socialmedia.user.UserUtil;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiConstants.BASE_API_PATH + "/posts")
@Validated
public class PostController {

	private final PostService postService;
	private final UserService userService;
	private final PostDtoMapper postDtoMapper;
	private final UserUtil userUtil;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public PostDto createPost(@RequestBody @NotNull @Valid CreatePostRequest createPostRequest) throws Exception {
		User reqUser = userUtil.getCurrentUser();
		Post post = postService.createPost(createPostRequest, reqUser);
		return postDtoMapper.toPostDto(post, reqUser);
	}

	@PostMapping("/reply")
	@ResponseStatus(HttpStatus.CREATED)
	public PostDto createReplyPost(@RequestBody @NotNull @Valid CreateReplyPostRequest createReplyPostRequest)
			throws Exception {
		User reqUser = userUtil.getCurrentUser();
		Post post = postService.createReplyPost(createReplyPostRequest, reqUser);
		return postDtoMapper.toPostDto(post, reqUser);
	}

	@GetMapping("/{postId}")
	@ResponseStatus(HttpStatus.OK)
	public PostDto findPostById(@PathVariable @NotNull Long postId) throws Exception {
		User reqUser = userUtil.getCurrentUser();
		Post post = postService.findPostById(postId);
		return postDtoMapper.toPostDto(post, reqUser);
	}

	@PutMapping("/{postId}/repost")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public PostDto repost(@PathVariable @NotNull Long postId) throws Exception {
		User reqUser = userUtil.getCurrentUser();
		Post post = postService.repost(postId, reqUser);
		return postDtoMapper.toPostDto(post, reqUser);
	}

	@DeleteMapping("/{postId}")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse deletePostById(@PathVariable @NotNull Long postId) throws Exception {
		User reqUser = userUtil.getCurrentUser();
		postService.deletePostById(postId, reqUser.getId());
		return new ApiResponse("Post deleted successfully.", true);
	}

	@GetMapping("/reply/{parentPostId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllReplyPostsByParentPostId(@PathVariable @NotNull Long parentPostId) throws Exception {
		Set<Post> posts = postService.findAllReplyPostsByParentPostId(parentPostId);
		User reqUser = userUtil.getCurrentUser();
		return postDtoMapper.toPostDtos(posts, reqUser);
	}

	@GetMapping("/user")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllFollowingUserPosts() throws Exception {
		User reqUser = userUtil.getCurrentUser();
		Set<Post> posts = postService.findAllFollowingUserPosts(reqUser.getId());
		return postDtoMapper.toPostDtos(posts, reqUser);
	}

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllPosts() throws Exception {
		User user = userUtil.getCurrentUser();
		Set<Post> posts = postService.findAllPosts();
		return postDtoMapper.toPostDtos(posts, user);
	}

	@GetMapping("/user/{userId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllUserPosts(@PathVariable @NotNull Long userId) throws Exception {
		User user = userService.findUserById(userId);
		Set<Post> posts = postService.findAllUserPosts(user);
		User reqUser = userUtil.getCurrentUser();
		return postDtoMapper.toPostDtos(posts, reqUser);
	}

	@GetMapping("/user/replies/{userId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllUserReplyPosts(@PathVariable @NotNull Long userId) throws Exception {
		User user = userService.findUserById(userId);
		Set<Post> posts = postService.findAllUserReplyPosts(user);
		User reqUser = userUtil.getCurrentUser();
		return postDtoMapper.toPostDtos(posts, reqUser);
	}

	@GetMapping("/user/media/{userId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllUserMediaPosts(@PathVariable @NotNull Long userId) throws Exception {
		User user = userService.findUserById(userId);
		Set<Post> posts = postService.findAllUserMediaPosts(user);
		User reqUser = userUtil.getCurrentUser();
		return postDtoMapper.toPostDtos(posts, reqUser);
	}

	@GetMapping("/user/{userId}/likes")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllUserLikedPosts(@PathVariable @NotNull Long userId) throws Exception {
		User user = userService.findUserById(userId);
		Set<Post> posts = postService.findAllUserLikedPosts(user.getId());
		User reqUser = userUtil.getCurrentUser();
		return postDtoMapper.toPostDtos(posts, reqUser);
	}

}
