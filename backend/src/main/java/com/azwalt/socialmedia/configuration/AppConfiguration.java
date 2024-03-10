package com.azwalt.socialmedia.configuration;

import static org.springframework.security.config.Customizer.withDefaults;

import java.util.Arrays;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.azwalt.socialmedia.shared.ApiConstants;

@Configuration
@EnableWebSecurity
public class AppConfiguration {

	private static final Logger logger = LoggerFactory.getLogger(AppConfiguration.class);

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity
				.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(
						authorize -> authorize.requestMatchers(ApiConstants.BASE_API_PATH + "**").authenticated()
								.anyRequest().permitAll())
				.addFilterBefore(new TokenValidator(), BasicAuthenticationFilter.class).csrf(csrf -> {
					try {
						csrf.disable().cors(cors -> cors.configurationSource(corsConfigurationSource()));
					} catch (Exception exception) {
						logger.error("Error disabling CSRF: {}", exception.getMessage());
					}
				}).formLogin(withDefaults()).httpBasic(withDefaults()).build();
	}

	private CorsConfigurationSource corsConfigurationSource() {
		return request -> {
			CorsConfiguration cfg = new CorsConfiguration();
			cfg.setAllowedOriginPatterns(Arrays.asList(CorsConstants.CORS_API_URL));
			cfg.setAllowedMethods(Collections.singletonList("*"));
			cfg.setAllowCredentials(true);
			cfg.setAllowedHeaders(Collections.singletonList("*"));
			cfg.setExposedHeaders(Arrays.asList(TokenConstants.REQUEST_HEADER));
			cfg.setMaxAge(3600L);
			return cfg;
		};
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
