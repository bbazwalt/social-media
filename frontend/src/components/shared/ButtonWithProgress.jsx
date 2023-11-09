import React from "react";

const ButtonWithProgress = (props) => {
  return (
    <button
      data-testid={props.text + "-id"}
      className={props.className || "btn btn-primary"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.pendingApiCall && (
        <div
          className="spinner-border text-light spinner-border-sm mr-1"
          role="status"
          aria-hidden="true"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {props.text}
    </button>
  );
};

export default ButtonWithProgress;
