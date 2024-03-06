package com.azwalt.socialmedia.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateReplyPostRequest {

	@NotBlank(message = "{post.constraints.content.NotBlank.message}")
	@Size(min = 1, max = 255, message = "{post.constraints.content.Size.message}")
	private String content;

	@NotNull(message = "{post.constraints.id.NotNull.message}")
	private Long postId;

	private String image;

}
