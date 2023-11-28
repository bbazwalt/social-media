package com.social.backend.configuration;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.social.backend.auth.AuthUserService;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableMethodSecurity()
@EnableGlobalAuthentication
public class SecurityConfiguration {

	@Autowired
	AuthUserService authUserService;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		return http.userDetailsService(authUserService).sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.csrf(csrf -> {
					try {
						csrf.disable().cors(cors -> cors.configurationSource(new CorsConfigurationSource() {
							@Override
							public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
								CorsConfiguration cfg = new CorsConfiguration();
								cfg.setAllowedOriginPatterns(Arrays.asList("http://127.0.0.1:3000","http://localhost:3000","https://social-media-web-react.vercel.app"));
								cfg.setAllowedMethods(Collections.singletonList("*"));
								cfg.setAllowCredentials(true);
								cfg.setAllowedHeaders(Collections.singletonList("*"));
								cfg.setExposedHeaders(Arrays.asList("Authorization"));
								cfg.setMaxAge(3600L);
								return cfg;
							}
						}));
					} catch (Exception e) {
						e.printStackTrace();
					}
				})

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
						.authenticated().anyRequest().permitAll()).build();
	}


	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}