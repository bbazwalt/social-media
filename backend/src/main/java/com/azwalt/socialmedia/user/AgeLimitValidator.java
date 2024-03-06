package com.azwalt.socialmedia.user;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AgeLimitValidator implements ConstraintValidator<AgeLimit, String> {

	private int ageLimit;

	@Override
	public void initialize(AgeLimit constraintAnnotation) {
		this.ageLimit = constraintAnnotation.value();
	}

	@Override
	public boolean isValid(String value, ConstraintValidatorContext context) {
		if (value == null || value.isEmpty()) {
			return false;
		}
		try {
			LocalDate birthDate = LocalDate.parse(value, DateTimeFormatter.ISO_LOCAL_DATE);
			LocalDate currentDate = LocalDate.now();
			LocalDate ageLimitDate = birthDate.plusYears(ageLimit);
			return !ageLimitDate.isAfter(currentDate);
		} catch (DateTimeParseException e) {
			return false;
		}
	}
}
