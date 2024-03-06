package com.azwalt.socialmedia.user;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

	public Optional<User> findByUsername(String username);

	@Query("SELECT DISTINCT u FROM User u WHERE LOWER(u.fullName) LIKE %:query% OR LOWER(u.username) LIKE %:query%")
	public Set<User> searchUsers(@Param("query") String query);
}
