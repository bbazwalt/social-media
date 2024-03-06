import Close from "@mui/icons-material/Close";
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ErrorSnackBar = ({ error, dispatchType }) => {
  const [openSnackBar, setOpenSnackBar] = useState(error);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      setOpenSnackBar(true);
      setTimeout(() => {
        handleCloseSnackBar();
      }, 5000);
    }
  }, [error]);

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
    dispatch({ type: dispatchType });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={openSnackBar}
      onClose={handleCloseSnackBar}
    >
      <SnackbarContent
        style={{ backgroundColor: "red", color: "white" }}
        message={<span>{error}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleCloseSnackBar}
          >
            <Close />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default ErrorSnackBar;
