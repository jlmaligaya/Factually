import { signIn } from "next-auth/react";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/router";



const SignIn = (props) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
    const [userInfo, setUserInfo] = useState({ email: "", password: "" });
    const handleSubmit = async (e) => {
        // validate your userinfo
        e.preventDefault();
        const res = await signIn("credentials", {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false,
        });
        if (res.status === 401) {
            setShowModal(true);
          } else {
            router.push("/");
          }
        
    };
    return ( 
      <>
              {showModal && (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg">
        <div className="flex items-center mb-4">
          <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-black font-bold">Account does not exist.</p>
        </div>
        <button className="bg-red-500 text-white py-2 px-4 rounded-full w-full" onClick={() => setShowModal(false)}>OK</button>
      </div>
    </div>
    
      )}

      
      <section className="bg-[url('/background.png')] bg-cover min-h-screen flex items-center justify-center">
      
          <div className="flex rounded-xl shadow-lg font-retropix justify-center">                 

            {/* left side */}
              <div className="md:w-2/4 mt-16  bg-[#CE4044] rounded-tl-2xl rounded-bl-2xl py-10 px-12">
                <center>
                <img className="rounded-xl w-20 mt-8" src="/logo.png" alt="" />
                  <h2 className="font-bold text-3xl text-white mt-5">SIGN IN</h2>
                  <p className="mt-3 text-white text-xl"> Connect and continue your progress. </p>
                                
                  <form method="post" onSubmit={handleSubmit} className="flex flex-col gap-4 align-center w-72">
                      <input
                      value={userInfo.email}
                      onChange={({ target }) =>
                        setUserInfo({ ...userInfo, email: target.value })
                      }
                      className = "mt-8 rounded-full border focus:outline-none focus:border-[#1C3253] focus:ring-1 focus:ring-[#1C3253] invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 text-black" type="email" name="email" placeholder="Email" />

                      <input
                      value={userInfo.password}
                      onChange={({ target }) =>
                        setUserInfo({ ...userInfo, password: target.value })
                      }
                      className = "rounded-full border w-full focus:outline-none focus:border-[#1C3253] focus:ring-1 focus:ring-[#1C3253] text-black" type="password" name="password" placeholder="Password" />     

                      <input 
                      type="submit"
                      value="SIGN IN"
                      className="border-2 border-white text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-[#CE4044] m-4 text-lg w-48 place-self-center"/>                 
                  </form>
                   
                  
                  </center>
              </div>
          
          {/* right side */}
              <div className="md:block hidden w-2/4 mt-16 bg-white rounded-tr-2xl rounded-br-2xl py-10 px-12">
                <center>
                  <h2 className="text-3xl font-bold text-[#CE4044]"> WELCOME BACK TO FACTUALLY. </h2>
                    <div className="border-2 w-20 border-[#CE4044] inline-block"> </div>
                    <p className="text-[#CE4044] text-xl mt-2">  Never been here before? We'd love for you to join us below! </p>
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