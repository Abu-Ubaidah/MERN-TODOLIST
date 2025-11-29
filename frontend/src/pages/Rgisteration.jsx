import { useState } from "react";
import {Login} from "./Login"
import { registerUser } from "../services/api.js";


export const Registeration = () =>{
  const [loginPage, setLoginPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await registerUser(userDetails);
    if (res.success) {
      alert(res.message);
      setIsRegistered(true);
    } else {
      alert(res.message);
    }
  };

  if(loginPage || isRegistered) return <Login/>;


  return (
    <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Register
            </h1>

            <form className="flex flex-col gap-4">
              <input
                name="name"
                onChange={handleChange}
                value={userDetails.name}
                type="text"
                placeholder="Full Name"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                name="email"
                onChange={handleChange}
                value={userDetails.email}
                type="email"
                placeholder="Email Address"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                name="password"
                onChange={handleChange}
                value={userDetails.password}
                type="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleSubmit}
                type="button"
                className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Account
              </button>
            </form>

            <p className="text-gray-500 text-sm mt-4 text-center">
              Already have an account?{" "}
              <span className="text-blue-500 hover:underline cursor-pointer" onClick={()=>setLoginPage(true)}>Login</span>
            </p>
          </div>
        </div>
    </>
    );
}
