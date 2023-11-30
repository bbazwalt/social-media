package com.social.backend.file;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

	public String saveProfileImage(String base64Image) throws IOException;

	public String detectType(byte[] fileArr);

	public void deleteProfileImage(String image);

	public FileAttachment saveAttachment(MultipartFile file);

	public void cleanupStorage();

	public void deleteAttachmentImage(String image);

}