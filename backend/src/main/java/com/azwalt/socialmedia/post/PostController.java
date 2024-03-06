package com.azwalt.socialmedia.post;

import java.util.LinkedHashSet;
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

@Validated
@RestController
@RequestMapping(ApiConstants.BASE_API_PATH + "/posts")
public class PostController {

	private PostService postService;
	private UserService userService;

	public PostController(PostService postService, UserService userService) {
		this.postService = postService;
		this.userService = userService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public PostDto createPost(@RequestBody @NotNull @Valid CreatePostRequest createPostRequest)
			throws Exception {
		User user = UserUtil.getCurrentUser();
		Post post = postService.createPost(createPostRequest, user);
		PostDto postDto = PostDtoMapper.toPostDto(post, user);
		return postDto;
	}

	@PostMapping("/reply")
	@ResponseStatus(HttpStatus.CREATED)
	public PostDto createReplyPost(@RequestBody @NotNull @Valid CreateReplyPostRequest createReplyPostRequest)
			throws Exception {
		User user = UserUtil.getCurrentUser();
		Post post = postService.createReplyPost(createReplyPostRequest, user);
		PostDto postDto = PostDtoMapper.toPostDto(post, user);
		return postDto;
	}

	@GetMapping("/{postId}")
	@ResponseStatus(HttpStatus.OK)
	public PostDto findPostById(@PathVariable @NotNull Long postId)
			throws Exception {
		User user = UserUtil.getCurrentUser();
		Post post = postService.findPostById(postId);
		PostDto postDto = PostDtoMapper.toPostDto(post, user);
		return postDto;
	}

	@PutMapping("/{postId}/repost")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public PostDto repost(@PathVariable @NotNull Long postId)
			throws Exception {
		User user = UserUtil.getCurrentUser();
		Post post = postService.repost(postId, user);
		PostDto postDto = PostDtoMapper.toPostDto(post, user);
		return postDto;
	}

	@DeleteMapping("/{postId}")
	@ResponseStatus(HttpStatus.OK)
	public ApiResponse deletePostById(@PathVariable @NotNull Long postId) throws Exception {
		User user = UserUtil.getCurrentUser();
		postService.deletePostById(postId, user.getId());
		return new ApiResponse("Post deleted successfully.", true);
	}

	@GetMapping("/reply/{parentPostId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllReplyPostsByParentPostId(@PathVariable @NotNull Long parentPostId)
			throws Exception {
		Set<Post> posts = postService.findAllReplyPostsByParentPostId(parentPostId);
		User reqUser = UserUtil.getCurrentUser();
		Set<PostDto> postDtos = PostDtoMapper.toPostDtos(new LinkedHashSet<Post>(posts), reqUser);
		return postDtos;
	}

	@GetMapping("/user")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllFollowingUserPosts()
			throws Exception {
		User user = UserUtil.getCurrentUser();
		Set<Post> posts = postService.findAllFollowingUserPosts(user.getId());
		Set<PostDto> postDtos = PostDtoMapper.toPostDtos(new LinkedHashSet<Post>(posts), user);
		return postDtos;
	}

	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllPosts()
			throws Exception {
		User user = UserUtil.getCurrentUser();
		Set<Post> posts = postService.findAllPosts();
		Set<PostDto> postDtos = PostDtoMapper.toPostDtos(new LinkedHashSet<Post>(posts), user);
		return postDtos;
	}

	@GetMapping("/user/{userId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllUserPosts(@PathVariable @NotNull Long userId) throws Exception {
		User user = userService.findUserById(userId);
		Set<Post> posts = postService.findAllUserPosts(user);
		User reqUser = UserUtil.getCurrentUser();
		Set<PostDto> postDtos = PostDtoMapper.toPostDtos(new LinkedHashSet<Post>(posts), reqUser);
		return postDtos;
	}

	@GetMapping("/user/replies/{userId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllUserReplyPosts(@PathVariable @NotNull Long userId) throws Exception {
		User user = userService.findUserById(userId);
		Set<Post> posts = postService.findAllUserReplyPosts(user);
		User reqUser = UserUtil.getCurrentUser();
		Set<PostDto> postDtos = PostDtoMapper.toPostDtos(new LinkedHashSet<Post>(posts), reqUser);
		return postDtos;
	}

	@GetMapping("/user/media/{userId}")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllUserMediaPosts(@PathVariable @NotNull Long userId) throws Exception {
		User user = userService.findUserById(userId);
		Set<Post> posts = postService.findAllUserMediaPosts(user);
		User reqUser = UserUtil.getCurrentUser();
		Set<PostDto> postDtos = PostDtoMapper.toPostDtos(new LinkedHashSet<Post>(posts), reqUser);
		return postDtos;
	}

	@GetMapping("/user/{userId}/likes")
	@ResponseStatus(HttpStatus.OK)
	public Set<PostDto> findAllUserLikedPosts(@PathVariable @NotNull Long userId) throws Exception {
		User user = userService.findUserById(userId);
		Set<Post> posts = postService.findAllUserLikedPosts(user.getId());
		User reqUser = UserUtil.getCurrentUser();
		Set<PostDto> postDtos = PostDtoMapper.toPostDtos(new LinkedHashSet<Post>(posts), reqUser);
		return postDtos;
	}

}
