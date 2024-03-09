import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deletePostIcon,
  postLikeIcon,
  postLikedIcon,
  postReplyIcon,
  repostIcon,
  repostedIcon,
  threeDotsIcon,
} from "../../data/icon/iconsData";
import { blankProfilePicture } from "../../data/image/imagesData";
import {
  deletePost,
  findAllUserLikedPosts,
  findAllUserPosts,
  likePost,
  repost,
} from "../../store/post/action";
import { formatCount, formatDateToNowShort } from "../../utils/otherUtils";
import "./../../styles/post/PostCard.css";
import ReplyModal from "./ReplyModal";

const PostCard = ({ item, isDetails }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReplyModal, setOpenReplyModal] = useState(false);

  const user = useSelector((store) => store.user.user);

  const likeIconRef = useRef(null);
  const repostIconRef = useRef(null);
  const open = Boolean(anchorEl);
  const timeAgoShort = formatDateToNowShort(item?.createdAt);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deletePost(item?.id, isDetails ? navigate : null));
    handleClose();
  };

  const handleOpenReplyModal = () => {
    setOpenReplyModal(true);
  };

  const handleCloseReplyModal = () => {
    setOpenReplyModal(false);
  };

  const handleLikePost = () => {
    if (likeIconRef?.current) {
      likeIconRef?.current?.classList?.add("animate-scale-up");
      setTimeout(() => {
        likeIconRef?.current?.classList?.remove("animate-scale-up");
      }, 200);
    }
    dispatch(likePost(item?.id));
    dispatch(findAllUserLikedPosts(user?.id));
  };

  const handleCreateRepost = () => {
    if (repostIconRef.current) {
      repostIconRef?.current?.classList?.add("animate-scale-up");
      setTimeout(() => {
        repostIconRef?.current?.classList?.remove("animate-scale-up");
      }, 200);
    }
    dispatch(repost(item?.id));
    dispatch(findAllUserPosts(user?.id));
  };

  const handlePostClick = () => {
    navigate(`/post/${item?.id}`);
  };

  const handleUserClick = () => {
    navigate(`/profile/${item?.user?.id}`);
  };

  return (
    <div className="border py-3 transition duration-300 hover:bg-zinc-100">
      <div className="flex">
        <Avatar
          className="ml-4 cursor-pointer"
          onClick={handleUserClick}
          src={item?.user?.profilePicture || blankProfilePicture}
        />
        <div className="-mt-2 w-full ">
          <div className="flex items-center justify-between">
            <div className=" ml-2 flex items-center ">
              <div
                className="cursor-pointer font-bold hover:underline"
                onClick={handleUserClick}
              >
                {item?.user?.fullName}
              </div>
              <div className="ml-1 opacity-70 ">
                @{item?.user?.username} • {timeAgoShort}
              </div>
              {item?.replyPost && (
                <div className="ml-2 font-medium  ">
                  • replied to
                  <span
                    className="ml-1 cursor-pointer text-blue-500 hover:underline"
                    onClick={() => navigate(`/post/${item?.replyFor}`)}
                  >
                    this post
                  </span>
                </div>
              )}
              {item?.reposted && (
                <div className="ml-2 flex items-center ">
                  • <span className="ml-2">{repostIcon}</span>
                  <span className="ml-1 text-sm font-bold opacity-70">
                    Reposted
                  </span>
                </div>
              )}
            </div>
            {item?.user?.id === user?.id && (
              <div>
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
                  <MenuItem onClick={handleDelete}>
                    <div className="mr-2" onClick={handleDelete}>
                      {deletePostIcon}
                    </div>
                    Delete
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
          <div onClick={handlePostClick} className="ml-2 cursor-pointer">
            <p className="mb-2 p-0">{item?.content}</p>
            {item?.image && (
              <img
                className="max-h-[20rem] w-fit max-w-[97%] rounded-2xl border-gray-300"
                src={item?.image}
                alt=""
              />
            )}
          </div>
          <div className=" ml-2 mt-1 flex flex-wrap items-center justify-between pt-1">
            <div className="flex w-[97%] flex-row justify-between text-gray-600">
              <div
                ref={likeIconRef}
                className={`flex cursor-pointer flex-row items-center hover:rounded-full hover:bg-gray-100 ${
                  item?.liked && "animate-scale-down"
                }`}
                onClick={handleLikePost}
              >
                <span className="mt-[0.1rem]">
                  {item?.liked ? postLikedIcon : postLikeIcon}
                </span>
                <div className="ml-[0.2rem]">
                  {formatCount(item?.totalLikes)}
                </div>
              </div>
              <div
                className="flex cursor-pointer flex-row items-center hover:rounded-full hover:bg-gray-100"
                onClick={handleOpenReplyModal}
              >
                <span className="mt-1">{postReplyIcon}</span>
                <div className="ml-[0.2rem]">
                  {formatCount(item?.totalReplies)}
                </div>
              </div>
              <div
                ref={repostIconRef}
                className={`flex cursor-pointer flex-row items-center hover:rounded-full hover:bg-gray-100 ${
                  item?.reposted && "animate-scale-down"
                }`}
                onClick={handleCreateRepost}
              >
                <span className="mt-0.5">
                  {item?.reposted ? repostedIcon : repostIcon}
                </span>
                <div className="ml-[0.2rem]">
                  {formatCount(item?.totalReposts)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section>
        <ReplyModal
          item={item}
          open={openReplyModal}
          handleClose={handleCloseReplyModal}
        />
      </section>
    </div>
  );
};

export default PostCard;
