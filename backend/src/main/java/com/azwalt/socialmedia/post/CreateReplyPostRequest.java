package com.azwalt.socialmedia.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReplyPostRequest {

	@NotBlank(message = "{post.constraints.content.NotBlank.message}")
	@Size(max = 255, message = "{post.constraints.content.Size.message}")
	private String content;

	@NotNull(message = "{post.constraints.id.NotNull.message}")
	private Long postId;

	private String image;

}
