import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  parseISO,
} from "date-fns";

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const currentDate = new Date();

const minAge = 18;

export const maxDate = new Date(
  currentDate.getFullYear() - minAge,
  currentDate.getMonth(),
  currentDate.getDate(),
);

export const formatDateToNowShort = (isoDate) => {
  const now = new Date();
  const date = parseISO(isoDate);
  const diffSeconds = differenceInSeconds(now, date);
  if (diffSeconds < 60) {
    return `${diffSeconds}s`;
  }
  const diffMinutes = differenceInMinutes(now, date);
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  const diffHours = differenceInHours(now, date);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  const diffDays = differenceInDays(now, date);
  if (diffDays < 7) {
    return `${diffDays}d`;
  }
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) {
    return `${diffWeeks}w`;
  }
  const diffMonths = differenceInMonths(now, date);
  if (diffMonths < 12) {
    return `${diffMonths}mo`;
  }
  const diffYears = differenceInYears(now, date);
  return `${diffYears}y`;
};

export const formatCount = (num) => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (num < 1000000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
};

export const truncateUserText = (link) => {
  if (link.length > 5) {
    return `${link.substring(0, 5)}...`;
  }
  return link;
};

export const truncateLinkText = (link) => {
  if (link.length > 12) {
    return `${link.substring(0, 12)}...`;
  }
  return link;
};

export const ensureAbsoluteUrl = (url) => {
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`;
  }
  return url;
};

export const formatDateOfBirth = (date) => {
  const options = { month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export const formatCreatedAt = (date) => {
  const options = { year: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
};

export const updateRepliedPosts = (repliedPosts, payload) => {
  return repliedPosts.map((post) =>
    post.id === payload.id
      ? { ...post, totalReplies: payload.totalReplies }
      : post,
  );
};

export const updateLikedPosts = (likedPosts, payload) => {
  return likedPosts.map((post) =>
    post.id === payload.id
      ? {
          ...post,
          totalLikes: payload.totalLikes,
          liked: payload.liked,
        }
      : post,
  );
};

export const updateRepostedPosts = (repostedPosts, payload) => {
  return repostedPosts.map((post) =>
    post.id === payload.id
      ? {
          ...post,
          totalReposts: payload.totalReposts,
          reposted: payload.reposted,
        }
      : post,
  );
};

export const updateDeletedPosts = (deletedPosts, payload) => {
  return deletedPosts.filter((post) => post.id !== payload);
};
