package com.azwalt.socialmedia.user;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

import com.azwalt.socialmedia.post.Post;
import com.azwalt.socialmedia.post.like.Like;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotBlank(message = "{user.constraints.fullName.NotBlank.message}")
	@Size(max = 255, message = "{user.constraints.fullName.Size.message}")
	private String fullName;

	@NotBlank(message = "{user.constraints.username.NotBlank.message}")
	@Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9_.]{5,28}$", message = "{user.constraints.username.Pattern.message}")
	private String username;

	@JsonIgnore
	@NotBlank(message = "{user.constraints.password.NotBlank.message}")
	@Size(min = 8, max = 255, message = "{user.constraints.password.Size.message}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{user.constraints.password.Pattern.message}")
	private String password;

	@NotBlank(message = "{user.constraints.dateOfBirth.NotBlank.message}")
	@AgeLimit(message = "{user.constraints.dateOfBirth.AgeLimit.message}")
	private String dateOfBirth;

	private String location;
	private String website;
	private String profilePicture;
	private String coverPicture;
	private String bio;

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private Set<Post> posts = new LinkedHashSet<>();

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private Set<Like> likes = new LinkedHashSet<>();

	@JsonIgnore
	@ManyToMany
	private Set<User> following = new LinkedHashSet<>();

	@JsonIgnore
	@ManyToMany
	private Set<User> followers = new LinkedHashSet<>();

	private Instant createdAt;

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

}
