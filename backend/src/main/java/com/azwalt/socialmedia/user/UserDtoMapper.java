package com.azwalt.socialmedia.user;

import java.util.LinkedHashSet;
import java.util.Set;

import org.springframework.stereotype.Component;

@Component
public class UserDtoMapper {

	public UserDto toUserDto(User user) {
		return toUserDto(user, true);
	}

	public UserDto toUserDto(User user, boolean includeConnections) {
		UserDto userDto = new UserDto();
		userDto.setId(user.getId());
		userDto.setFullName(user.getFullName());
		userDto.setUsername(user.getUsername());
		userDto.setProfilePicture(user.getProfilePicture());
		userDto.setCoverPicture(user.getCoverPicture());
		userDto.setBio(user.getBio());
		if (includeConnections) {
			userDto.setFollowers(toUserDtos(user.getFollowers(), false));
			userDto.setFollowing(toUserDtos(user.getFollowing(), false));
		}
		userDto.setLocation(user.getLocation());
		userDto.setWebsite(user.getWebsite());
		userDto.setCreatedAt(user.getCreatedAt());
		userDto.setDateOfBirth(user.getDateOfBirth());
		return userDto;
	}

	public Set<UserDto> toUserDtos(Set<User> users, boolean includeConnections) {
		Set<UserDto> userDtos = new LinkedHashSet<>();
		for (User user : users) {
			userDtos.add(toUserDto(user, includeConnections));
		}
		return userDtos;
	}

}
