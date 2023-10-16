import React from "react";
import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div className="absolute flex h-screen w-full flex-col items-center justify-center bg-slate-900 p-10 font-retropix text-3xl">
      <Image
        src="/assets/r_loading.png"
        height={300}
        className="robot-image pointer-events-none select-none"
        width={300}
        alt="Loading"
        loading="eager"
        draggable="false"
        priority
      />
      <p className="py-5 text-center">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
