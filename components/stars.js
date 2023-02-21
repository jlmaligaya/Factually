const stars = ({ rating }) => {
    return (
        <div className="flex items-center mt-2">
        {[...Array(rating)].map((_, index) => (
          <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 15.293l-4.853 2.51a1 1 0 01-1.447-1.054l.92-5.362L.345 8.945a1 1 0 01.554-1.705l5.356-.778L8.34 2.39a1 1 0 011.82 0l2.085 4.172 5.356.778a1 1 0 01.554 1.705l-3.725 3.612.92 5.362a1 1 0 01-1.447 1.054L10 15.293z" clipRule="evenodd" />
          </svg>
        ))}
        {[...Array(3 - rating)].map((_, index) => (
          <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 fill-current" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 15.293l-4.853 2.51a1 1 0 01-1.447-1.054l.92-5.362L.345 8.945a1 1 0 01.554-1.705l5.356-.778L8.34 2.39a1 1 0 011.82 0l2.085 4.172 5.356.778a1 1 0 01.554 1.705l-3.725 3.612.92 5.362a1 1 0 01-1.447 1.054L10 15.293z" clipRule="evenodd" />
          </svg>
        ))}
      </div>
    )
  }

export default stars;