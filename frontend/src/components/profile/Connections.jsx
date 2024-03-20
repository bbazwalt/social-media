import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { profileBackIcon } from "../../data/icon/iconsData";
import { findUserById } from "../../redux/user/action";
import EmptyItemsText from "../infoText/EmptyItemsText";
import LoadingText from "../infoText/LoadingText";
import UserCard from "./UserCard";

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

const Connections = ({ isFollowing }) => {
  const [tabValue, setTabValue] = useState(isFollowing ? 1 : 0);

  const isLoading = useSelector((store) => store.user.isLoading);
  const findUser = useSelector((store) => store.user.findUser);

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(findUserById(params.id, navigate));
  }, [params.id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      navigate(`/profile/${params.id}/followers`);
    } else if (newValue === 1) {
      navigate(`/profile/${params.id}/following`);
    }
  };

  return isLoading && !findUser ? (
    <LoadingText />
  ) : (
    <div className=" w-[100%] ">
      <section className="sticky top-0 z-50 flex items-center justify-between bg-[rgba(255,255,255,0.85)] backdrop-blur-[12px]">
        <div className="flex items-center">
          <span
            className="-mt-1 ml-2 h-9 w-9 cursor-pointer p-2 pl-2 hover:rounded-full hover:bg-zinc-200"
            onClick={() => navigate(`/profile/${params.id}`)}
          >
            {profileBackIcon}
          </span>
          <div className="-mt-3 ml-7 pb-1 pt-4">
            <div className="flex flex-row items-center justify-center">
              <h1 className=" text-xl font-bold opacity-90">
                {findUser?.fullName}
              </h1>
            </div>
            <p className=" text-base font-normal text-gray-600 opacity-90 ">
              @{findUser?.username}
            </p>
          </div>
        </div>
      </section>
      <div className=" my-2 border-t">
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
          <Tab sx={tabStyle} label="Followers" />
          <Tab sx={tabStyle} label="Following" />
        </Tabs>
        {tabValue === 0 ? (
          findUser?.followers?.length === 0 && !isLoading ? (
            <EmptyItemsText content="users" />
          ) : (
            findUser?.followers?.map((item) => (
              <UserCard key={item.id} item={item} />
            ))
          )
        ) : null}
        {tabValue === 1 ? (
          findUser?.following?.length === 0 && !isLoading ? (
            <EmptyItemsText content="users" />
          ) : (
            findUser?.following?.map((item) => (
              <UserCard key={item.id} item={item} />
            ))
          )
        ) : null}
      </div>
    </div>
  );
};

export default Connections;
