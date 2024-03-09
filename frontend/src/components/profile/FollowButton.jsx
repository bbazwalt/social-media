import { useState } from "react";

const FollowButton = ({ findUser, handleFollowUser }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleFollowUser}
      className={`${
        !findUser?.followed
          ? "bg-black text-white"
          : "border border-gray-300 bg-white text-black hover:border-red-600 hover:bg-white hover:text-red-600"
      } -mt-1.5 mr-4 h-9 rounded-full px-4 pb-0.5 pt-0 font-bold hover:bg-neutral-600`}
    >
      {findUser?.followed ? (isHovering ? "Unfollow" : "Following") : "Follow"}
    </button>
  );
};

export default FollowButton;
