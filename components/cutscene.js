import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const cutsceneSlides = [
  {
    image: '/chapters/1/cutscene/c1_slide_1.png',
    text: "In Robbie's lab, the soft hum of machinery fills the air. The room is bathed in a gentle, calming light as Robbie, the dedicated robot, rests in standby mode.",
  },
  {
    image: '/chapters/1/cutscene/c1_slide_2.png',
    text: "However, as you step closer, you notice something unusual. Robbie remains dormant, deactivated, and immobile. His expressive digital eyes are dim, lacking their usual vitality.",
  },
  {
    image: '/chapters/1/cutscene/c1_slide_3.png',
    text: "Upon closer inspection, it becomes evident that Robbie is missing something crucial – three vital microchips that once powered his functions.",
  },
  {
    image: '/chapters/1/cutscene/c1_slide_4.png',
    text: "The lab erupts into urgency, with blaring alarms and flashing lights. The situation has taken a serious turn.",
  },
];

const Cutscene = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCutsceneVisible, setIsCutsceneVisible] = useState(true);
  const [isTextFullyTyped, setIsTextFullyTyped] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Automatically close the cutscene when it's not visible anymore
    if (!isCutsceneVisible) {
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
        const newText = cutsceneSlides[currentSlide].text.slice(0, textIndex + 1);
        setDisplayedText(newText);
        setTextIndex(textIndex + 1);

        // Check if text is fully typed
        if (textIndex === cutsceneSlides[currentSlide].text.length - 1) {
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
        setDisplayedText('');
        setTextIndex(0);
      } else {
        // Close the cutscene when user clicks on the last slide
        setIsCutsceneVisible(false);
      }
    }
  };

  const onTextBoxClick = () => {
    // When the text box is clicked, skip to the last bar
    if (!isTextFullyTyped) {
      setDisplayedText(cutsceneSlides[currentSlide].text);
      setIsTextFullyTyped(true);
      setTextIndex(cutsceneSlides[currentSlide].text.length - 1);
    } else {
      nextSlide();
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black z-50 transition-opacity ${
        isCutsceneVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className=" bg-white shadow-lg rounded-lg overflow-hidden w-full h-full relative">
          <div className="w-full h-full overflow-hidden">
            <div className="flex transition-transform ease-in-out duration-300 transform translate-x-0">
              {cutsceneSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`w-full h-screen object-cover ${
                    index === currentSlide ? '' : 'hidden'
                  }`}
                  onClick={onTextBoxClick} // Add click event handler to the text box
                >
                  <Image
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    layout="fill"
                    draggable="false"
                  />
                  <div className='flex justify-center'>
                    <div className="absolute bottom-0 bg-black border-white border-4 w-full h-2/6  bg-opacity-50 text-white py-4 cursor-pointer">
                      <div className="flex justify-center space-x-4">
                        <div className={`w-2/3 ${index === currentSlide ? '' : 'hidden'}`}>
                          <p className="font-retropix text-4xl text-left font-semibold p-10">
                            {displayedText}
                          </p>
                        </div>
                        {isTextFullyTyped && index === currentSlide && (
                          <div className="absolute bottom-4 right-4">
                            <div
                              className="text-white animate-ping w-8 h-8 flex items-center justify-center cursor-pointer"
                              onClick={nextSlide}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
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
