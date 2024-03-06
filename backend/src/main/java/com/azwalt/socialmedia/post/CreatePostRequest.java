package com.azwalt.socialmedia.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatePostRequest {

    @NotBlank(message = "{post.constraints.content.NotBlank.message}")
    @Size(min = 1, max = 255, message = "{post.constraints.content.Size.message}")
    public String content;

    public String image;
}
