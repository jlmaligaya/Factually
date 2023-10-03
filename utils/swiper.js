const swiper = {
    swipeLeft: () => {
      // Add logic for swiping left (reject)
      console.log("Swiped left (reject)");
    },
    swipeRight: () => {
      // Add logic for swiping right (accept)
      console.log("Swiped right (accept)");
    },
    initializeSwiper: (swipeFunction) => {
      if (typeof window !== "undefined") {
        window.addEventListener("keydown", (e) => {
          if (e.key === "ArrowLeft" && swipeFunction.left) {
            swipeFunction.left();
          } else if (e.key === "ArrowRight" && swipeFunction.right) {
            swipeFunction.right();
          }
        });
      }
    },
  };
  
  export default swiper;
  