import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const ErrorSnackbar = ({ errorMessage, successMessage, snackbarShow, closeSnackbar }) => {
  const handleClose = (e, reason) => {
    // console.log(reason)
    if (reason === "clickaway") {
      return;
    }
    closeSnackbar();
  };

  let messageType;
  if (errorMessage) {
    messageType = 'error'
  } else {
    messageType = 'success'
  }

  // TODO include success snackbar
  return (<Snackbar autoHideDuration={3000} onClose={handleClose} open={snackbarShow}>
  <Alert onClose={handleClose} severity={messageType}>
    {errorMessage}
    {successMessage}
  </Alert>
</Snackbar>)
}
export default ErrorSnackbar