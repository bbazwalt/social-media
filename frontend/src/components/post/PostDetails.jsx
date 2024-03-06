import { Divider } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { profileBackIcon } from "../../data/icon/iconsData";
import {
  findAllReplyPostsByParentPostId,
  findPostById,
} from "../../store/post/action";
import { scrollToTop } from "../../utils/otherUtils";
import LoadingText from "../infoText/LoadingText";
import PostCard from "./PostCard";

const PostDetails = () => {
  const post = useSelector((store) => store.post.post);
  const replyPosts = useSelector((store) => store.post.replyPosts);
  const isLoading = useSelector((store) => store.post.isLoading);

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    dispatch(findPostById(params.id));
    dispatch(findAllReplyPostsByParentPostId(params.id));
  }, [params.id, dispatch]);

  return (
    <div className="w-[100%] border ">
      {isLoading && !post ? (
        <LoadingText />
      ) : (
        <div>
          <section
            className={`sticky top-0 z-50 flex items-center justify-between bg-[rgba(255,255,255,0.85)] pb-2  pt-1 backdrop-blur-[12px]`}
          >
            <div className="flex items-center">
              <span
                className="ml-1.5 mt-1 h-9 w-9 cursor-pointer p-2 pl-2 hover:rounded-full hover:bg-zinc-200"
                onClick={() => navigate(-1)}
              >
                {profileBackIcon}
              </span>
              <div className="ml-7 pb-1  pt-1.5">
                <h1 className=" text-xl font-bold opacity-90">Post</h1>
              </div>
            </div>
          </section>
          <section className=" mt-2">
            {post && <PostCard item={post} isDetails={true} />}
            <Divider sx={{ margin: "1rem 0rem " }} />
          </section>
          <section>
            <div>
              {replyPosts?.map((item) => (
                <PostCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
