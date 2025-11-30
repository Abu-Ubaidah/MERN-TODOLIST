import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Registeration } from "./Rgisteration";
import { TodoList } from "./protected-route/TodoList";

export const Login = () => {
  const { login, user, loading } = useContext(AuthContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegisterPage, setRegisterPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userDetails, setUserDetails] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoggingIn(true);
    setErrorMessage("");
    setSuccessMessage("");
    const res = await login(userDetails);
    setIsLoggingIn(false);

    if (!res.success) {
      setErrorMessage(res.message || "Login failed!");
      return;
    }
    setSuccessMessage("Login successful");
  };

  if (loading) return <p>Loading...</p>;
  if (user) return <TodoList />;
  if (isRegisterPage) return <Registeration />;

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
          {errorMessage && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
              role="alert"
            >
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
              role="status"
            >
              {successMessage}
            </div>
          )}
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Login
          </h1>

          <form className="flex flex-col gap-4">
            <input
              name="identifier"
              onChange={handleChange}
              value={userDetails.identifier}
              type="text"
              placeholder="Full Name"
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
              disabled={isLoggingIn}
              className={`text-white py-3 rounded-lg transition-colors ${
                isLoggingIn
                  ? "bg-blue-400 cursor-not-allowed" // Disabled style
                  : "bg-blue-500 hover:bg-blue-600" // Normal style
              }`}
            >
              {isLoggingIn ? "Logging In..." : "Login"}
            </button>
          </form>

          <p className="text-gray-500 text-sm mt-4 text-center">
            Dont have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setRegisterPage(true)}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </>
  );
};
