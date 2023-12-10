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
    backgroundMusicRef.current.volume = initialVolume; // Set the initial volume as needed
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.play();

    // Cleanup when the component unmounts
    return () => {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    };
  }, [initialVolume]);

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
    } else {
      nextSlide();
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
        <div className=" relative h-full w-full overflow-hidden rounded-lg shadow-lg">
          <div className="h-full w-full overflow-hidden">
            <div className="flex translate-x-0 transform transition-transform duration-300 ease-in-out">
              {cutsceneSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`h-screen w-full object-cover ${
                    index === currentSlide ? "" : "hidden"
                  }`}
                  onClick={onTextBoxClick} // Add click event handler to the text box
                >
                  <Image
                    src={slide.url}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="pointer-events-none select-none px-20"
                    draggable="false"
                  />
                  <div className="flex justify-center">
                    <div className="absolute bottom-0 h-2/6 w-full cursor-pointer border-4 border-white  bg-black bg-opacity-50 py-4 text-white">
                      <div className="flex justify-center space-x-4">
                        <div
                          className={`w-2/3 ${
                            index === currentSlide ? "" : "hidden"
                          }`}
                        >
                          <p className="select-none overflow-auto p-10 text-left font-retropix text-sm font-semibold leading-relaxed lg:text-3xl">
                            {displayedText}
                          </p>
                        </div>
                        {isTextFullyTyped && index === currentSlide && (
                          <div className="absolute bottom-4 right-4">
                            <div
                              className="flex h-8 w-8 animate-ping cursor-pointer items-center justify-center text-white"
                              onClick={nextSlide}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="h-6 w-6"
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
