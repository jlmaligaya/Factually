import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ArticleIcon,
  CollapsIcon,
  HomeIcon,
  LogoIcon,
  LogoutIcon,
  UsersIcon,
  GamesIcon,
  LinkIcon,
  ProgressionIcon,
} from "./icons";
import { signOut } from "next-auth/react";
import Select from "react-select";
import axios from "axios";

const Sidebar = () => {
  const router = useRouter(); // Move this line inside the component function
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get("/api/sections");
        setSections(response.data);
        // Set the default selected section ID if available
        if (response.data.length > 0) {
          setSelectedSectionId(response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, []);

  const menuItems = [
    // { id: 1, label: "Home", icon: HomeIcon, link: "/instructor" },
    {
      id: 2,
      label: "Manage Students",
      icon: UsersIcon,
      link: `/instructor/students`,
    },
    {
      id: 3,
      label: "Manage Activities",
      icon: ArticleIcon,
      link: `/instructor/activities`,
    },
    {
      id: 4,
      label: "View Progress",
      icon: ProgressionIcon,
      link: `/instructor/progression`,
    },
    {
      id: 5,
      label: "Preview Game Page",
      icon: GamesIcon,
      link: `/`,
    },
  ];

  // Function to handle adding a new section
  const handleAddNewSection = async () => {
    // Check if newSectionName is not empty
    if (!newSectionName.trim()) {
      alert("Please enter a valid section name.");
      setNewSectionName("");
      return;
    }

    try {
      const response = await axios.post(`/api/sections`, {
        sectionId: newSectionName,
      });
      const newSection = response.data;
      setSections([...sections, newSection]);
      setSelectedSections([...selectedSections, newSection.sectionId]);
      setNewSectionName(""); // Clear the new section name input
    } catch (error) {
      console.error("Error adding new section:", error);
      alert("Failed to add new section. Please try again.");
    }
  };

  // Function to handle saving section handled by the user
  const handleSaveSectionHandled = async () => {
    try {
      // Make a POST request to your backend API to update the user's section_handled field
      await axios.post(`/api/saveHandledSections`, {
        userId: session.user.uid,
        sectionHandled: selectedSections,
      });

      alert("Sections saved successfully.");
      setShowModal(false);
    } catch (error) {
      console.error("Error saving sections:", error);
      alert("Failed to save sections. Please try again.");
    }
  };

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === router.pathname),
    [router.pathname]
  );

  // Function to handle opening modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Function to handle closing modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-light flex bg-gray-800 justify-between flex-col",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-light-lighter absolute right-0",
    {
      "rotate-180": toggleCollapse,
    }
  );

  const getNavItemClasses = (menu) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-opacity-100 rounded w-full overflow-hidden hover:bg-gray-400 whitespace-nowrap",
      {
        ["bg-gray-500 border-l-4"]: activeMenu?.id === menu.id,
      }
    );
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col ">
        <div className="relative flex">
          <div className="flex items-center gap-4 pl-1">
            <LogoIcon />
            <span
              className={classNames("text-md font-boom", {
                hidden: toggleCollapse,
              })}
            >
              Factually
            </span>
          </div>

          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <CollapsIcon />
            </button>
          )}
        </div>
        <div>
          {!toggleCollapse && session && status === "authenticated" && (
            <div className="mt-8 flex flex-col items-center gap-4 p-4 text-center ">
              {session.user.avatar && (
                <img
                  src={`/avatars/${session.user.avatar}.png`}
                  alt={session.user.name}
                  className="mr-2 w-32 rounded-full border-2 border-red-500 bg-white"
                />
              )}
              <div className="flex flex-col">
                {" "}
                <span className="text-xl font-bold">
                  {session.user.firstName}&nbsp;
                  {session.user.lastName}
                </span>
                <span className="text-lg font-thin capitalize">
                  {session.user.role}
                </span>
              </div>
            </div>
          )}
          <div className="text-md mt-4 flex flex-col gap-2">
            {menuItems.map(({ icon: Icon, ...menu }) => {
              const classes = getNavItemClasses(menu);
              return (
                <Link href={menu.link} key={menu.id}>
                  <div className={classes}>
                    <a className="flex h-full w-full items-center py-4 px-3">
                      <div style={{ width: "2.5rem" }}>
                        <Icon />
                      </div>
                      {!toggleCollapse && (
                        <span className={classNames("")}>{menu.label}</span>
                      )}
                    </a>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <div
          className={`${getNavItemClasses({})} px-3 py-4`}
          onClick={() =>
            signOut({ callbackUrl: "http://localhost:3000/auth/signIn" })
          }
        >
          <div style={{ width: "2.5rem" }}>
            <LogoutIcon />
          </div>
          {!toggleCollapse && (
            <span className={classNames("text-md text-text-light font-medium")}>
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
