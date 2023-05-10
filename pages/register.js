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
             <section className="bg-[url('/background.jpg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="bg-gray-200 flex rounded-xl shadow-lg p-5">
        <div className="md:block hidden w-1/2">
          <img className="rounded-xl" src="logo.png" alt="" />
        </div>

        <div className="md:w-1/2 px-8 mt-16">
          <h2 className="font-bold text-3xl text-[#1C3253]">Sign Up</h2>
          <p className="mt-3 text-[#1C3253] font-medium">
            Register below and join Factually today!
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
  <div className="grid grid-cols-2 gap-4">
    <div>
    <input
      className={`p-2 mt-8 rounded-full border ${
        firstNameError ? 'border-red-500' : ''
      } text-black`}
      type="text"
      name="firstName"
      placeholder="First Name"
      value={form.firstName}
      onChange={handleChange}
    />
    {firstNameError && (
      <p className="text-red-500 text-sm">{firstNameError}</p>
    )}
    </div>

    <div>
    <input
      className={`p-2 mt-8 rounded-full border ${
        lastNameError ? 'border-red-500' : ''
      } text-black`}
      type="text"
      name="lastName"
      placeholder="Last Name"
      value={form.lastName}
      onChange={handleChange}
    />
    {lastNameError && (
      <p className="text-red-500 text-sm">{lastNameError}</p>
    )}
    </div>

  </div>

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
    <p className="text-red-500 text-sm">{usernameError}</p>
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
    <p className="text-red-500 text-sm">{emailError}</p>
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
    <p className="text-red-500 text-sm">{passwordError}</p>
  )}

<input
  className={`p-2 rounded-full border ${
    confirmPasswordError ? 'border-red-500' : ''
  } text-black`}
  type="password"
  name="confirmPass"
  placeholder="Confirm Password"
  value={form.confirmPass}
  onChange={handleChange}
/>
{confirmPasswordError && (
  <p className="text-red-500 text-sm">{confirmPasswordError}</p>
)}


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