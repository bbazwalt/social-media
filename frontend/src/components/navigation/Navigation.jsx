import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { threeDotsIcon } from "../../data/icon/iconsData";
import { blankProfilePicture } from "../../data/image/imagesData";
import { navigationData } from "../../data/navigation/navigationData";
import { CLEAR_POST_ERROR } from "../../redux/post/actionType";
import { signOut } from "../../redux/user/action";
import { useAuth } from "../../redux/user/authContext";
import { truncateUserText } from "../../utils/otherUtils";
import PostModal from "../post/PostModal";
import ErrorSnackBar from "../snackBar/ErrorSnackBar";

const Navigation = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPostModal, setOpenPostModal] = useState(false);

  const user = useSelector((store) => store.user.user);
  const error = useSelector((store) => store.post.error);

  const { authSignOut } = useAuth();
  const open = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    setOpenPostModal(true);
  };

  const handleCloseModal = () => {
    setOpenPostModal(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (itemPath) => {
    if (itemPath === "/profile" && location.pathname.includes("/profile/")) {
      return location.pathname === `${itemPath}/${user?.id}`;
    }
    return location.pathname === itemPath;
  };

  const handleSignOut = () => {
    handleClose();
    dispatch(signOut(authSignOut));
  };

  return (
    <div className="sticky top-0 -ml-5 flex h-screen w-[98%] flex-col justify-between">
      <div>
        <div>
          {navigationData.map((item) => (
            <div
              key={item.title}
              onClick={() =>
                item.title === "Profile"
                  ? navigate(item.path + "/" + user?.id)
                  : navigate(item.path)
              }
              className="my-1 flex h-12 w-fit cursor-pointer items-center pl-3 pr-7  hover:rounded-full hover:bg-zinc-200"
            >
              {isActive(item.path) ? item.activeIcon : item.icon}
              <p className="ml-5   text-xl">{item.title}</p>
            </div>
          ))}
        </div>
        <Button
          onClick={handleOpenModal}
          variant="contained"
          sx={{
            my: "0.5rem",
            fontSize: "1.05rem",
            textTransform: "capitalize",
            width: "95%",
            fontWeight: "bold",
            borderRadius: "29px",
            py: "12px",
            boxShadow: "none",
            ":hover": {
              boxShadow: "none",
            },
          }}
        >
          Post
        </Button>
      </div>
      <div>
        <PostModal
          open={openPostModal}
          profilePicture={user?.profilePicture}
          handleClose={handleCloseModal}
        />
        <div className="my-5 ml-4 flex items-center justify-between">
          <div className="flex items-center justify-between ">
            <Avatar
              src={user?.profilePicture || blankProfilePicture}
              className="cursor-pointer"
              onClick={() => navigate("/profile/" + user?.id)}
            />
            <div className="ml-2 mr-16 flex w-20 flex-col">
              <span className="break-words ">
                {user?.fullName && truncateUserText(user.fullName)}
              </span>
              <span className="break-words opacity-70 ">
                @{user?.username && truncateUserText(user.username)}
              </span>
            </div>
          </div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            {threeDotsIcon}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </div>
      </div>
      {error && <ErrorSnackBar error={error} dispatchType={CLEAR_POST_ERROR} />}
    </div>
  );
};

export default Navigation;
