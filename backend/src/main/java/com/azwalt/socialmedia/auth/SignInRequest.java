package com.azwalt.socialmedia.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInRequest {

	@NotBlank(message = "{user.constraints.username.NotBlank.message}")
	@Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9_.]{5,28}$", message = "{user.constraints.username.Pattern.message}")
	private String username;

	@NotBlank(message = "{user.constraints.password.NotBlank.message}")
	@Size(min = 8, max = 255, message = "{user.constraints.password.Size.message}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{user.constraints.password.Pattern.message}")
	private String password;
}
