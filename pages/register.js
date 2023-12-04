import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import * as Yup from "yup";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPass: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearErrors = () => {
    setFirstNameError(false);
    setLastNameError(false);
    setUsernameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    try {
      setLoading(true);
      // Validate form using Yup schema
      await registerSchema.validate(form, { abortEarly: false });

      // Check if the username or email already exists
      const existingUser = await axios.post("/api/checkUserExistence", {
        username: form.username,
        email: form.email,
      });

      if (existingUser.data.exists) {
        const { username, email } = existingUser.data;
        setUsernameError(`Username '${form.username}' already exists`);
        setEmailError(`Email '${form.email}' already exists`);
        return;
      }

      // Continue with user creation if no existing user found
      const res = await axios.post("/api/register", form);
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
        if (errors.confirmPass === "Confirm password is required") {
          setConfirmPasswordError("Confirm password is required");
        } else {
          setConfirmPasswordError(errors.confirmPass || false);
        }
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8">
            <div className="mb-4 flex items-center">
              <svg
                className="mr-2 h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="font-bold text-black">You are now registered!</p>
            </div>
            <Link href="/auth/signIn">
              <button
                className="w-full rounded bg-green-500 py-2 px-4 text-white"
                onClick={() => {
                  clearErrors(); // Clear errors when Sign In button is clicked
                  router.push("/auth/signIn");
                }}
              >
                OK
              </button>
            </Link>
          </div>
        </div>
      )}

      <section className="flex min-h-screen items-center justify-center bg-[url('/background.png')] bg-cover font-retropix">
        <div className="flex rounded-xl shadow-lg">
          {/* left side*/}
          <div className="mt-16 hidden w-2/4 items-center rounded-tl-2xl rounded-bl-2xl bg-white py-10 px-12 md:block">
            <center>
              <h2 className="mb-2 text-3xl font-bold text-[#CE4044]">
                {" "}
                WELCOME TO FACTUALLY.{" "}
              </h2>
              <div className="inline-block w-20 border-2 border-[#CE4044]">
                {" "}
              </div>
              <p className="mt-2 text-xl text-[#CE4044]">
                {" "}
                Already registered? Continue what you started instead!{" "}
              </p>
              <img
                className="robot-image w-[350px]"
                src="/robbie/r_list.png"
                alt=""
              />
              <button
                className="inline-block w-72 rounded-full border-2 border-[#CE4044] px-12 py-2 text-lg font-semibold text-[#CE4044] hover:bg-[#CE4044] hover:text-white"
                onClick={() => router.push("/auth/signIn")}
              >
                SIGN IN
              </button>
            </center>
          </div>

          {/* right side*/}
          <div className="mt-16 rounded-tr-2xl  rounded-br-2xl bg-[#CE4044] py-10 px-12 md:w-2/4">
            <center>
              <h2 className="text-3xl font-bold text-white">
                CREATE AN ACCOUNT
              </h2>
              <p className="mt-3 text-xl text-white">
                Register below and join Factually today!
              </p>

              <form
                className="flex w-72 flex-col gap-4"
                onSubmit={handleSubmit}
              >
                <input
                  className={`mt-4 rounded-full border p-2 ${
                    firstNameError ? "border-red-500" : ""
                  } text-black`}
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                />

                {firstNameError && (
                  <p className="text-sm text-white">{firstNameError}</p>
                )}

                <input
                  className={`rounded-full border p-2 ${
                    lastNameError ? "border-red-500" : ""
                  } text-black`}
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                />
                {lastNameError && (
                  <p className="text-sm text-white">{lastNameError}</p>
                )}

                <input
                  className={`rounded-full border p-2 ${
                    usernameError ? "border-red-500" : ""
                  } text-black`}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                />
                {usernameError && (
                  <p className="text-sm text-white">{usernameError}</p>
                )}

                <input
                  className={`rounded-full border p-2 ${
                    emailError ? "border-red-500" : ""
                  } text-black`}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
                {emailError && (
                  <p className="text-sm text-white">{emailError}</p>
                )}

                <input
                  className={`rounded-full border p-2 ${
                    passwordError ? "border-red-500" : ""
                  } text-black`}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
                {passwordError && (
                  <p className="text-sm text-white">{passwordError}</p>
                )}

                <input
                  className={`rounded-full border  p-2 ${
                    confirmPasswordError ? "border-red-500" : ""
                  } text-black`}
                  type="password"
                  name="confirmPass"
                  placeholder="Confirm Password"
                  value={form.confirmPass}
                  onChange={handleChange}
                />
                {confirmPasswordError && (
                  <p className="text-sm text-white">{confirmPasswordError}</p>
                )}

                <button
                  className="m-4 inline-block w-48 place-self-center rounded-full border-2 border-white px-12 py-2 text-lg font-semibold text-white hover:bg-white hover:text-[#CE4044]"
                  onClick={handleSubmit}
                >
                  {loading ? "Signing Up..." : "SIGN UP"}
                </button>
              </form>
            </center>
          </div>
        </div>
      </section>
    </>
  );
}
