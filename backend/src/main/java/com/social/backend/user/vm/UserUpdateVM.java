package com.social.backend.user.vm;

import com.social.backend.shared.ProfileImage;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateVM {

	@NotNull
	@Size(min = 4, max = 255)
	private String displayName;

	@ProfileImage
	private String image;

}