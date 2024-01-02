import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonWithProgress from "../components/shared/ButtonWithProgress";
import Input from "../components/shared/Input";
import * as authActions from "../redux/authActions";

const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState(undefined);
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setApiError();
  }, [username, password]);

  useEffect(() => {
    setApiError();
  }, [username, password]);
  const onClickLogin = () => {
    const body = {
      username,
      password,
    };
    setPendingApiCall(true);
    props.actions
      .postLogin(body)
      .then((response) => {
        setPendingApiCall(false);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          setPendingApiCall(false);
          setApiError(error.response.data.message);
        }
      });
  };

  let disableSubmit = false;
  if (!username || !password) {
    disableSubmit = true;
  }

  return (
    <div className="container w-50 mt-4">
      <h1 className="text-center">Login</h1>
      <div className="col-12 mb-3">
        <Input
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
        />
      </div>
      {apiError && (
        <div className="col-12 mb-3">
          <div className="alert alert-danger">{apiError}</div>
        </div>
      )}
      <div className="text-center">
        <ButtonWithProgress
          onClick={onClickLogin}
          disabled={disableSubmit || pendingApiCall}
          text="Login"
          pendingApiCall={pendingApiCall}
        />
      </div>
    </div>
  );
};

LoginPage.defaultProps = {
  actions: {
    postLogin: () =>
      new Promise((resolve, reject) => {
        resolve({});
      }),
  },
  dispatch: () => {},
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postLogin: (body) => dispatch(authActions.loginHandler(body)),
    },
  };
};

export default connect(null, mapDispatchToProps)(LoginPage);
