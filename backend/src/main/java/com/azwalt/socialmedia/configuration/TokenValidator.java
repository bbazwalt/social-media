package com.azwalt.socialmedia.configuration;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class TokenValidator extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest httpServletRequest,
			@NonNull HttpServletResponse httpServletResponse,
			@NonNull FilterChain filterChain)
			throws ServletException, IOException {
		String token = httpServletRequest.getHeader(TokenConstants.REQUEST_HEADER);
		if (token != null) {
			try {
				SecretKey key = Keys.hmacShaKeyFor(TokenConstants.SECRET_KEY.getBytes());
				Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token.substring(7))
						.getPayload();
				String username = String.valueOf(claims.get("username"));
				List<GrantedAuthority> authorities = new ArrayList<>();
				Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
				SecurityContextHolder.getContext().setAuthentication(authentication);
			} catch (Exception exception) {
				throw new BadCredentialsException("Invalid Token.");
			}
		}
		filterChain.doFilter(httpServletRequest, httpServletResponse);
	}

}