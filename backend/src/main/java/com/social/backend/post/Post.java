package com.social.backend.post;

import java.util.Date;

import com.social.backend.file.FileAttachment;
import com.social.backend.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Post {

	@Id
	@GeneratedValue
	private long id;

	@NotNull
	@Size(min = 10, max = 5000)
	@Column(length = 5000)
	private String content;

	@Temporal(TemporalType.TIMESTAMP)
	private Date timestamp;

	@ManyToOne
	private User user;

	@OneToOne(mappedBy = "post", orphanRemoval = true)
	private FileAttachment attachment;
}
