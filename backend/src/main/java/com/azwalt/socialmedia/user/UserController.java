package com.azwalt.socialmedia.user;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.azwalt.socialmedia.shared.ApiConstants;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Validated
@RestController
@RequestMapping(ApiConstants.BASE_API_PATH + "/users")
public class UserController {

	private UserService userService;
	private UserRepository userRepository;

	public UserController(UserService userService, UserRepository userRepository) {
		this.userService = userService;
		this.userRepository = userRepository;
	}

	@GetMapping("/profile")
	public UserDto findUserProfile() throws Exception {
		User user = UserUtil.getCurrentUser();
		UserDto userDto = UserDtoMapper.toUserDto(user);
		userDto.setReqUser(true);
		return userDto;
	}

	@GetMapping("/{userId}")
	public UserDto findUserById(@PathVariable @NotNull Long userId) throws Exception {
		User reqUser = UserUtil.getCurrentUser();
		User user = userService.findUserById(userId);
		UserDto userDto = UserDtoMapper.toUserDto(user);
		userDto.setReqUser(UserUtil.isReqUser(reqUser, user));
		userDto.setFollowed(UserUtil.isFollowedByReqUser(reqUser, user));
		return userDto;
	}

	@GetMapping("/search")
	public Set<UserDto> searchUsers(@RequestParam @NotBlank String query) {
		Set<User> users = userService.searchUsers(query);
		Set<UserDto> userDtos = UserDtoMapper.toUserDtos(users, true);
		return userDtos;
	}

	@PutMapping("/{userId}/follow")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public UserDto followUser(@PathVariable @NotNull Long userId)
			throws Exception {
		User reqUser = UserUtil.getCurrentUser();
		User targetUser = userService.followUser(userId, reqUser);
		userRepository.save(targetUser);
		UserDto userDto = UserDtoMapper.toUserDto(targetUser);
		userDto.setFollowed(UserUtil.isFollowedByReqUser(reqUser, targetUser));
		return userDto;
	}

	@PutMapping
	@ResponseStatus(HttpStatus.ACCEPTED)
	public UserDto updateUser(@RequestBody @NotNull @Valid UserUpdateRequest userUpdateRequest) throws Exception {
		User reqUser = UserUtil.getCurrentUser();
		User user = userService.updateUser(reqUser.getId(), userUpdateRequest);
		UserDto userDto = UserDtoMapper.toUserDto(user);
		return userDto;
	}
}
