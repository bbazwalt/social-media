package com.azwalt.socialmedia.auth;

import com.azwalt.socialmedia.user.AgeLimit;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {

	@NotBlank(message = "{user.constraints.fullName.NotBlank.message}")
	@Size(max = 255, message = "{user.constraints.fullName.Size.message}")
	private String fullName;

	@NotBlank(message = "{user.constraints.username.NotBlank.message}")
	@Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9_.]{5,28}$", message = "{user.constraints.username.Pattern.message}")
	private String username;

	@NotBlank(message = "{user.constraints.password.NotBlank.message}")
	@Size(min = 8, max = 255, message = "{user.constraints.password.Size.message}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{user.constraints.password.Pattern.message}")
	private String password;

	@NotBlank(message = "{user.constraints.dateOfBirth.NotBlank.message}")
	@AgeLimit(message = "{user.constraints.dateOfBirth.AgeLimit.message}")
	private String dateOfBirth;

}
