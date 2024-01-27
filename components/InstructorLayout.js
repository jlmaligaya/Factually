import React from "react";
import Sidebar from "./sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen flex-row justify-start">
      <Sidebar />
      <div className="flex-1 bg-primary ">{children}</div>
    </div>
  );
};

export default Layout;
