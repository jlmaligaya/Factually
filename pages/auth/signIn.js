import { signIn } from "next-auth/react";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/router";

const SignIn = (props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ identifier: "", password: "" });
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous error messages
    console.log("Submitting form...");
  
    const res = await signIn("credentials", {
      identifier: userInfo.identifier,
      password: userInfo.password,
      redirect: false,
    });
  
    if (res.status === 401) {
      // Handle invalid credentials
      setError("Invalid credentials. Please try again.");
      console.log("Invalid credentials");
    } else if (res.status === 404) {
      // Handle account not found
      setError("Account not found.");
      console.log("Account not found");
    } else {
      router.push("/");
    }
  
    setIsLoading(false);
    if (res.status === 401 || res.status === 404) {
      setShowModal(true); // Show the modal only when there's an error
    }
    console.log("ShowModal set to true");
  };
    return ( 
      <>
{showModal && (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded-lg">
      <div className="flex items-center mb-4">
        <svg
          className="h-6 w-6 text-red-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <p className="font-bold text-3xl text-white mt-3">{error || "Account does not exist."}</p>
      </div>
      <button
        className="bg-red-500 text-white py-2 px-4 rounded-full w-full"
        onClick={() => setShowModal(false)}
      >
        OK
      </button>
    </div>
  </div>
)}


      
<section className="bg-[url('/background.jpg')] bg-cover min-h-screen flex items-center justify-center">
        <div className="flex rounded-xl shadow-lg font-retropix justify-center">
          <div className="md:w-2/4 mt-16  bg-[#CE4044] rounded-tl-2xl rounded-bl-2xl py-10 px-12">
            <center>
              {<img className="rounded-xl w-20 pointer-events-none" src="/dani.png" alt="" />}
              <h2 className="font-bold text-3xl text-white mt-3">SIGN IN</h2>
              <p className="mt-3 text-white text-xl"> Connect and continue your progress. </p>

              <form
                method="post"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 align-center w-72"
              >
                <input
                  value={userInfo.identifier}
                  onChange={({ target }) =>
                    setUserInfo({ ...userInfo, identifier: target.value })
                  }
                  className="mt-8 rounded-full border focus:outline-none focus:border-[#1C3253] focus:ring-1 focus:ring-[#1C3253] invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 text-black"
                  type="text" // Use text input for email or username
                  name="identifier"
                  placeholder="Email or Username" // Update the placeholder
                />

                <input
                  value={userInfo.password}
                  onChange={({ target }) =>
                    setUserInfo({ ...userInfo, password: target.value })
                  }
                  className="rounded-full border w-full focus:outline-none focus:border-[#1C3253] focus:ring-1 focus:ring-[#1C3253] text-black"
                  type="password"
                  name="password"
                  placeholder="Password"
                />

                {/* Conditionally render the button content */}
                <button
  type="submit"
  disabled={isLoading} // Disable the button when loading
  className={`border-2 border-white text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-[#CE4044] m-4 text-lg w-48 place-self-center ${
    isLoading ? "opacity-50 cursor-not-allowed" : "" // Apply styling for loading state
  } button-wrapper`} // Add the button-wrapper class
>
  {isLoading ? (
    <img
      src="/assets/loading_icon.svg"
      alt="Loading"
      className="loading-image" // Add the loading-image class
    />
  ) : (
    "SIGN IN"
  )}
</button>

              </form>
            </center>
          </div>
          
          {/* right side */}
              <div className="md:block hidden w-2/4 mt-16 bg-white rounded-tr-2xl rounded-br-2xl py-10 px-12">
                <center>
                  <h2 className="text-3xl font-bold text-[#CE4044]"> WELCOME BACK TO FACTUALLY. </h2>
                    <div className="border-2 w-20 border-[#CE4044] inline-block"> </div>
                    <p className="text-[#CE4044] text-xl mt-2">  Never been here before? We&apos;d love for you to join us below! </p>
                      <img className="w-[300px] hover:animate-bounce" src="/robbie/r_welcome.png" alt="" />
                      <button className="border-2 text-[#CE4044] border-[#CE4044] rounded-full w-72 px-12 py-2 inline-block font-semibold hover:bg-[#CE4044] hover:text-white text-lg" 
                      onClick={() => router.push('/register')}>SIGN UP</button>
                      <img src="/robbie hi.png" alt="" />  
                </center>     
              </div>
            </div>
      </section>     
  </>     
  )
};

export default SignIn;