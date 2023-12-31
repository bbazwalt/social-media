package com.social.backend.file;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
public class FileUploadController {

	@Autowired
	FileService fileService;

	@PostMapping("/posts/upload")
	FileAttachment uploadForPost(MultipartFile file) {
		return fileService.saveAttachment(file);
	}

}
