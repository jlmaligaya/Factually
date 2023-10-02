import React, { useState, useEffect } from 'react';
import Image from 'next/image';


const cutsceneSlides = [
  {
    image: '/chapters/1/cutscene/AID000001_intro_1.png',
    text: "You find yourself standing at the entrance of Robbie's lab, a place shrouded in mystery. It's a culmination of your relentless pursuit of truth amidst a world filled with misinformation."
  },
  {
    image: '/chapters/1/cutscene/AID000001_intro_2.png',
    text:  "As you venture deeper into the lab, your eyes catch something extraordinary. Before you, a magnificent automaton stands, its intricate design hinting at a magical origin.",
  },
  {
    image: '/chapters/1/cutscene/AID000001_intro_3.png',
    text: "Approaching cautiously, you realize the automaton isn't humming with life. Instead, it rests in an eerie slumber, like a guardian frozen in time, awaiting a hero to rekindle its purpose.",
  },
  {
    image: '/chapters/1/cutscene/AID000001_intro_4.png',
    text: "Examining the robot closely, you notice something peculiar – it has three empty slots, like a puzzle missing vital pieces.",
  },
  {
    image: '/chapters/1/cutscene/AID000001_intro_5.png',
    text:  "As you continue to explore, you uncover the path to acquiring the initial chip. To claim it, a test of knowledge has been given upon you. Are you up for this challenge?",
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
                    fill
                    className='pointer-events-none select-none'
                    draggable="false"
                  />
                  <div className='flex justify-center'>
                    <div className="absolute bottom-0 bg-black border-white border-4 w-full h-2/6  bg-opacity-50 text-white py-4 cursor-pointer">
                      <div className="flex justify-center space-x-4">
                        <div className={`w-2/3 ${index === currentSlide ? '' : 'hidden'}`}>
                          <p className="font-retropix text-4xl text-left font-semibold p-10 select-none leading-relaxed">
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
