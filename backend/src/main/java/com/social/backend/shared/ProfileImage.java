package com.social.backend.shared;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Constraint(validatedBy = ProfileImageValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ProfileImage {

	String message() default "{social.constraints.image.ProfileImage.message}";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}