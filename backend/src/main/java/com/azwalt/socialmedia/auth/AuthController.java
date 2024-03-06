package com.azwalt.socialmedia.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.azwalt.socialmedia.configuration.TokenProvider;
import com.azwalt.socialmedia.user.CustomUserService;
import com.azwalt.socialmedia.user.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Validated
@RestController
@RequestMapping("/auth")
public class AuthController {

	private PasswordEncoder passwordEncoder;
	private TokenProvider tokenProvider;
	private CustomUserService customUserService;
	private UserService userService;

	public AuthController(PasswordEncoder passwordEncoder, TokenProvider tokenProvider,
			CustomUserService customUserService, UserService userService) {
		this.passwordEncoder = passwordEncoder;
		this.tokenProvider = tokenProvider;
		this.customUserService = customUserService;
		this.userService = userService;
	}

	@PostMapping("/signup")
	@ResponseStatus(HttpStatus.CREATED)
	public AuthResponse signUp(@RequestBody @NotNull @Valid SignUpRequest signUpRequest) throws Exception {
		userService.createUser(signUpRequest);
		Authentication authentication = new UsernamePasswordAuthenticationToken(signUpRequest.getUsername(),
				signUpRequest.getPassword());
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String token = tokenProvider.generateToken(authentication);
		return new AuthResponse(token, "Sign up successfull.");

	}

	@PostMapping("/signin")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public AuthResponse signIn(@RequestBody @NotNull @Valid SignInRequest signInRequest) {
		Authentication authentication = authenticate(signInRequest.getUsername(), signInRequest.getPassword());
		SecurityContextHolder.getContext().setAuthentication(authentication);
		String token = tokenProvider.generateToken(authentication);
		return new AuthResponse(token, "Sign in successfull.");
	}

	private Authentication authenticate(String username, String password) {
		UserDetails userDetails = customUserService.loadUserByUsername(username);
		if (!passwordEncoder.matches(password, userDetails.getPassword())) {
			throw new BadCredentialsException("Invalid username or password.");
		}
		return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	}

}
