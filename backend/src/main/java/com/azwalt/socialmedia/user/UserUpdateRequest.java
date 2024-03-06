package com.azwalt.socialmedia.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

	@NotBlank(message = "{user.constraints.fullName.NotBlank.message}")
	@Size(min = 1, max = 255)
	private String fullName;

	private String location;
	private String website;
	private String profilePicture;
	private String coverPicture;
	private String bio;
}
