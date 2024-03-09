package com.azwalt.socialmedia.shared;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.azwalt.socialmedia.post.PostException;
import com.azwalt.socialmedia.user.UserException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ApiResponse> badCredentialsExceptionHandler(
			BadCredentialsException badCredentialsException, WebRequest webRequest) {
		logger.error("BadCredentialsException: {}", webRequest.getDescription(true), badCredentialsException);
		ApiResponse apiErrorResponse = new ApiResponse(
				"Invalid Credentials.",
				false);
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiErrorResponse);
	}

	@ExceptionHandler(UsernameNotFoundException.class)
	public ResponseEntity<ApiResponse> usernameNotFoundExceptionHandler(
			UsernameNotFoundException usernameNotFoundException, WebRequest webRequest) {
		logger.error("UsernameNotFoundException: {}", webRequest.getDescription(true), usernameNotFoundException);
		ApiResponse apiErrorResponse = new ApiResponse(usernameNotFoundException.getMessage(),
				false);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiErrorResponse);
	}

	@ExceptionHandler(UserException.class)
	public ResponseEntity<ApiResponse> UserExceptionHandler(UserException userException, WebRequest webRequest) {
		logger.error("UserException: {}", webRequest.getDescription(true), userException);
		ApiResponse apiErrorResponse = new ApiResponse(userException.getMessage(),
				false);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiErrorResponse);
	}

	@ExceptionHandler(PostException.class)
	public ResponseEntity<ApiResponse> postExceptionHandler(PostException postException, WebRequest webRequest) {
		logger.error("PostException: {}", webRequest.getDescription(true), postException);
		ApiResponse apiErrorResponse = new ApiResponse(postException.getMessage(),
				false);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiErrorResponse);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiResponse> methodArgumentTypeMismatchExceptionHandler(
			MethodArgumentTypeMismatchException methodArgumentTypeMismatchException, WebRequest webRequest) {
		logger.error("MethodArgumentTypeMismatchException: {}", webRequest.getDescription(true),
				methodArgumentTypeMismatchException);
		ApiResponse apiErrorResponse = new ApiResponse("Invalid input.", false);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiErrorResponse);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse> handleValidationExceptions(
			MethodArgumentNotValidException methodArgumentNotValidException, WebRequest webRequest) {
		logger.error("MethodArgumentNotValidException: {}", webRequest.getDescription(true),
				methodArgumentNotValidException);
		Map<String, String> errors = new HashMap<>();
		methodArgumentNotValidException.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});
		ApiResponse apiErrorResponse = new ApiResponse(errors.toString(), false);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiErrorResponse);
	}

	@ExceptionHandler(NoHandlerFoundException.class)
	public ResponseEntity<ApiResponse> noHandlerFoundExceptionHandler(
			NoHandlerFoundException noHandlerFoundException, WebRequest webRequest) {
		logger.error("NoHandlerFoundException: {}", webRequest.getDescription(true),
				noHandlerFoundException);
		ApiResponse apiErrorResponse = new ApiResponse("No handler found.",
				false);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiErrorResponse);
	}

	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<ApiResponse> noResourceFoundExceptionHandler(
			NoResourceFoundException noResourceFoundException, WebRequest webRequest) {
		logger.error("NoResourceFoundException: {}", webRequest.getDescription(true),
				noResourceFoundException);
		ApiResponse apiErrorResponse = new ApiResponse("No resource found.", false);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiErrorResponse);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse> otherExceptionHandler(Exception except, WebRequest webRequest) {
		logger.error("Exception: {}", webRequest.getDescription(true), except);
		ApiResponse apiErrorResponse = new ApiResponse("An error occurred.",
				false);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiErrorResponse);
	}

}
