package com.azwalt.socialmedia.user;

import java.util.LinkedHashSet;
import java.util.Set;

public class UserDtoMapper {

	public static UserDto toUserDto(User user) {
		return toUserDto(user, true);
	}

	public static UserDto toUserDto(User user, boolean includeRelations) {
		UserDto userDto = new UserDto();
		userDto.setId(user.getId());
		userDto.setFullName(user.getFullName());
		userDto.setUsername(user.getUsername());
		userDto.setProfilePicture(user.getProfilePicture());
		userDto.setCoverPicture(user.getCoverPicture());
		userDto.setBio(user.getBio());
		if (includeRelations) {
			userDto.setFollowers(toUserDtos(user.getFollowers(), false));
			userDto.setFollowing(toUserDtos(user.getFollowing(), false));
		}
		userDto.setLocation(user.getLocation());
		userDto.setWebsite(user.getWebsite());
		userDto.setCreatedAt(user.getCreatedAt());
		userDto.setDateOfBirth(user.getDateOfBirth());
		return userDto;
	}

	public static Set<UserDto> toUserDtos(Set<User> users, boolean includeRelations) {
		Set<UserDto> userDtos = new LinkedHashSet<>();
		for (User user : users) {
			userDtos.add(toUserDto(user, includeRelations));
		}
		return userDtos;
	}
}
