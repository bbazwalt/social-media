import { Avatar, Button, Tab, Tabs } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { imgCloseIcon, postImageIcon } from "../../data/icon/iconsData";
import { blankProfilePicture } from "../../data/image/imagesData";
import {
  createPost,
  findAllFollowingUserPosts,
  findAllPosts,
} from "../../store/post/action";
import { scrollToTop } from "../../utils/otherUtils";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import EmptyItemsText from "../infoText/EmptyItemsText";
import LoadingText from "../infoText/LoadingText";
import PostCard from "../post/PostCard";

const validationSchema = Yup.object().shape({
  content: Yup.string().required("Post content is required."),
});

const tabStyle = {
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
};

const MiddleSection = () => {
  const [tabValue, setTabValue] = useState(1);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasFetchedPosts, setHasFetchedPosts] = useState(false);

  const posts = useSelector((store) => store.post.posts);
  const followingPosts = useSelector((store) => store.post.followingPosts);
  const user = useSelector((store) => store.user.user);
  const isLoading = useSelector((store) => store.post.isLoading);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    dispatch(findAllFollowingUserPosts());
  }, [user]);

  useEffect(() => {
    if (!hasFetchedPosts && posts.length === 0) {
      dispatch(findAllPosts());
      dispatch(findAllFollowingUserPosts());
      setHasFetchedPosts(true);
    }
  }, [dispatch, hasFetchedPosts]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectImage = async (event) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      setUploadingImage(true);
      const imgUrl = await uploadToCloudinary(fileInput.files[0]);
      formik.setFieldValue("image", imgUrl);
      setSelectedImage(imgUrl);
      setUploadingImage(false);
    }
    fileInput.value = "";
  };

  const handleSubmit = (values, actions) => {
    dispatch(createPost(values));
    actions.resetForm();
    setSelectedImage(null);
  };

  const formik = useFormik({
    initialValues: {
      content: "",
      image: null,
    },
    onSubmit: handleSubmit,
    validationSchema,
  });

  return (
    <div className="space-y-5  ">
      <section className="-mb-2 mt-2 flex">
        <Avatar
          className="ml-4 cursor-pointer"
          src={user?.profilePicture || blankProfilePicture}
          onClick={() => navigate(`/profile/${user?.id}`)}
        />
        <form className="ml-3 w-full " onSubmit={formik.handleSubmit}>
          <textarea
            type="text"
            name="content"
            rows="2"
            placeholder="Write a post"
            className="w-full resize-none border-none  bg-transparent pr-7 text-xl outline-none"
            {...formik.getFieldProps("content")}
          />
          {formik.errors.content && formik.touched.content && (
            <span className="text-red-500">{formik.errors.content}</span>
          )}
          {uploadingImage && <LoadingText content="Uploading..." />}
          {selectedImage && (
            <div className="-mb-8 mr-4 mt-4">
              {selectedImage && (
                <div>
                  <img
                    className="h-[25rem] w-[35rem] rounded-2xl object-cover"
                    src={selectedImage}
                    alt=""
                  />
                  <div
                    onClick={() => setSelectedImage(null)}
                    className=" h-[2rem] w-[2rem] -translate-y-[24.7rem] translate-x-[29.7rem] cursor-pointer  rounded-full bg-black opacity-60  hover:bg-gray-900"
                  >
                    <div className="ml-1.5 pt-1.5"> {imgCloseIcon}</div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <label className="flex cursor-pointer items-center space-x-2 rounded-md">
                {postImageIcon}
                <input
                  type="file"
                  name="imageFile"
                  className="hidden"
                  onChange={handleSelectImage}
                />
              </label>
            </div>
            <div className="pr-3">
              <Button
                variant="contained"
                type="submit"
                disabled={!formik.values.content}
                sx={{
                  fontSize: "1rem",
                  textTransform: "capitalize",
                  width: "100%",
                  borderRadius: "29px",
                  fontWeight: "bold",
                  boxShadow: "none",
                  ":hover": {
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    color: "white",
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                    fontWeight: "bold",
                  },
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </form>
      </section>
      <section>
        {isLoading && posts?.length === 0 ? (
          <LoadingText />
        ) : (
          <div className="border-t">
            <Tabs
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
              value={tabValue}
              onChange={handleTabChange}
              centered
            >
              <Tab sx={tabStyle} label="All" />
              <Tab sx={tabStyle} label="Following" />
            </Tabs>
            {tabValue === 0 ? (
              posts?.length === 0 && !isLoading ? (
                <EmptyItemsText content="posts" />
              ) : (
                posts?.map((item) => <PostCard item={item} key={item.id} />)
              )
            ) : null}
            {tabValue === 1 ? (
              followingPosts?.length === 0 && !isLoading ? (
                <EmptyItemsText content="posts" />
              ) : (
                followingPosts?.map((item) => (
                  <PostCard item={item} key={item.id} />
                ))
              )
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
};

export default MiddleSection;
