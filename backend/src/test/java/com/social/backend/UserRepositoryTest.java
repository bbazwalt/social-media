package com.social.backend;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import com.social.backend.user.User;
import com.social.backend.user.UserRepository;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@Order(2)
public class UserRepositoryTest {

	@Autowired
	TestEntityManager testEntityManager;

	@Autowired
	UserRepository userRepository;

	@Test
	public void findByUsername_whenUserExists_returnsUser() {
		testEntityManager.persist(TestUtil.createValidUser());
		User inDB = userRepository.findByUsername("test-user");
		assertThat(inDB).isNotNull();

	}

	@Test
	public void findByUsername_whenUserDoesNotExist_returnsNull() {
		User inDB = userRepository.findByUsername("nonexistinguser");
		assertThat(inDB).isNull();
	}

}