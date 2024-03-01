import React from "react";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen flex-row justify-start bg-gray-100">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
