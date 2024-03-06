package com.azwalt.socialmedia.configuration;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenProvider {

	private SecretKey key = Keys.hmacShaKeyFor(TokenConstants.SECRET_KEY.getBytes());

	public String generateToken(Authentication authentication) {
		String token = Jwts.builder().issuer("Benilton Azwalt").issuedAt(new Date())
				.expiration(new Date(new Date().getTime() + 864000000)).claim("username", authentication.getName())
				.signWith(key).compact();
		return token;
	}

	public String getUsernameFromToken(String token) {
		token = token.substring(7);
		Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
		String username = String.valueOf(claims.get("username"));
		return username;
	}

}
