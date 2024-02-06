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
      label: "Go to Game Page",
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
    "h-screen px-4 pt-8 pb-4 bg-light flex bg-slate-700 justify-between flex-col",
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
      "flex items-center cursor-pointer hover:bg-opacity-100 rounded w-full overflow-hidden hover:text-red-800 whitespace-nowrap",
      {
        ["text-red-500"]: activeMenu?.id === menu.id,
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
        <div className="divide-y divide-slate-400">
          {!toggleCollapse && session && status === "authenticated" && (
            <div className="mt-8 flex items-center gap-4 bg-red-500 p-4 ">
              {session.user.avatar && (
                <img
                  src={`/avatars/${session.user.avatar}.png`}
                  alt={session.user.name}
                  className="mr-2 w-20 rounded-full border-2 border-red-500 bg-white"
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
          <div className="mt-4 flex flex-col items-start text-lg">
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
                        <span
                          className={classNames("text-text-light font text-xl")}
                        >
                          {menu.label}
                        </span>
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="rounded-md bg-white p-8 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">
              Select handled sections:
            </h2>
            <Select
              options={sections.map((section) => ({
                value: section.sectionId,
                label: section.sectionId,
              }))}
              onChange={(selectedOptions) =>
                setSelectedSections(
                  selectedOptions.map((option) => option.value)
                )
              }
              closeMenuOnSelect={false}
              className="mb-4"
              isSearchable
              isMulti
              placeholder="Select sections..."
            />
            <div className="mt-2">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="New Section Name"
                className="mr-2 rounded-md border border-gray-300 p-2"
              />
              <button
                onClick={handleAddNewSection}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              >
                Add New Section
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              {/* Your modal content */}
              <button
                onClick={handleCloseModal}
                className="mr-2 rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
              >
                Cancel
              </button>
              {/* Your modal content */}
              <button
                className="rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
                onClick={handleSaveSectionHandled}
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
