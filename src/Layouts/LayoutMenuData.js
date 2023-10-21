import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Navdata = () => {
  const history = useHistory();
  //state data
  const [isPosts, setIsPost] = useState(false);
  const [isMenus, setIsMenu] = useState(false);
  const [isSlides, setIsSlide] = useState(false);
  const [isAuthentications, setAuthentications] = useState(false);
  const [isBanks, setIsBank] = useState(false);
  const [isAccountBanks, setIsAccountBank] = useState(false);
  const [isThumbnail, setIsThumbnail] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Posts") {
      setIsPost(false);
    }
    if (iscurrentState !== "Menus") {
      setIsMenu(false);
    }
    if (iscurrentState !== "Slides") {
      setIsSlide(false);
    }
    if (iscurrentState !== "Banks") {
      setIsBank(false);
    }
    if (iscurrentState !== "AccountBanks") {
      setIsAccountBank(false);
    }
    if (iscurrentState !== "Thumbnail") {
      setIsThumbnail(false);
    }
  }, [history, iscurrentState, isPosts, isMenus, isSlides, isBanks, isAccountBanks, isThumbnail]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "authentications",
      label: "Authentications",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isAuthentications,
      click: function (e) {
        e.preventDefault();
        setAuthentications(!isAuthentications);
        setIscurrentState("Authentications");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "users",
          label: "Users",
          link: "/users",
          parentId: "user",
        },
        {
          id: "roles",
          label: "Roles",
          link: "/roles",
          parentId: "role",
        },
        {
          id: "actions",
          label: "Actions",
          link: "/actions",
          parentId: "action",
        },

        {
          id: "roleActions",
          label: "RoleActions",
          link: "/roleActions",
          parentId: "roleAction",
        },
      ],
    },
    {
      id: "menus",
      label: "Menus",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isMenus,
      click: function (e) {
        e.preventDefault();
        setIsMenu(!isMenus);
        setIscurrentState("Menus");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "menus",
          label: "Menus",
          link: "/menus",
        },
      ],
    },
    {
      id: "slides",
      label: "Slides",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isSlides,
      click: function (e) {
        e.preventDefault();
        setIsSlide(!isSlides);
        setIscurrentState("Slides");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "bannerSlides",
          label: "Banner slides",
          link: "/Banner-slides",
        },
        {
          id: "slides",
          label: "Slides",
          link: "/Slides",
        },
      ],
    },
    {
      id: "posts",
      label: "Posts",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isPosts,
      click: function (e) {
        e.preventDefault();
        setIsPost(!isPosts);
        setIscurrentState("Posts");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "posts",
          label: "Posts",
          link: "/posts",
        }
      ],
    },
    {
      id: "banks",
      label: "Banks",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isBanks,
      click: function (e) {
        e.preventDefault();
        setIsBank(!isBanks);
        setIscurrentState("Banks");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "banks",
          label: "Banks",
          link: "/banks",
        }
      ],
    },
    {
      id: "accountBanks",
      label: "AccountBanks",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isAccountBanks,
      click: function (e) {
        e.preventDefault();
        setIsAccountBank(!isAccountBanks);
        setIscurrentState("AccountBanks");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "accountBanks",
          label: "AccountBanks",
          link: "/accountBanks",
        }
      ],
    },
    {
      id: "Thumbnail",
      label: "Thumbnail",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isThumbnail,
      click: function (e) {
        e.preventDefault();
        setIsThumbnail(!isThumbnail);
        setIscurrentState("Thumbnail");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "Thumbnail",
          label: "Thumbnail",
          link: "/Thumbnail",
        }
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
