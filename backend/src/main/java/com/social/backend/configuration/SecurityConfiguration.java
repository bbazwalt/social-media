package com.social.backend.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableMethodSecurity()
public class SecurityConfiguration {

	@Autowired
	AuthUserService authUserService;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		return http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.csrf(csrf -> csrf.disable()).headers(headers -> headers.disable())

				.httpBasic(basic -> basic.authenticationEntryPoint(new BasicAuthenticationEntryPoint()))

				.authorizeHttpRequests((authentication) -> authentication
						.requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.POST, "/api/v1/login"))
						.authenticated()
						.requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.PUT, "/api/v1/users/{id:[0-9]+}"))
						.authenticated()
						.requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.POST, "/api/v1/posts/**"))
						.authenticated()
						.requestMatchers(
								AntPathRequestMatcher.antMatcher(HttpMethod.DELETE, "/api/v1/posts/{id:[0-9]+}"))
						.authenticated().anyRequest().permitAll())
				.build();
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(authUserService).passwordEncoder(passwordEncoder());
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}