import { AiFillSave, AiOutlineClose } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import ButtonWithProgress from "../shared/ButtonWithProgress";
import Input from "../shared/Input";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

const ProfileCard = (props) => {
  const { displayName, username, image } = props.user;
  const showEditButton = props.isEditable && !props.inEditMode;

  return (
    <div className="card">
      <div className="card-header text-center">
        <ProfileImageWithDefault
          alt="profile"
          width="200"
          height="200"
          image={image}
          src={props.loadedImage}
          className="rounded-circle shadow"
        />
      </div>
      <div className="card-body text-center">
        {!props.inEditMode && <h4>{`${displayName}@${username}`}</h4>}
        {props.inEditMode && (
          <div className="mb-2">
            <Input
              value={displayName}
              label={`Change Display Name for ${username}`}
              onChange={props.onChangeDisplayName}
              hasError={props.errors.displayName && true}
              error={props.errors.displayName}
            />
            <div className="mt-2">
              <Input
                type="file"
                onChange={props.onFileSelect}
                hasError={props.errors.image && true}
                error={props.errors.image}
              />
            </div>
          </div>
        )}
        {showEditButton && (
          <button
            className="btn btn-outline-primary"
            onClick={props.onClickEdit}
          >
            <BsPencilFill className="mb-1" /> Edit
          </button>
        )}
        {props.inEditMode && (
          <div>
            <ButtonWithProgress
              className="btn btn-success"
              onClick={props.onClickSave}
              text={
                <span>
                  <AiFillSave className="mb-1" /> Save
                </span>
              }
              pendingApiCall={props.pendingUpdateCall}
              disabled={props.pendingUpdateCall}
            />
            <button
              className="btn btn-outline-danger ms-3"
              onClick={props.onClickCancel}
              disabled={props.pendingUpdateCall}
            >
              <AiOutlineClose className="mb-1" /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ProfileCard.defaultProps = {
  errors: {},
};

export default ProfileCard;
