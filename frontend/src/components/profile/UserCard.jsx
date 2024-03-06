import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { blankProfilePicture } from "../../data/image/imagesData";

const UserCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      key={item.id}
      className="flex cursor-pointer items-center border-t px-4 py-3  hover:rounded-full hover:bg-zinc-200"
      onClick={() => navigate("/profile/" + item?.id)}
    >
      <div>
        <Avatar
          sx={{ width: "3rem", height: "3rem" }}
          src={item?.profilePicture || blankProfilePicture}
        />
      </div>
      <div className="ml-2">
        <div className="font-bold">{item?.fullName}</div>
        <div className="text-gray-600 ">@{item?.username}</div>
      </div>
      <hr />
    </div>
  );
};

export default UserCard;
