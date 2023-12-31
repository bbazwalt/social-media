import { useEffect, useState } from "react";
import * as apiCalls from "../../api/apiCalls";
import Spinner from "../shared/Spinner";
import Modal from "./Modal";
import PostView from "./PostView";

const PostFeed = (props) => {
  const [page, setPage] = useState({ content: [] });
  const [isLoadingPosts, setLoadingPosts] = useState(false);
  const [isLoadingOldPosts, setLoadingOldPosts] = useState(false);
  const [isLoadingNewPosts, setLoadingNewPosts] = useState(false);
  const [isDeletingPost, setDeletingPost] = useState(false);
  const [newPostCount, setNewPostCount] = useState(0);
  const [postToBeDeleted, setPostToBeDeleted] = useState();
  const [noUserError, setNoUserError] = useState(false);

  useEffect(() => {
    const loadPosts = () => {
      setLoadingPosts(true);
      apiCalls
        .loadPosts(props.user)
        .then((response) => {
          setLoadingPosts(false);
          setPage(response.data);
          setNoUserError(false);
        })
        .catch((error) => {
          setLoadingPosts(false);
          setPage({ content: [] });
          setNoUserError(true);
        });
    };
    loadPosts();
  }, [props.user]);

  useEffect(() => {
    const checkCount = () => {
      const posts = page.content;
      let topPostId = 0;
      if (posts.length > 0) {
        topPostId = posts[0].id;
      }
      apiCalls
        .loadNewPostCount(topPostId, props.user)
        .then((response) => {
          setNewPostCount(response.data.count);
          setNoUserError(false);
        })
        .catch((error) => {
          setLoadingNewPosts(false);
          setPage({ content: [] });
          setNoUserError(true);
        });
    };
    const counter = setInterval(checkCount, 3000);
    return function cleanup() {
      clearInterval(counter);
    };
  }, [props.user, page.content]);

  const onClickLoadMore = () => {
    if (isLoadingOldPosts) {
      return;
    }
    const posts = page.content;
    if (posts.length === 0) {
      return;
    }
    const postAtBottom = posts[posts.length - 1];
    setLoadingOldPosts(true);
    apiCalls
      .loadOldPosts(postAtBottom.id, props.user)
      .then((response) => {
        setPage((previousPage) => ({
          ...previousPage,
          last: response.data.last,
          content: [...previousPage.content, ...response.data.content],
        }));
        setLoadingOldPosts(false);
        setNoUserError(false);
      })
      .catch((error) => {
        setLoadingOldPosts(false);
        setPage({ content: [] });
        setNoUserError(true);
      });
  };

  const onClickLoadNew = () => {
    if (isLoadingNewPosts) {
      return;
    }
    const posts = page.content;
    let topPostId = 0;
    if (posts.length > 0) {
      topPostId = posts[0].id;
    }
    setLoadingNewPosts(true);
    apiCalls
      .loadNewPosts(topPostId, props.user)
      .then((response) => {
        setPage((previousPage) => ({
          ...previousPage,
          content: [...response.data, ...previousPage.content],
        }));
        setLoadingNewPosts(false);
        setNewPostCount(0);
        setNoUserError(false);
      })
      .catch((error) => {
        setLoadingNewPosts(false);
        setPage({ content: [] });
        setNoUserError(true);
      });
  };

  const onClickModalOk = () => {
    setDeletingPost(true);
    apiCalls.deletePost(postToBeDeleted.id).then((response) => {
      setPage((previousPage) => ({
        ...previousPage,
        content: previousPage.content.filter(
          (post) => post.id !== postToBeDeleted.id
        ),
      }));
      setDeletingPost(false);
      setPostToBeDeleted();
    });
  };

  if (isLoadingPosts) {
    return <Spinner />;
  }
  if (page.content.length === 0 && newPostCount === 0 && !noUserError) {
    return (
      <div className="card card-body text-center mt-3">There are no posts</div>
    );
  }
  const newPostCountMessage =
    newPostCount === 1
      ? "There is 1 new post"
      : `There are ${newPostCount} new posts`;
  return (
    <div>
      {newPostCount > 0 && (
        <div
          className="card card-header text-center"
          onClick={onClickLoadNew}
          style={{
            cursor: isLoadingNewPosts ? "not-allowed" : "pointer",
          }}
        >
          {isLoadingNewPosts ? <Spinner /> : newPostCountMessage}
        </div>
      )}
      {page.content.map((post) => {
        return (
          <PostView
            key={post.id}
            post={post}
            onClickDelete={() => setPostToBeDeleted(post)}
          />
        );
      })}
      {page.last === false && (
        <div
          className="card card-header text-center"
          onClick={onClickLoadMore}
          style={{
            cursor: isLoadingOldPosts ? "not-allowed" : "pointer",
          }}
        >
          {isLoadingOldPosts ? <Spinner /> : "Load More"}
        </div>
      )}
      <Modal
        visible={postToBeDeleted && true}
        onClickCancel={() => setPostToBeDeleted()}
        body={
          postToBeDeleted &&
          `Are you sure to delete the post '${postToBeDeleted.content}'?`
        }
        title="Confirm Deletion"
        okButton="Delete Post"
        onClickOk={onClickModalOk}
        pendingApiCall={isDeletingPost}
      />
    </div>
  );
};

export default PostFeed;
