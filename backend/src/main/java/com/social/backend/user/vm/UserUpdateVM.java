package com.social.backend.user.vm;

import com.social.backend.shared.ProfileImage;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateVM {

	@NotNull
	@Size(min = 4, max = 255)
	private String displayName;

	@ProfileImage
	private String image;

}