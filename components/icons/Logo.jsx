import * as React from "react";

function Logo({ fill = "#3B81F6", ...rest }) {
  return <img className="w-10 rounded-xl" src="/logo.png" alt="" />;
}

export default Logo;
