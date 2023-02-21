import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';



export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault()

     // Validation
     if (firstName === '') {
        setFirstNameError(true);
        return;
      }
      if (lastName === '') {
        setLastNameError(true);
        return;
      }
      if (email === '') {
        setEmailError(true);
        return;
      }
      if (username === '') {
        setUsernameError(true);
        return;
      }
      if (password === '') {
        setPasswordError(true);
        return;
      }
      if (confirmPass === '') {
        setConfirmPasswordError(true);
        return;
      }
    // Save user to database
    try {
        const res = await axios.post('/api/register', { firstName, lastName, email, username, password})

      // Redirect to login page after successful registration
      router.push('/auth/signIn');
    } catch (error) {
        console.log(error)
      alert('An error occurred. Please try again');
    }
  };
    
    return (      
         <>
             <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-gray-200 flex rounded-xl shadow-lg p-5">
        <div className="md:block hidden w-1/2">
          <img className="rounded-xl" src="logo.png" alt="" />
        </div>

        <div className="md:w-1/2 px-8 mt-16">
          <h2 className="font-bold text-3xl text-[#1C3253]">Sign Up</h2>
          <p className="mt-3 text-[#1C3253] font-medium">
            Register below and join Factually today!
          </p>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                className={`p-2 mt-8 rounded-full border ${
                  firstNameError ? "border-red-500" : ""
                }`}
                type="text"
                name="firstname"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFirstNameError(false);
                }}
              />
              <input
                className={`p-2 mt-8 rounded-full border ${
                  lastNameError ? "border-red-500" : ""
                }`}
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setLastNameError(false);
                }}
              />
            </div>
            <input
              className={`p-2 rounded-full border ${
                usernameError ? "border-red-500" : ""
              }`}
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(false);
              }}
            />
            <input
              className={`p-2 rounded-full border ${
                emailError ? "border-red-500" : ""
              }`}
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
            />
            <input
              className={`p-2 rounded-full border ${
                passwordError ? "border-red-500" : ""
              }`}
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
            />
            <input
              className={`p-2 rounded-full border ${
                confirmPasswordError ? "border-red-500" : ""
              }`}
              type="password"
              name="confirmPass"
              placeholder="Confirm Password"
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
                setConfirmPasswordError(false);
              }}
            />
            {/* {error && (
              <p className="text-red-500 text-sm">Error: {error.message}</p>
            )} */}
            <button
              className="bg-[#CE4044] hover:bg-[#1C3253] rounded-full text-white py-2 mt-3"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </form>

                        <div class="mt-10 grid grid-cols-3 items-center text-gray-50">
                            <hr class="border-gray-500" />
                            <p class="text-center text-gray-500"> OR </p>
                            <hr class="border-gray-500" />
                        </div>

                        <p class="mt-5 text-[#1C3253] font-medium"> Already have an account? Sign in below! </p>

                        <button class="bg-[#CE4044] hover:bg-[#1C3253] border py-2 w-full rounded-full text-white mt-4"  onClick={() => router.push('/auth/signIn')}>Sign In</button>
                        <hr class="border-gray-500 mt-10" />
                    </div>
                </div>
            
            </section>
        </>
    );
}