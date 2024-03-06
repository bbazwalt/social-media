import { Grid } from "@mui/material";
import MiddleSection from "../components/middleSection/MiddleSection";
import Navigation from "../components/navigation/Navigation";
import PostDetails from "../components/post/PostDetails";
import Connections from "../components/profile/Connections";
import Profile from "../components/profile/Profile";
import RightSection from "../components/rightSection/RightSection";

const Home = ({
  isProfile,
  isPost,
  isMiddleSection,
  isConnections,
  isFollowing,
}) => {
  return (
    <div className="mx-auto max-w-[76rem]">
      <Grid container xs={12} className="justify-between">
        <Grid item lg={2.49} className="relative w-full">
          <Navigation />
        </Grid>
        <Grid item lg={5.9} className="relative w-full border">
          {isMiddleSection && <MiddleSection />}
          {isProfile && <Profile />}
          {isPost && <PostDetails />}
          {isConnections && <Connections isFollowing={isFollowing} />}
        </Grid>
        <Grid item lg={3.61} className="relative w-full">
          <RightSection />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
