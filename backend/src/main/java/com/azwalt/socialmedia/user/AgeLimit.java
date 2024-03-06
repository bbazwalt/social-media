package com.azwalt.socialmedia.user;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = AgeLimitValidator.class)
@Target({ ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface AgeLimit {

	int value() default 18;

	String message() default "{user.constraints.ageLimit.message}";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}
