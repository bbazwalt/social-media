import { Avatar, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  imgCloseIcon,
  modalCloseIcon,
  postImageIcon,
} from "../../data/icon/iconsData";
import { blankProfilePicture } from "../../data/image/imagesData";
import { createReplyPost } from "../../redux/post/action";
import { formatDateToNowShort } from "../../utils/otherUtils";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import LoadingText from "../infoText/LoadingText";

const style = {
  position: "absolute",
  top: "33%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  pl: 1.6,
  pt: 1,
  outline: "none",
  borderRadius: 4,
};

const imageStyle = {
  ...style,
  top: "50%",
};

const validationSchema = Yup.object().shape({
  content: Yup.string().required("Post content is required."),
});

const ReplyModal = ({ handleClose, open, item }) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const user = useSelector((store) => store.user.user);

  const timeAgoShort = formatDateToNowShort(item?.createdAt);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (values, { resetForm }) => {
    dispatch(createReplyPost(values, handleClose, resetForm));
    setSelectedImage(null);
    handleClose();
    navigate("/post/" + item?.id);
    dispatch();
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

  const formik = useFormik({
    initialValues: {
      content: "",
      image: null,
      postId: item?.id,
    },
    onSubmit: handleSubmit,
    validationSchema,
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={selectedImage ? imageStyle : style}>
        <div
          className="-ml-[0.3rem] h-9 w-9 cursor-pointer p-2 pl-1 hover:rounded-full hover:bg-zinc-200"
          onClick={handleClose}
        >
          <div className=" ml-[0.25rem]">{modalCloseIcon}</div>
        </div>
        <div className="mt-5 flex">
          <Avatar
            className="mr-2 cursor-pointer"
            onClick={() => navigate("/profile/" + item?.user?.id)}
            src={item?.user?.profilePicture || blankProfilePicture}
          />
          <div className="-mt-2 w-full">
            <div className="ml-2 flex cursor-pointer items-center ">
              <span
                onClick={() => navigate(`/profile/${item?.user?.id}`)}
                className="font-bold hover:underline "
              >
                {item?.user?.fullName}
              </span>
              <span className="ml-1 opacity-70 ">
                @{item?.user?.username} • {timeAgoShort}
              </span>
            </div>
            <div
              onClick={() => navigate(`/post/${item?.id}`)}
              className="mb-2 ml-2 max-w-[32.3rem] cursor-pointer pr-[1rem]"
            >
              {item?.content + " "}
              {item?.image && (
                <a
                  href={item.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.image}
                  className="break-words text-gray-500 hover:underline"
                >
                  {item.image}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="ml-12">
          <span className="ml-2 text-gray-500 ">Replying to </span>
          <span
            className="cursor-pointer text-[#1976d2] hover:underline"
            onClick={() => navigate("/profile/" + item?.user?.id)}
          >
            @{item?.user?.username}
          </span>
        </div>
        <form className="mt-5 pb-2" onSubmit={formik.handleSubmit}>
          <div className="flex">
            <Avatar
              className="mr-2 cursor-pointer"
              src={user?.profilePicture || blankProfilePicture}
              onClick={() => navigate(`/profile/${user?.id}`)}
            />
            <div className="ml-2 w-full">
              <textarea
                type="text"
                name="content"
                rows="4"
                placeholder="Post your reply"
                className="w-full resize-none border-none  bg-transparent pr-7 text-xl outline-none"
                {...formik.getFieldProps("content")}
              />
              {formik.errors.content && formik.touched.content && (
                <span className="text-red-500">{formik.errors.content}</span>
              )}
              {uploadingImage && <LoadingText content="Uploading..." />}
              {selectedImage && (
                <div className="-mb-8 mr-4 mt-4">
                  <img
                    className="h-[15rem] w-[35rem] rounded-2xl object-cover"
                    src={selectedImage}
                    alt=""
                  />
                  <div
                    onClick={() => setSelectedImage(null)}
                    className=" h-[2rem] w-[2rem] -translate-y-[14.7rem] translate-x-[30rem] cursor-pointer  rounded-full bg-black opacity-60  hover:bg-gray-900"
                  >
                    <div className="ml-1.5 pt-1.5"> {imgCloseIcon}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <label className="flex cursor-pointer items-center space-x-2 rounded-md">
              {postImageIcon}
              <input
                type="file"
                name="imageFile"
                className="hidden"
                onChange={handleSelectImage}
              />
            </label>
            <div className="pr-3">
              <Button
                variant="contained"
                type="submit"
                disabled={
                  !formik.values.content || !formik.values.content.trim()
                }
                sx={{
                  fontSize: "0.9rem",
                  textTransform: "capitalize",
                  width: "100%",
                  fontWeight: "700",
                  borderRadius: "29px",
                  px: "1rem",
                  py: "0.3rem",
                  boxShadow: "none",
                  ":hover": {
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    color: "white",
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  },
                }}
              >
                Reply
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ReplyModal;
