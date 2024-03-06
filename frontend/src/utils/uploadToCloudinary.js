const UPLOAD_PRESET = "azwalt-social-media";
const CLOUD_NAME = "dx1plneez";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (pics) => {
  if (pics) {
    try {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", UPLOAD_PRESET);
      data.append("cloud_name", CLOUD_NAME);
      const res = await fetch(UPLOAD_URL, {
        method: "post",
        body: data,
      });
      const fileData = await res.json();
      return fileData.url.toString();
    } catch (error) {
      console.error("An error occured while uploading the image.");
    }
  }
};
