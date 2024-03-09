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
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApiConstants.BASE_API_PATH + "/users")
@Validated
public class UserController {

	private final UserService userService;
	private final UserRepository userRepository;
	private final UserDtoMapper userDtoMapper;
	private final UserUtil userUtil;

	@GetMapping("/profile")
	public UserDto findUserProfile() throws Exception {
		User user = userUtil.getCurrentUser();
		UserDto userDto = userDtoMapper.toUserDto(user);
		userDto.setReqUser(true);
		return userDto;
	}

	@GetMapping("/{userId}")
	public UserDto findUserById(@PathVariable @NotNull Long userId) throws Exception {
		User reqUser = userUtil.getCurrentUser();
		User user = userService.findUserById(userId);
		UserDto userDto = userDtoMapper.toUserDto(user);
		userDto.setReqUser(userUtil.isReqUser(reqUser, user));
		userDto.setFollowed(userUtil.isFollowedByReqUser(reqUser, user));
		return userDto;
	}

	@GetMapping("/search")
	public Set<UserDto> searchUsers(@RequestParam @NotBlank String query) {
		Set<User> users = userService.searchUsers(query);
		return userDtoMapper.toUserDtos(users, true);
	}

	@PutMapping("/{userId}/follow")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public UserDto followUser(@PathVariable @NotNull Long userId)
			throws Exception {
		User reqUser = userUtil.getCurrentUser();
		User targetUser = userService.followUser(userId, reqUser);
		userRepository.save(targetUser);
		UserDto userDto = userDtoMapper.toUserDto(targetUser);
		userDto.setFollowed(userUtil.isFollowedByReqUser(reqUser, targetUser));
		return userDto;
	}

	@PutMapping("/profile")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public UserDto updateUser(@RequestBody @NotNull @Valid UserUpdateRequest userUpdateRequest) throws Exception {
		User reqUser = userUtil.getCurrentUser();
		User user = userService.updateUser(reqUser.getId(), userUpdateRequest);
		return userDtoMapper.toUserDto(user);
	}

}
