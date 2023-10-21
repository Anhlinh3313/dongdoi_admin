import React from "react";
import { Redirect } from "react-router-dom";

//pages
import DashboardAnalytics from "../pages/DashboardAnalytics";
import Posts from "../pages/Posts";
import HandlePost from "../pages/Posts/HandlePost";
import Menus from "../pages/Menus";
import Slides from "../pages/Slides";
import BannerSlides from "../pages/Banner-slides";
import Banks from "../pages/Banks";
import AccountBanks from "../pages/AccountBanks";
import Thumbnail from "../pages/Thumbnail";

//login
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Users from "../pages/Authentication/Users";
import Roles from "../pages/Authentication/Role";
import Actions from "../pages/Authentication/Action";
import RoleActions from "../pages/Authentication/RoleAction";

const authProtectedRoutes = [
  { path: "/dashboard-analytics", component: DashboardAnalytics },
  { path: "/users", component: Users },
  { path: "/roles", component: Roles },
  { path: "/actions", component: Actions },
  { path: "/roleActions", component: RoleActions },
  { path: "/posts", component: Posts },
  { path: "/menus", component: Menus },
  { path: "/slides", component: Slides },
  { path: "/Banner-slides", component: BannerSlides },
  { path: "/post/:id", component: HandlePost },
  { path: "/post", component: HandlePost },
  { path: "/banks", component: Banks },
  { path: "/accountBanks", component: AccountBanks },
  { path: "/Thumbnail", component: Thumbnail },

  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard" />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
];

export { authProtectedRoutes, publicRoutes };
