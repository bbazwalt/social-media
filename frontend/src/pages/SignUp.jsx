import { Button, Grid, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import { Formik, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import LoadingText from "../components/infoText/LoadingText";
import { signUp } from "../store/user/action";
import { CLEAR_USER_ERROR } from "../store/user/actionType";
import { useAuth } from "../store/user/authContext";
import { maxDate } from "../utils/otherUtils";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full Name is required.")
    .min(1, "Full Name must be at least 1 character.")
    .max(255, "Full Name must be at most 255 characters."),
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
  dateOfBirth: Yup.date()
    .required("Date of Birth is required.")
    .max(maxDate, "You must be at least 18 years old."),
});

const SignUp = () => {
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
      fullName: "",
      username: "",
      password: "",
      dateOfBirth: maxDate,
    },
    validationSchema,
    onSubmit: (values) => {
      const formattedDateOfBirth = format(values.dateOfBirth, "yyyy-MM-dd");
      const submissionValues = {
        ...values,
        dateOfBirth: formattedDateOfBirth,
      };
      dispatch(signUp(submissionValues, authSignIn));
    },
  });

  return (
    <div
      onClick={handleOnClick}
      className="flex min-h-screen flex-col items-center justify-center bg-gray-100"
    >
      <div>
        <h1 className="my-4 text-center text-3xl font-semibold">Sign Up</h1>
      </div>
      <div className=" min-h-full w-[30%]  min-w-[30rem] rounded-md bg-white p-10 px-8 pb-6 shadow-md">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Name"
                name="fullName"
                variant="outlined"
                size="large"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                variant="outlined"
                size="large"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                size="large"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <Formik>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    required
                    sx={{ width: "100%" }}
                    maxDate={new Date()}
                    label="Date of Birth"
                    format="yyyy/MM/dd"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={(value) => {
                      formik.setFieldValue("dateOfBirth", value);
                    }}
                    views={["year", "month", "day"]}
                    renderInput={(params) => (
                      <div>
                        <TextField {...params} />
                      </div>
                    )}
                  />
                </LocalizationProvider>
              </Formik>
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <div className="ml-3 mt-1 text-[.8rem] text-red-500">
                  {formik.errors.dateOfBirth}
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={isLoading}
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ padding: ".8rem 0" }}
              >
                SIGN UP
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && (
          <div className="mt-3 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {isLoading && <LoadingText />}
        <div className="mt-5 flex items-center justify-center space-x-1">
          <p className="m-0">Already have an account?</p>
          <Button
            variant="text"
            sx={{ mt: "0.15rem" }}
            onClick={() => navigate("/signin")}
          >
            SIGN IN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
