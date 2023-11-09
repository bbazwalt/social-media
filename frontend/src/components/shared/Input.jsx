import React from "react";

const Input = (props) => {
  let inputClassName = "form-control";

  if (props.hasError !== undefined) {
    inputClassName += props.hasError ? " is-invalid" : " is-valid";
  }
  return (
    <div>
      {props.label && <label htmlFor={props.label}>{props.label}</label>}
      <input
        name={props.name}
        id={props.label}
        value={props.value}
        placeholder={props.placeholder}
        type={props.type || "text"}
        onChange={props.onChange}
        className={inputClassName}
        aria-label={props.type || "text"}
      />
      {props.hasError && (
        <span className="invalid-feedback">{props.error}</span>
      )}
    </div>
  );
};

Input.defaultProps = {
  onChange: () => {},
};

export default Input;
