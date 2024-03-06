import React from "react";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen flex-row justify-center bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
};

export default Layout;
