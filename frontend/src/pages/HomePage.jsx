import React from "react";
import UserList from "../components/user/UserList";
import { connect } from "react-redux";
import PostSubmit from "../components/post/PostSubmit";
import PostFeed from "../components/post/PostFeed";

const HomePage = (props) => {
  return (
    <div data-testid="homepage">
      <div className="row">
        <div className="col-8">
          {props.loggedInUser.isLoggedIn && <PostSubmit />}
          <PostFeed />
        </div>
        <div className="col-4">
          <UserList />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};

export default connect(mapStateToProps)(HomePage);
