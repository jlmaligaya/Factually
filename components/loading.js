import React from "react";
import Image from 'next/image';

const LoadingScreen = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center p-10 text-3xl bg-slate-900 font-retropix">
      <Image
        src="/assets/r_loading.png"
        height={300}
        className="robot-image"
        width={300}
        alt="Loading"
        loading="eager"
        priority
      />
      <p className="py-5 text-center">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
