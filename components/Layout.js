import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  const [showNav, setShowNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  function handleResize() {
    if (window.innerWidth <= 640) {
      setShowNav(false);
      setIsMobile(true);
    } else {
      setShowNav(false);
      setIsMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // This effect should only run once, regardless of the condition

  // If the route matches, return null to render nothing
  if (router.pathname === "/auth/signIn") {
    return null;
  }

  return (
    <>
      <TopBar showNav={showNav} setShowNav={setShowNav} />

      <main
        className={`min-h-screen pt-16 transition-all duration-[400ms] ${
          showNav && !isMobile ? "pl-56" : ""
        }`}
      >
        <div className="px-4 md:px-16">{children}</div>
      </main>
    </>
  );
}
