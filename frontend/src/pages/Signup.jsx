import React, { useState } from "react";
import Input from "../components/shared/Input";
import ButtonWithProgress from "../components/shared/ButtonWithProgress";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import * as authActions from "../redux/authActions";

const Signup = (props) => {
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    password: "",
    passwordRepeat: "",
  });
  const [errors, setErrors] = useState({});
  const [pendingApiCall, setPendingApiCall] = useState(false);

  const navigate = useNavigate();

  const onChange = (event) => {
    const { value, name } = event.target;

    setForm((previousForm) => {
      return {
        ...previousForm,
        [name]: value,
      };
    });

    setErrors((previousErrors) => {
      return {
        ...previousErrors,
        [name]: undefined,
      };
    });
  };

  const onClickSignup = () => {
    const user = {
      username: form.username,
      displayName: form.displayName,
      password: form.password,
    };
    setPendingApiCall(true);
    props.actions
      .postSignup(user)
      .then((response) => {
        setPendingApiCall(false);
        navigate("/");
      })
      .catch((apiError) => {
        if (
          apiError.response &&
          apiError.response.data &&
          apiError.response.data.validationErrors
        ) {
          setErrors(apiError.response.data.validationErrors);
        }
        setPendingApiCall(false);
      });
  };

  let passwordRepeatError;
  const { password, passwordRepeat } = form;
  if (password || passwordRepeat) {
    passwordRepeatError =
      password === passwordRepeat ? "" : "Does not match to password";
  }

  return (
    <div className="container w-50 mt-4">
      <h1 className="text-center">Sign Up</h1>
      <div className="col-12 mb-3">
        <Input
          name="displayName"
          label="Display Name"
          placeholder="Enter your display name"
          value={form.displayName}
          onChange={onChange}
          hasError={errors.displayName && true}
          error={errors.displayName}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          name="username"
          label="Username"
          className="form-control mt-1"
          type="text"
          placeholder="Enter your username"
          value={form.username}
          onChange={onChange}
          hasError={errors.username && true}
          error={errors.username}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          name="password"
          label="Password"
          className="form-control mt-1"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={onChange}
          hasError={errors.password && true}
          error={errors.password}
        />
      </div>
      <div className="col-12 mb-3">
        <Input
          name="passwordRepeat"
          label="Repeat Password"
          className="form-control mt-1"
          type="password"
          placeholder="Enter your password again"
          value={form.passwordRepeat}
          onChange={onChange}
          hasError={passwordRepeatError && true}
          error={passwordRepeatError}
        />
      </div>
      <div className="text-center">
        <ButtonWithProgress
          onClick={onClickSignup}
          disabled={pendingApiCall || passwordRepeatError}
          pendingApiCall={pendingApiCall}
          text="Sign Up"
        />
      </div>
    </div>
  );
};

Signup.defaultProps = {
  actions: {
    postSignup: () =>
      new Promise((resolve, reject) => {
        resolve({});
      }),
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postSignup: (user) => dispatch(authActions.signupHandler(user)),
    },
  };
};

export default connect(null, mapDispatchToProps)(Signup);
