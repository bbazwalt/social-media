import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import LoadingText from "../components/infoText/LoadingText";
import { signIn } from "../store/user/action";
import { CLEAR_USER_ERROR } from "../store/user/actionType";
import { useAuth } from "../store/user/authContext";

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required.")
    .matches(
      /^[a-zA-Z][a-zA-Z0-9_.]{5,28}$/,
      "Username must start with a letter and contain only letters, numbers, underscores, or periods. It must be between 6 to 29 characters long.",
    ),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .max(255, "Password must not exceed 255 characters.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    ),
});

const SignIn = () => {
  const error = useSelector((store) => store.user.error);
  const isLoading = useSelector((store) => store.user.isLoading);

  const { authSignIn } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnClick = () => {
    dispatch({ type: CLEAR_USER_ERROR });
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(signIn(values, authSignIn));
    },
  });

  return (
    <div
      onClick={handleOnClick}
      className="flex min-h-screen flex-col items-center justify-center bg-gray-100"
    >
      <div>
        <h1 className="my-4 text-center text-3xl font-semibold">Sign In</h1>
      </div>
      <div className=" min-h-full w-[30rem] rounded-md bg-white  p-10 px-8 pb-8 shadow-md">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              id="username"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </div>
          <div>
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              autoComplete="password"
              type="password"
              id="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </div>
          <div>
            <Button
              disabled={isLoading}
              className="w-full bg-[#1976D2]"
              type="submit"
              variant="contained"
              size="large"
              sx={{ padding: ".8rem 0" }}
            >
              SIGN IN
            </Button>
          </div>
        </form>
        {error && (
          <div className="mt-3 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {isLoading && <LoadingText />}
        <div className="mt-5 flex items-center justify-center space-x-1">
          <p className="m-0">Don't have an account yet?</p>
          <Button
            variant="text"
            sx={{ mt: "0.15rem" }}
            onClick={() => navigate("/signup")}
          >
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
