import {
  homeIcon,
  profileIcon,
  selectedHomeIcon,
  selectedProfileIcon,
} from "../icon/iconsData";

export const navigationData = [
  {
    title: "Home",
    icon: homeIcon,
    activeIcon: selectedHomeIcon,
    path: "/",
  },
  {
    title: "Profile",
    icon: profileIcon,
    activeIcon: selectedProfileIcon,
    path: "/profile",
  },
];
