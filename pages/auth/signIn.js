import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

const SignIn = (props) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ identifier: "", password: "" });
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.user.role === "instructor") {
        router.push(`/instructor/students`);
      } else {
        router.push(`/`);
      }
      console.log("Role: ", session.user.role);
    }
  }, [session, router]);

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
      setIsLoading(false);
    } else if (res.status === 404) {
      // Handle account not found
      setError("Account not found.");
      console.log("Account not found");
      setIsLoading(false);
    } else {
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <section className="flex min-h-screen flex-col items-center justify-center bg-[url('/bg_login.png')] bg-cover">
        <div className=" flex w-full flex-col items-center">
          {" "}
          {<img className="w-60 rounded-xl" src="/logo.png" alt="" />}
          <h2 className=" text-with-stroke mt-3 animate-text bg-gradient-to-r from-rose-500 via-slate-100 to-blue-500 bg-clip-text text-center font-boom text-6xl text-transparent">
            FACTUALLY
          </h2>
          <h2 className="text-with-stroke mt-5 text-center font-ogoby text-4xl text-white">
            Misinformed? Be fact-ed!
          </h2>
        </div>
        <div className="flex justify-center rounded-xl font-retropix">
          <div className="py-25 flex w-full items-center justify-center  rounded-2xl rounded-bl-2xl px-20">
            <center>
              <form
                method="post"
                onSubmit={handleSubmit}
                className="align-center flex w-96 flex-col gap-4"
              >
                <input
                  value={userInfo.identifier}
                  onChange={({ target }) =>
                    setUserInfo({ ...userInfo, identifier: target.value })
                  }
                  className="mt-8 rounded-full border text-lg text-black invalid:text-pink-600 focus:border-[#1C3253] focus:outline-none focus:ring-1 focus:ring-[#1C3253] focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  type="text"
                  name="identifier"
                  placeholder="Email or Username"
                />

                <div className="relative">
                  <input
                    value={userInfo.password}
                    onChange={({ target }) =>
                      setUserInfo({ ...userInfo, password: target.value })
                    }
                    className="w-full rounded-full border pr-4 text-lg text-black focus:border-[#1C3253] focus:outline-none focus:ring-1 focus:ring-[#1C3253]"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                  />
                  {/* Conditionally render the eye icons */}
                  <div
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="gray"
                        class="h-6 w-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="gray"
                        class="h-6 w-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`hover:text-slate-800] m-4 inline-block w-48 place-self-center rounded-full border-2 border-red-800 bg-red-700 px-12 py-2 text-lg font-semibold text-white hover:bg-red-800 ${
                    isLoading ? "cursor-not-allowed opacity-50" : ""
                  } button-wrapper`}
                >
                  {isLoading ? (
                    <img
                      src="/assets/loading_icon.svg"
                      alt="Loading"
                      className="loading-image"
                    />
                  ) : (
                    "SIGN IN"
                  )}
                </button>
              </form>
              {/* Display error message */}
              {error && <p className="mt-2 text-lg text-white">{error}</p>}
            </center>
            {/* Bottom left photo */}
            <div className="pointer-events-none absolute top-0 left-0 flex w-48 select-none">
              {" "}
              <img
                src="https://mcl.edu.ph/wp-content/uploads/2022/04/MMCL_Logo-258x300-1.webp"
                alt=""
                className="mb-4 w-full p-8"
              />
            </div>
          </div>

          {/* right side */}
          {/* <div className="mt-16 hidden w-2/4 rounded-tr-2xl rounded-br-2xl bg-white py-10 px-12 md:block">
            <center>
              <h2 className="text-3xl font-bold text-[#CE4044]">
                WELCOME BACK TO FACTUALLY.
              </h2>
              <div className="inline-block w-20 border-2 border-[#CE4044]">
                {" "}
              </div>
              <p className="mt-2 text-xl text-[#CE4044]">
                Never been here before? We&apos;d love for you to join us below!
              </p>
              <img
                className="robot-image w-[300px]"
                src="/robbie/r_welcome.png"
                alt=""
              />
              <button
                className="inline-block w-72 rounded-full border-2 border-[#CE4044] px-12 py-2 text-lg font-semibold text-[#CE4044] hover:bg-[#CE4044] hover:text-white"
                onClick={() => router.push("/register")}
              >
                SIGN UP
              </button>
              <img src="/robbie hi.png" alt="" />
            </center>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default SignIn;
