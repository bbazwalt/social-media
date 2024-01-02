import { connect } from "react-redux";
import PostFeed from "../components/post/PostFeed";
import PostSubmit from "../components/post/PostSubmit";
import UserList from "../components/user/UserList";

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
