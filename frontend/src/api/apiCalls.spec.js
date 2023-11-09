import axios from "axios";
import * as apiCalls from "./apiCalls";

describe("apiCalls", () => {
  describe("signup", () => {
    test("calls /api/v1/users", () => {
      const mockSignup = jest.fn();
      axios.post = mockSignup;
      apiCalls.signup();
      const path = mockSignup.mock.calls[0][0];
      expect(path).toBe("/api/v1/users");
    });
  });
  describe("login", () => {
    test("calls /api/v1/login", () => {
      const mockLogin = jest.fn();
      axios.post = mockLogin;
      apiCalls.login({ username: "test-user", password: "P4ssword" });
      const path = mockLogin.mock.calls[0][0];
      expect(path).toBe("/api/v1/login");
    });
  });
  describe("listUser", () => {
    test("calls /api/v1/users?page=0&size=3 when no param provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers();
      expect(mockListUsers).toHaveBeenCalledWith("/api/v1/users?page=0&size=3");
    });
    test("calls /api/v1/users?page=5&size=10 when corresponding params provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ page: 5, size: 10 });
      expect(mockListUsers).toHaveBeenCalledWith(
        "/api/v1/users?page=5&size=10"
      );
    });
    test("calls /api/v1/users?page=5&size=3 when only page param provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ page: 5 });
      expect(mockListUsers).toHaveBeenCalledWith("/api/v1/users?page=5&size=3");
    });
    test("calls /api/v1/users?page=0&size=5 when only size param provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ size: 5 });
      expect(mockListUsers).toHaveBeenCalledWith("/api/v1/users?page=0&size=5");
    });
  });
  describe("getUser", () => {
    test("calls /api/v1/users/user5 when user5 is provided for getUser", () => {
      const mockGetUser = jest.fn();
      axios.get = mockGetUser;
      apiCalls.getUser("user5");
      expect(mockGetUser).toHaveBeenCalledWith("/api/v1/users/user5");
    });
  });
  describe("updateUser", () => {
    test("calls /api/v1/users/5 when 5 is provided for updateUser", () => {
      const mockUpdateUser = jest.fn();
      axios.put = mockUpdateUser;
      apiCalls.updateUser("5");
      const path = mockUpdateUser.mock.calls[0][0];
      expect(path).toBe("/api/v1/users/5");
    });
  });
  describe("postPost", () => {
    test("calls /api/v1/posts", () => {
      const mockPostPost = jest.fn();
      axios.post = mockPostPost;
      apiCalls.postPost();
      const path = mockPostPost.mock.calls[0][0];
      expect(path).toBe("/api/v1/posts");
    });
  });
  describe("loadPosts", () => {
    test("calls /api/v1/posts?page=0&size=5&sort=id,desc when no param provided", () => {
      const mockGetPosts = jest.fn();
      axios.get = mockGetPosts;
      apiCalls.loadPosts();
      expect(mockGetPosts).toHaveBeenCalledWith(
        "/api/v1/posts?page=0&size=5&sort=id,desc"
      );
    });
    test("calls /api/v1/users/user1/posts?page=0&size=5&sort=id,desc when user param provided", () => {
      const mockGetPosts = jest.fn();
      axios.get = mockGetPosts;
      apiCalls.loadPosts("user1");
      expect(mockGetPosts).toHaveBeenCalledWith(
        "/api/v1/users/user1/posts?page=0&size=5&sort=id,desc"
      );
    });
  });
  describe("loadOldPosts", () => {
    test("calls /api/v1/posts/5?direction=before&page=0&size=5&sort=id,desc when post id param provided", () => {
      const mockGetPosts = jest.fn();
      axios.get = mockGetPosts;
      apiCalls.loadOldPosts(5);
      expect(mockGetPosts).toHaveBeenCalledWith(
        "/api/v1/posts/5?direction=before&page=0&size=5&sort=id,desc"
      );
    });
    test("calls /api/v1/users/user3/posts/5?direction=before&page=0&size=5&sort=id,desc when post id and username param provided", () => {
      const mockGetPosts = jest.fn();
      axios.get = mockGetPosts;
      apiCalls.loadOldPosts(5, "user3");
      expect(mockGetPosts).toHaveBeenCalledWith(
        "/api/v1/users/user3/posts/5?direction=before&page=0&size=5&sort=id,desc"
      );
    });
  });
  describe("loadNewPosts", () => {
    test("calls /api/v1/posts/5?direction=after&sort=id,desc when post id param provided", () => {
      const mockGetPosts = jest.fn();
      axios.get = mockGetPosts;
      apiCalls.loadNewPosts(5);
      expect(mockGetPosts).toHaveBeenCalledWith(
        "/api/v1/posts/5?direction=after&sort=id,desc"
      );
    });
    test("calls /api/v1/users/user3/posts/5?direction=after&sort=id,desc when post id and username param provided", () => {
      const mockGetPosts = jest.fn();
      axios.get = mockGetPosts;
      apiCalls.loadNewPosts(5, "user3");
      expect(mockGetPosts).toHaveBeenCalledWith(
        "/api/v1/users/user3/posts/5?direction=after&sort=id,desc"
      );
    });
  });
  describe("loadNewPostCount", () => {
    test("calls /api/v1/posts/5?direction=after&count=true when post id param provided", () => {
      const mockGetPosts = jest.fn();
      axios.get = mockGetPosts;
      apiCalls.loadNewPostCount(5);
      expect(mockGetPosts).toHaveBeenCalledWith(
        "/api/v1/posts/5?direction=after&count=true"
      );
    });
    test("calls /api/v1/users/user3/posts/5?direction=after&count=true when post id and username param provided", () => {
      const mockGetPosts = jest.fn();
      axios.get = mockGetPosts;
      apiCalls.loadNewPostCount(5, "user3");
      expect(mockGetPosts).toHaveBeenCalledWith(
        "/api/v1/users/user3/posts/5?direction=after&count=true"
      );
    });
  });
  describe("postPostFile", () => {
    test("calls /api/v1/posts/upload", () => {
      const mockPostPostFile = jest.fn();
      axios.post = mockPostPostFile;
      apiCalls.postPostFile();
      const path = mockPostPostFile.mock.calls[0][0];
      expect(path).toBe("/api/v1/posts/upload");
    });
  });
  describe("deletePost", () => {
    test("calls /api/v1/posts/5 when post id param provided as 5", () => {
      const mockDelete = jest.fn();
      axios.delete = mockDelete;
      apiCalls.deletePost(5);
      const path = mockDelete.mock.calls[0][0];
      expect(path).toBe("/api/v1/posts/5");
    });
  });
});
