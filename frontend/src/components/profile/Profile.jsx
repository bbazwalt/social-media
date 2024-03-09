import { Avatar, Box, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  calenderIcon,
  linkIcon,
  locationIcon,
  profileBackIcon,
} from "../../data/icon/iconsData";
import { blankProfilePicture } from "../../data/image/imagesData";
import {
  findAllUserLikedPosts,
  findAllUserMediaPosts,
  findAllUserPosts,
  findAllUserReplyPosts,
} from "../../store/post/action";
import { findUserById, followUser } from "../../store/user/action";
import {
  ensureAbsoluteUrl,
  formatCreatedAt,
  formatDateOfBirth,
  scrollToTop,
  truncateLinkText,
} from "../../utils/otherUtils";
import EmptyItemsText from "../infoText/EmptyItemsText";
import LoadingText from "../infoText/LoadingText";
import PostCard from "../post/PostCard";
import EditProfileModal from "./EditProfileModal";
import FollowButton from "./FollowButton";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Profile = () => {
  const params = useParams();

  const [value, setValue] = useState(0);
  const [showStickyFollowButton, setShowStickyFollowButton] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const user = useSelector((store) => store.user.user);
  const findUser = useSelector((store) => store.user.findUser);
  const posts = useSelector((store) => store.post.posts);
  const userPosts = useSelector((store) => store.post.userPosts);
  const userReplyPosts = useSelector((store) => store.post.userReplyPosts);
  const userMediaPosts = useSelector((store) => store.post.userMediaPosts);
  const userLikedPosts = useSelector((store) => store.post.userLikedPosts);

  const isLoading = useSelector((store) => store.user.isLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const threshold = 250;
      setShowStickyFollowButton(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [params.id]);

  useEffect(() => {
    dispatch(findUserById(params.id, navigate));
    dispatch(findAllUserPosts(params.id));
    dispatch(findAllUserReplyPosts(params.id));
    dispatch(findAllUserMediaPosts(params.id));
    dispatch(findAllUserLikedPosts(params.id));
  }, [params.id, posts]);

  const handleOpen = () => {
    setOpenProfileModal(true);
  };

  const handleClose = () => {
    setOpenProfileModal(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFollowUser = () => {
    dispatch(followUser(params.id));
  };

  const handleFollowers = () => {
    navigate(`/profile/${params.id}/followers`);
  };

  const handleFollowing = () => {
    navigate(`/profile/${params.id}/following`);
  };

  return isLoading && !findUser ? (
    <LoadingText />
  ) : (
    <div className=" w-[100%] ">
      <section className="sticky top-0 z-50 flex items-center justify-between bg-[rgba(255,255,255,0.85)] backdrop-blur-[12px]">
        <div className="flex items-center">
          <span
            className="-mt-1 ml-2 h-9 w-9 cursor-pointer p-2 pl-2 hover:rounded-full hover:bg-zinc-200"
            onClick={() => navigate("/")}
          >
            {profileBackIcon}
          </span>
          <div className="-mt-3 ml-7 pb-1 pt-4">
            <h1 className=" text-xl font-bold opacity-90">
              {findUser?.fullName}
            </h1>
            <p className=" text-sm font-normal text-gray-600 opacity-90 ">
              {userPosts &&
                userPosts?.length +
                  " post" +
                  (userPosts?.length > 1 ? "s" : "")}
            </p>
          </div>
        </div>
        {!findUser?.reqUser && showStickyFollowButton && (
          <FollowButton
            handleFollowUser={handleFollowUser}
            findUser={findUser}
          />
        )}
      </section>
      <section>
        {findUser?.coverPicture ? (
          <img
            className="h-[12.5rem] w-[100%] cursor-pointer object-cover"
            src={findUser.coverPicture}
            alt={findUser.fullName}
          />
        ) : (
          <div
            className="h-[12.5rem] w-[100%] bg-[rgb(207,217,222)]"
            aria-label="No cover picture"
          ></div>
        )}
      </section>
      <section className="pl-4">
        <div className="mt-5 flex h-[5rem] items-start justify-between">
          <Avatar
            className="-translate-y-24 cursor-pointer"
            src={findUser?.profilePicture || blankProfilePicture}
            sx={{ width: "9rem", height: "9rem", border: "4px solid white" }}
          />
          <div className="-mt-0.5 ml-24 flex items-center space-x-5 text-base">
            <div
              onClick={handleFollowers}
              className="flex cursor-pointer items-center space-x-1 hover:underline"
            >
              <span className="font-semibold">
                {findUser?.followers?.length}
              </span>
              <span className="text-gray-500">Followers</span>
            </div>
            <div
              onClick={handleFollowing}
              className="flex cursor-pointer items-center space-x-1 hover:underline"
            >
              <span className="font-semibold">
                {findUser?.following?.length}
              </span>
              <span className="text-gray-500">Following</span>
            </div>
          </div>
          {findUser?.reqUser ? (
            <button
              onClick={handleOpen}
              className=" -mt-2 mr-5 h-9 rounded-full px-4 pb-[0.1rem]  font-semibold outline outline-1 outline-[rgb(207,217,222)] hover:bg-gray-200"
            >
              Edit profile
            </button>
          ) : (
            <FollowButton
              handleFollowUser={handleFollowUser}
              findUser={findUser}
            />
          )}
        </div>
        <div className="-mt-6 flex flex-col items-start">
          <h1 className="text-xl font-bold">{findUser?.fullName}</h1>
          <h1 className="-mt-1  text-gray-500">@{findUser?.username}</h1>
        </div>
        <div className="mt-2  space-y-2 ">
          {findUser?.bio && <p className="mr-4 break-words">{findUser.bio}</p>}
          <div className="flex flex-wrap items-center">
            {findUser?.location && (
              <div className="flex items-center text-gray-500">
                <span className="mr-1">{locationIcon}</span>
                <p className="mr-4">{findUser.location}</p>
              </div>
            )}
            {findUser?.website && (
              <div className="flex items-center text-gray-500">
                <span className="mr-1">{linkIcon}</span>
                <a
                  href={ensureAbsoluteUrl(findUser.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-4 text-[#1d9bf0] hover:underline"
                  title={findUser.website}
                >
                  {truncateLinkText(findUser.website)}
                </a>
              </div>
            )}
            <div className="flex items-center text-gray-500">
              <span className="mr-1">{calenderIcon}</span>
              <p className="mr-4">
                Born {formatDateOfBirth(new Date(findUser?.dateOfBirth))}
              </p>
            </div>
            <div className="flex items-center  text-gray-500">
              <span className="mr-1">{calenderIcon}</span>
              <p className="mr-4">
                Joined {formatCreatedAt(new Date(findUser?.createdAt))}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Box sx={{ width: "100%", mt: "10px" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", color: "black" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              pl: 0,
              "& .MuiTabs-flexContainer": {
                justifyContent: "space-around",
                pl: 0,
              },
            }}
          >
            {["Posts", "Replies", "Media", "Likes"].map((item, index) => (
              <Tab
                key={index}
                sx={{
                  flex: 1,
                  color: "gray",
                  fontSize: "16px",
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  "&.Mui-selected": {
                    color: "black",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(128, 128, 128, 0.2)",
                  },
                }}
                label={item}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {userPosts?.length === 0 && !isLoading ? (
            <EmptyItemsText content="posts" />
          ) : (
            userPosts?.map((item) => <PostCard key={item.id} item={item} />)
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {userReplyPosts?.length === 0 && !isLoading ? (
            <EmptyItemsText content="posts" />
          ) : (
            userReplyPosts?.map((item) => (
              <PostCard key={item.id} item={item} />
            ))
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {userMediaPosts?.length === 0 && !isLoading ? (
            <EmptyItemsText content="posts" />
          ) : (
            <div className="m-1 grid grid-cols-3 gap-1">
              {userMediaPosts?.map((item, index) => (
                <div
                  onClick={() => navigate(`/post/${item?.id}`)}
                  key={index}
                  className="relative w-full pt-[100%]"
                >
                  <img
                    className="absolute left-0 top-0 h-full w-full object-cover"
                    src={item?.image}
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          {userLikedPosts?.length === 0 && !isLoading ? (
            <EmptyItemsText content="posts" />
          ) : (
            userLikedPosts?.map((item) => (
              <PostCard key={item.id} item={item} />
            ))
          )}
        </CustomTabPanel>
      </Box>
      <EditProfileModal
        item={user}
        handleClose={handleClose}
        open={openProfileModal}
      />
    </div>
  );
};

export default Profile;
