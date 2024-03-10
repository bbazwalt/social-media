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
		return Jwts.builder().issuer("Benilton Azwalt").issuedAt(new Date())
				.expiration(new Date(new Date().getTime() + 864000000)).claim("username", authentication.getName())
				.signWith(key).compact();
	}

	public String getUsernameFromToken(String token) {
		Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token.substring(7)).getPayload();
		return String.valueOf(claims.get("username"));
	}

}
