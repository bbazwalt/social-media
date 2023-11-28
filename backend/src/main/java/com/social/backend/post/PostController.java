package com.social.backend.post;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.social.backend.post.vm.PostVM;
import com.social.backend.shared.CurrentUser;
import com.social.backend.shared.GenericResponse;
import com.social.backend.user.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")

public class PostController {

	@Autowired
	PostService postService;

	@PostMapping("/posts")
	PostVM createPost(@Valid @RequestBody Post post, @CurrentUser User user) {
		return new PostVM(postService.save(user, post));
	}

	@GetMapping("/posts")
	Page<PostVM> getAllPosts(Pageable pageable) {
		return postService.getAllPosts(pageable).map(PostVM::new);
	}

	@GetMapping("/users/{username}/posts")
	Page<PostVM> getPostsOfUser(@PathVariable String username, Pageable pageable) {
		return postService.getPostsOfUser(username, pageable).map(PostVM::new);

	}

	@GetMapping({ "/posts/{id:[0-9]+}", "/users/{username}/posts/{id:[0-9]+}" })
	ResponseEntity<?> getPostsRelative(@PathVariable long id, @PathVariable(required = false) String username,
			Pageable pageable, @RequestParam(name = "direction", defaultValue = "after") String direction,
			@RequestParam(name = "count", defaultValue = "false", required = false) boolean count) {
		if (!direction.equalsIgnoreCase("after")) {
			return ResponseEntity.ok(postService.getOldPosts(id, username, pageable).map(PostVM::new));
		}

		if (count == true) {
			long newPostCount = postService.getNewPostsCount(id, username);
			return ResponseEntity.ok(Collections.singletonMap("count", newPostCount));
		}

		List<PostVM> newPosts = postService.getNewPosts(id, username, pageable).stream().map(PostVM::new)
				.collect(Collectors.toList());
		return ResponseEntity.ok(newPosts);
	}

	@DeleteMapping("/posts/{id:[0-9]+}")
	@PreAuthorize("@postSecurityService.isAllowedToDelete(#id, principal)")
	GenericResponse deletePost(@PathVariable long id) {
		postService.deletePost(id);
		return new GenericResponse("Post is removed");
	}

}
