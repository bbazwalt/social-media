import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { connect } from "react-redux";
import * as apiCalls from "../../api/apiCalls";
import ProfileImageWithDefault from "../profile/ProfileImageWithDefault";
import ButtonWithProgress from "../shared/ButtonWithProgress";
import Input from "../shared/Input";

const PostSubmit = (props) => {
  const [focused, setFocused] = useState(false);
  const [content, setContent] = useState(undefined);
  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [attachment, setAttachment] = useState(undefined);

  const onChangeContent = (event) => {
    const value = event.target.value;
    setContent(value);
    setErrors({});
  };

  const onFileSelect = (event) => {
    if (event.target.files.length === 0) {
      return;
    }
    const newfile = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setFile(newfile);
    };
    reader.readAsDataURL(newfile);
  };

  useEffect(() => {
    if (file) {
      const body = new FormData();
      body.append("file", file);
      apiCalls.postPostFile(body).then((response) => {
        setAttachment(response.data);
      });
    }
  }, [file]);

  const resetState = () => {
    setAttachment();
    setContent("");
    setErrors({});
    setFile();
    setPendingApiCall(false);
    setFocused(false);
    setImage();
  };

  const onClickPost = () => {
    const body = {
      content: content,
      attachment: attachment,
    };
    setPendingApiCall(true);
    apiCalls
      .postPost(body)
      .then((response) => {
        resetState();
      })
      .catch((error) => {
        let errors = {};
        if (error.response.data && error.response.data.validationErrors) {
          errors = error.response.data.validationErrors;
        }
        setPendingApiCall(false);
        setErrors(errors);
      });
  };

  const onFocus = () => {
    setFocused(true);
  };

  let textAreaClassName = "form-control w-100";
  if (errors.content) {
    textAreaClassName += " is-invalid";
  }
  return (
    <div className="card d-flex flex-row p-1">
      <ProfileImageWithDefault
        className="rounded-circle m-1"
        width="32"
        height="32"
        image={props.loggedInUser.image}
      />
      <div className="flex-fill">
        <textarea
          className={textAreaClassName}
          rows={focused ? 3 : 1}
          onFocus={onFocus}
          value={content}
          onChange={onChangeContent}
          aria-label="text-area"
        />
        {errors.content && (
          <span className="invalid-feedback">{errors.content}</span>
        )}
        {focused && (
          <div>
            <div className="pt-1">
              <Input type="file" onChange={onFileSelect} />
              {image && (
                <img
                  className="mt-1 img-thumbnail"
                  src={image}
                  alt="upload"
                  width="128"
                  height="64"
                />
              )}
            </div>
            <div className="text-right mt-1">
              <ButtonWithProgress
                className="btn btn-success"
                disabled={pendingApiCall}
                onClick={onClickPost}
                pendingApiCall={pendingApiCall}
                text="Post"
              />
              <button
                className="btn btn-outline-danger ms-3"
                onClick={resetState}
                disabled={pendingApiCall}
              >
                <AiOutlineClose className="mb-1" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};

export default connect(mapStateToProps)(PostSubmit);
