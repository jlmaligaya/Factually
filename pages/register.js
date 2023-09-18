import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import * as Yup from 'yup';
import Link from 'next/link'


export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPass: '',
  })

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPass: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [showModal, setShowModal] = useState(false);

  const handleChange = e => {
    
    const { name, value } = e.target
    setForm(prevState => ({ ...prevState, [name]: value }))

  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form using Yup schema
      await registerSchema.validate(form, { abortEarly: false });
      const res = await axios.post('/api/register', form);
      setShowModal(true);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // If there are validation errors, update state with error messages
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
  
        setFirstNameError(errors.firstName || false);
        setLastNameError(errors.lastName || false);
        setUsernameError(errors.username || false);
        setEmailError(errors.email || false);
        setPasswordError(errors.password || false);
  
        // Add validation for confirm password
        if (errors.confirmPass === 'Confirm password is required') {
          setConfirmPasswordError('Confirm password is required');
        } else {
          setConfirmPasswordError(errors.confirmPass || false);
        }
      } else {
        console.error(error);
      }
    }
  };
  
  
    
    return (      
         <>
              {showModal && (
                        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-black font-bold">You are now registered!</p>
            </div>
            <Link href="/auth/signIn">
            <button className="bg-green-500 text-white py-2 px-4 rounded w-full" onClick={() => setShowModal(false)}>OK</button>
            </Link>
            
          </div>
        </div>
      )}

    <section className="bg-[url('/background.jpg')] bg-cover min-h-screen flex items-center justify-center font-retropix">
      <div className="flex rounded-xl shadow-lg">

        {/* left side*/}
        <div className="md:block hidden w-2/4 mt-16 bg-white rounded-tl-2xl rounded-bl-2xl py-10 px-12 items-center">
          <center>
            <h2 className="text-3xl font-bold mb-2 text-[#CE4044]"> WELCOME TO FACTUALLY! </h2>
            <div className="border-2 w-20 border-[#CE4044] inline-block"> </div>
            <img className="hover:animate-bounce" src="/robbie/r_list.png" alt="" />
            <button className="border-2 text-[#CE4044] border-[#CE4044] rounded-full w-72 px-12 py-2 inline-block font-semibold hover:bg-[#CE4044] hover:text-white text-lg" 
              onClick={() => router.push('/auth/signIn')}>SIGN IN</button>
          </center>
        </div>

        {/* right side*/}
        <div className="md:w-2/4 mt-16  bg-[#CE4044] rounded-tr-2xl rounded-br-2xl py-10 px-12">
          <center>
            <h2 className="font-bold text-3xl text-white">CREATE AN ACCOUNT</h2>
            <p className="mt-3 text-white text-xl">
              Register below and join Factually today!
            </p>
            

            <form className="flex flex-col gap-4 w-72" onSubmit={handleSubmit}>        
                <input
                  className={`p-2 mt-4 rounded-full border ${
                    firstNameError ? 'border-red-500' : ''
                  } text-black`}
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                />

                {firstNameError && (
                  <p className="text-white text-sm">{firstNameError}</p>
                )}

              <input
                  className={`p-2 rounded-full border ${
                    lastNameError ? 'border-red-500' : ''
                  } text-black`}
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                />
                {lastNameError && (
                  <p className="text-white text-sm">{lastNameError}</p>
                )}

              <input
                className={`p-2 rounded-full border ${
                  usernameError ? 'border-red-500' : ''
                } text-black`}
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
              {usernameError && (
                <p className="text-white text-sm">{usernameError}</p>
              )}

              <input
                className={`p-2 rounded-full border ${
                  emailError ? 'border-red-500' : ''
                } text-black`}
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              {emailError && (
                <p className="text-white text-sm">{emailError}</p>
              )}

              <input
                className={`p-2 rounded-full border ${
                  passwordError ? 'border-red-500' : ''
                } text-black`}
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              {passwordError && (
                <p className="text-white text-sm">{passwordError}</p>
              )}

            <input
              className={`p-2 rounded-full  border ${
                confirmPasswordError ? 'border-red-500' : ''
              } text-black`}
              type="password"
              name="confirmPass"
              placeholder="Confirm Password"
              value={form.confirmPass}
              onChange={handleChange}
            />
            {confirmPasswordError && (
              <p className="text-white text-sm">{confirmPasswordError}</p>
            )}


              <button
                className="border-2 border-white text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-[#CE4044] m-4 text-lg w-48 place-self-center"
                onClick={handleSubmit}
              >
                SIGN UP
              </button>
            </form>
          </center>                 
        </div>
      </div>
            
    </section>
        </>
    );
}