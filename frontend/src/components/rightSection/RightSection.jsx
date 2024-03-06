import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchIcon } from "../../data/icon/iconsData";
import { blankProfilePicture } from "../../data/image/imagesData";
import { searchUsers } from "../../store/user/action";
import { CLEAR_USER_ERROR } from "../../store/user/actionType";
import EmptyItemsText from "../infoText/EmptyItemsText";
import ErrorSnackBar from "../snackBar/ErrorSnackBar";

const RightSection = () => {
  const [query, setQuery] = useState("");

  const user = useSelector((store) => store.user.searchUsers);
  const isLoading = useSelector((store) => store.user.isLoading);
  const error = useSelector((store) => store.user.error);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (keyword) => {
    if (keyword.trim()) dispatch(searchUsers(keyword));
  };

  return (
    <div className="top sticky -mr-4 -mt-3.5 ml-2.5 py-5 text-center">
      <div className="relative ml-5 mt-1 flex items-center rounded-full  bg-[rgb(239,243,244)]">
        <span className="ml-5"> {searchIcon}</span>
        <input
          type="text"
          className=" w-full rounded-full  border-none bg-[rgb(239,243,244)]  py-[0.5rem] pb-2.5 pl-4 text-gray-900"
          placeholder="Search"
          onChange={(e) => {
            const trimmedValue = e.target.value.trimStart();
            setQuery(trimmedValue);
            handleSearch(trimmedValue);
          }}
          value={query}
        />
      </div>
      {query && (
        <div className="ml-6 h-auto max-h-[39rem] overflow-y-scroll bg-white px-3 shadow-md">
          {user?.length === 0 && !isLoading ? (
            <EmptyItemsText content="users" />
          ) : (
            user?.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center p-2 pl-0 hover:rounded-full hover:bg-zinc-200"
                onClick={() => navigate("/profile/" + item?.id)}
              >
                <div>
                  <img
                    src={item?.profilePicture || blankProfilePicture}
                    alt={item?.fullName}
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <div className="ml-2">
                  <div className="font-bold">{item?.fullName}</div>
                  <div className="text-gray-600 ">@{item?.username}</div>
                </div>
                <hr />
              </div>
            ))
          )}
        </div>
      )}
      {error && <ErrorSnackBar error={error} dispatchType={CLEAR_USER_ERROR} />}
    </div>
  );
};

export default RightSection;
