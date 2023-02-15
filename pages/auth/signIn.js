import { signIn } from "next-auth/react";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/router";



const SignIn = (props) => {
  const router = useRouter();
    const [userInfo, setUserInfo] = useState({ email: "", password: "" });
    const handleSubmit = async (e) => {
        // validate your userinfo
        e.preventDefault();
        const res = await signIn("credentials", {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false,
        });
        router.push("/");
    };
    return ( 
    <div className="">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
       
        <input
          value={userInfo.email}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, email: target.value })
          }
          type="email"
          placeholder="test@email.com"
        />
        <input
          value={userInfo.password}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, password: target.value })
          }
          type="password"
          placeholder="********"
        />
        <input type="submit" value="Login" />
      </form>
    </div>     )
};
export default SignIn;
