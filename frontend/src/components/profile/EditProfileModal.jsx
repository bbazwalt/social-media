import { Avatar, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { modalCloseIcon, updatePictureIcon } from "../../data/icon/iconsData";
import { blankProfilePicture } from "../../data/image/imagesData";
import { updateUser } from "../../store/user/action";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "none",
  height: "39rem",
  boxShadow: 24,
  borderRadius: 4,
  outline: "none",
};

const EditProfileModal = ({ item, open, handleClose }) => {
  const [isuploading, setIsUploading] = useState(false);

  const fullNameRef = useRef(null);
  const bioRef = useRef(null);
  const locationRef = useRef(null);
  const websiteRef = useRef(null);
  const dispatch = useDispatch();

  const scrollToView = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleSubmit = (values, actions) => {
    dispatch(updateUser(values));
    actions.resetForm();
    handleClose();
  };

  const handleImageChange = async (event) => {
    setIsUploading(true);
    const { name } = event.target;
    const file = await uploadToCloudinary(event.target.files[0]);
    formik.setFieldValue(name, file);
    setIsUploading(false);
  };

  const handleCloseModal = () => {
    handleClose();
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      fullName: item?.fullName,
      website: item?.website,
      location: item?.location,
      bio: item?.bio,
      coverPicture: item?.coverPicture,
      profilePicture: item?.profilePicture,
    },
    onSubmit: handleSubmit,
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit}>
          <div className="sticky z-50 flex h-[3.3rem] items-center justify-between rounded-t-3xl bg-[rgba(255,255,255,0.85)] pb-2 backdrop-blur-[12px]">
            <div className="flex items-center justify-center">
              <div
                className="ml-1 mt-3 cursor-pointer p-2 hover:rounded-full hover:bg-zinc-200"
                onClick={handleCloseModal}
              >
                {modalCloseIcon}
              </div>
              <h1 className=" ml-7 mt-3 pb-1 text-xl font-bold opacity-90">
                Edit profile
              </h1>
            </div>
            <button
              onClick={formik.handleSubmit}
              type="submit"
              className="button-hover mr-3 mt-3 h-8 rounded-full bg-black px-4 pb-0.5 pt-0 font-bold text-white hover:bg-neutral-600"
            >
              Save
            </button>
          </div>
          <div className="h-[80vh] overflow-x-hidden overflow-y-scroll ">
            <div>
              <div className="relative w-full">
                <img
                  className={`h-[12.2rem] w-full border-2 border-white object-cover object-center ${
                    !formik.values.coverPicture && "bg-[#b2b2b2] "
                  }`}
                  src={`${
                    formik.values.coverPicture ? formik.values.coverPicture : ""
                  } `}
                  alt=""
                />
                <input
                  type="file"
                  id="backgroundImageInput"
                  className="absolute left-0 top-0 hidden h-full w-full opacity-0 "
                  onChange={handleImageChange}
                  name="coverPicture"
                />
                <div
                  onClick={() =>
                    document.getElementById("backgroundImageInput").click()
                  }
                  className=" ml-[16.8rem] h-[2.7rem] w-[2.7rem] -translate-y-[7.5rem] cursor-pointer rounded-full bg-black p-2.5 opacity-60 hover:bg-gray-900"
                >
                  {updatePictureIcon}
                </div>
              </div>
              <div className="ml-4 h-[2rem] w-full -translate-y-[5.5rem]">
                <div className="relative">
                  <Avatar
                    sx={{
                      width: "7.5rem",
                      height: "7.5rem",
                      border: "4px solid white",
                    }}
                    src={`${
                      formik.values.profilePicture
                        ? formik.values.profilePicture
                        : blankProfilePicture
                    } `}
                  />
                  {isuploading && (
                    <div className="absolute -translate-y-12 translate-x-44 text-xl font-medium">
                      Please wait. Uploading...
                    </div>
                  )}
                  <input
                    type="file"
                    id="imageInput"
                    className="absolute left-0 top-0 hidden h-full w-full opacity-0 "
                    onChange={handleImageChange}
                    name="profilePicture"
                  />
                </div>
                <div
                  onClick={() => document.getElementById("imageInput").click()}
                  className=" ml-[2.4rem] h-[2.7rem] w-[2.7rem] -translate-y-[5.2rem] cursor-pointer rounded-full bg-black p-2.5 opacity-60 hover:bg-gray-900"
                >
                  {updatePictureIcon}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-6 px-4">
              <TextField
                inputRef={fullNameRef}
                onFocus={() => scrollToView(fullNameRef)}
                fullWidth
                id="fullName"
                name="fullName"
                label="Full Name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
                sx={{
                  "& label.Mui-focused": {
                    color: "rgb(29,155,240)",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(29,155,240)",
                    },
                  },
                }}
              />
              <TextField
                inputRef={bioRef}
                onFocus={() => scrollToView(bioRef)}
                fullWidth
                id="bio"
                multiline
                rows={4}
                name="bio"
                label="Bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                error={formik.touched.bio && Boolean(formik.errors.bio)}
                helperText={formik.touched.bio && formik.errors.bio}
                sx={{
                  "& label.Mui-focused": {
                    color: "rgb(29,155,240)",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(29,155,240)",
                    },
                  },
                }}
              />
              <TextField
                inputRef={locationRef}
                onFocus={() => scrollToView(locationRef)}
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                helperText={formik.touched.location && formik.errors.location}
                sx={{
                  "& label.Mui-focused": {
                    color: "rgb(29,155,240)",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(29,155,240)",
                    },
                  },
                }}
              />
              <TextField
                inputRef={websiteRef}
                onFocus={() => scrollToView(websiteRef)}
                fullWidth
                id="website"
                name="website"
                label="Website"
                value={formik.values.website}
                onChange={formik.handleChange}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.touched.website && formik.errors.website}
                sx={{
                  "& label.Mui-focused": {
                    color: "rgb(29,155,240)",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(29,155,240)",
                    },
                  },
                }}
              />
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;
