import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const Cutscene = ({ activityID, isIntro, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCutsceneVisible, setIsCutsceneVisible] = useState(true);
  const [isTextFullyTyped, setIsTextFullyTyped] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [initialVolume, setInitialVolume] = useState(0.5);
  const [cutsceneSlides, setCutsceneSlides] = useState([]);
  const backgroundMusicRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isSkipVisible, setIsSkipVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const handleSkip = () => {
    // Skip to the last slide
    setIsCutsceneVisible(false);
    onClose();
  };

  useEffect(() => {
    // Check if skip button should be visible
    setIsSkipVisible(!isTextFullyTyped && isSkipVisible);
  }, [isTextFullyTyped]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  console.log("Is intro:", isIntro);
  // Make a GET request to your API route
  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/cutscene?isIntro=${isIntro}&activityID=${activityID}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle the response data as needed
        if (data.length === 0) {
          setIsCutsceneVisible(false);
          onClose();
        } else {
          setCutsceneSlides(data);
        }
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Call fetchData to make the GET request
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Set the volume value in localStorage when it changes

    const savedBgmVolume = parseFloat(localStorage.getItem("bgmVolume"));
    if (!isNaN(savedBgmVolume)) {
      setInitialVolume(savedBgmVolume);
    }
  }, [initialVolume]);

  useEffect(() => {
    // Load and play background music when the component mounts
    backgroundMusicRef.current = new Audio(
      `/sounds/${activityID}_intro_bgm.ogg`
    );
    backgroundMusicRef.current.volume = isMuted ? 0 : initialVolume; // Adjust volume based on mute state
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.play();

    // Cleanup when the component unmounts
    return () => {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    };
  }, [initialVolume, isMuted]);

  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
  };

  useEffect(() => {
    // Automatically close the cutscene when it's not visible anymore
    if (!isCutsceneVisible) {
      backgroundMusicRef.current.pause();
      return;
    }

    // Automatically close the cutscene when the last slide is reached
    if (currentSlide === cutsceneSlides.length - 1) {
      return; // Do not auto-close, wait for user interaction
    }
  }, [currentSlide, isCutsceneVisible]);

  useEffect(() => {
    if (!isTextFullyTyped) {
      // Simulate typing effect
      const typingTimeout = setTimeout(() => {
        const newText = cutsceneSlides[currentSlide]?.caption.slice(
          0,
          textIndex + 1
        );
        setDisplayedText(newText);
        setTextIndex(textIndex + 1);

        // Check if text is fully typed
        if (textIndex === cutsceneSlides[currentSlide]?.caption.length - 1) {
          setIsTextFullyTyped(true);
        }
      }, 50); // Adjust typing speed as needed

      return () => clearTimeout(typingTimeout);
    }
  }, [currentSlide, textIndex, isTextFullyTyped]);

  const backSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setIsTextFullyTyped(false);
      setDisplayedText("");
      setTextIndex(0);
    }
  };

  const nextSlide = () => {
    if (isTextFullyTyped) {
      if (currentSlide < cutsceneSlides.length - 1) {
        setCurrentSlide(currentSlide + 1);
        setIsTextFullyTyped(false);
        setDisplayedText("");
        setTextIndex(0);
      } else {
        // Close the cutscene when user clicks on the last slide
        setIsCutsceneVisible(false);
        onClose();
      }
    }
  };

  const onTextBoxClick = () => {
    // When the text box is clicked, skip to the last bar
    if (!isTextFullyTyped) {
      setDisplayedText(cutsceneSlides[currentSlide].caption);
      setIsTextFullyTyped(true);
      setTextIndex(cutsceneSlides[currentSlide].caption.length - 1);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 z-50 h-screen w-screen bg-black transition-opacity ${
        isCutsceneVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="absolute top-4 right-4"></div>
        <div className=" relative h-full w-full overflow-hidden rounded-lg shadow-lg">
          <div className="h-full w-full overflow-hidden">
            <div className="flex translate-x-0 transform transition-transform duration-300 ease-in-out">
              {cutsceneSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`h-screen w-full object-cover ${
                    index === currentSlide ? "" : "hidden"
                  }`}
                  onClick={onTextBoxClick}
                >
                  <Image
                    src={slide.url}
                    alt={`Slide ${index + 1}`}
                    fill
                    className={`pointer-events-none select-none px-20 ${
                      isImageLoaded ? "" : "opacity-0"
                    }`}
                    draggable="false"
                    onLoad={handleImageLoad}
                  />
                  <div className="flex justify-center">
                    <div className="absolute bottom-0 h-2/6 w-full cursor-pointer border-4 border-white  bg-black bg-opacity-50 py-4 text-white">
                      <div className="flex justify-center space-x-4">
                        <div
                          className={`w-2/3 ${
                            index === currentSlide ? "" : "hidden"
                          }`}
                        >
                          <p className="select-none overflow-auto p-10 text-left font-retropix text-xl font-semibold leading-relaxed 2xl:text-3xl">
                            {displayedText}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 p-4">
                          {" "}
                          <button
                            onClick={handleSkip}
                            className="font-boom text-lg text-white"
                          >
                            Skip
                          </button>
                        </div>
                        <div className="z-60 absolute top-4 left-4 p-4">
                          <button onClick={toggleMute} className="text-white">
                            {isMuted ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="h-10 w-10"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="h-10 w-10"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                        {isTextFullyTyped && index === currentSlide && (
                          <div className="absolute bottom-4 flex w-full justify-between">
                            <div
                              className="w-30 ml-6 flex h-10 animate-bounce cursor-pointer items-center justify-center text-white"
                              onClick={backSlide}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-10 w-10 rotate-180 transform"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                                />
                              </svg>
                              <p className="font-boom text-xl">Back</p>
                            </div>

                            <div
                              className="w-30 mr-10 flex h-10 animate-bounce cursor-pointer items-center justify-center text-white"
                              onClick={nextSlide}
                            >
                              <p className="font-boom text-xl">Next</p>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="h-10 w-10"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cutscene;
