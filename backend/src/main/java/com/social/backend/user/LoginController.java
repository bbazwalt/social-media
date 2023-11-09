package com.social.backend.user;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.social.backend.shared.CurrentUser;
import com.social.backend.user.vm.UserVM;

@RestController
public class LoginController {

	@PostMapping("/api/v1/login")
	UserVM handleLogin(@CurrentUser User loggedInUser) {
		return new UserVM(loggedInUser);
	}

}