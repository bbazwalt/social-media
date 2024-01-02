import { useEffect, useReducer } from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import * as apiCalls from "../api/apiCalls";
import PostFeed from "../components/post/PostFeed";
import ProfileCard from "../components/profile/ProfileCard";
import Spinner from "../components/shared/Spinner";
import { userReducer } from "../redux/userReducer";

const UserPage = (props) => {
  const [state, dispatch] = useReducer(userReducer, {
    user: undefined,
    userNotFound: false,
    isLoadingUser: false,
    inEditMode: false,
    originalDisplayName: undefined,
    pendingUpdateCall: false,
    image: undefined,
    errors: {},
  });

  let { username } = useParams();

  useEffect(() => {
    const usernameNew = props.match.params.username || username;
    if (!usernameNew) {
      return;
    }
    dispatch({ type: "LOADING_USER" });
    apiCalls
      .getUser(usernameNew)
      .then((response) => {
        dispatch({ type: "LOAD_USER_SUCCESS", payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: "LOAD_USER_FAILURE" });
      });
  }, [props.match.params.username, username]);

  const onClickSave = () => {
    const userId = props.loggedInUser.id;
    const userUpdate = {
      displayName: state.user.displayName,
      image: state.image && state.image.split(",")[1],
    };
    dispatch({ type: "UPDATE_PROGRESS" });
    apiCalls
      .updateUser(userId, userUpdate)
      .then((response) => {
        dispatch({ type: "UPDATE_SUCCESS", payload: response.data.image });
        const updatedUser = { ...state.user };
        updatedUser.image = response.data.image;
        const action = {
          type: "UPDATE_SUCCESS",
          payload: updatedUser,
        };
        props.dispatch(action);
      })
      .catch((error) => {
        let errors = {};
        if (error.response.data.validationErrors) {
          errors = error.response.data.validationErrors;
        }
        dispatch({ type: "UPDATE_FAILURE", payload: errors });
      });
  };

  const onFileSelect = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      dispatch({ type: "SELECT_FILE", payload: reader.result });
    };
    reader.readAsDataURL(file);
  };

  let pageContent;

  if (state.isLoadingUser) {
    pageContent = <Spinner />;
  } else if (state.userNotFound) {
    pageContent = (
      <div className="alert alert-danger text-center">
        <BsFillExclamationTriangleFill size="100" />
        <h5>User not found</h5>
      </div>
    );
  } else {
    const isEditable =
      props.loggedInUser.username === props.match.params.username ||
      props.loggedInUser.username === username;
    pageContent = state.user && (
      <ProfileCard
        user={state.user}
        isEditable={isEditable}
        inEditMode={state.inEditMode}
        onClickEdit={() => dispatch({ type: "EDIT_MODE" })}
        onClickCancel={() => dispatch({ type: "CANCEL" })}
        onClickSave={onClickSave}
        onChangeDisplayName={(event) =>
          dispatch({ type: "UPDATE_DISPLAYNAME", payload: event.target.value })
        }
        pendingUpdateCall={state.pendingUpdateCall}
        loadedImage={state.image}
        onFileSelect={onFileSelect}
        errors={state.errors}
      />
    );
  }
  return (
    <div data-testid="userpage">
      <div className="row">
        <div className="col">{pageContent}</div>
        <div className="col">
          <PostFeed user={props.match.params.username || username} />
        </div>
      </div>
    </div>
  );
};

UserPage.defaultProps = {
  match: {
    params: {},
  },
};
const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};

export default connect(mapStateToProps)(UserPage);
