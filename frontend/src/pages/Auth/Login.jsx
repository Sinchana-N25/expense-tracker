import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContextDef";
import { validateEmail } from "../../utils/helper";
import PasswordInput from "../../components/Inputs/PasswordInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  //Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email adress.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");

    //Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log("Login API response:", response.data);
      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        updateUser(user);
        navigate("/dashboard");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full m-5">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">
          Welcome Back
        </h3>
        <p className="text-sm text-gray-600 mt-2 mb-6 text-center">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="text"
              placeholder="Your email"
              className="shadow appearance-none border rounded w-full py-2 px-3 
                         text-gray-700 text-sm leading-tight focus:outline-none 
                         focus:shadow-outline placeholder-xs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-3">{error}</p>}

          <div className="flex items-center justify-between mb-6">
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-700 text-white 
                         font-bold py-2 px-4 rounded focus:outline-none 
                         focus:shadow-outline w-full cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <button
          type="button"
          className="bg-white hover:bg-gray-100 text-gray-800 
                     font-bold py-2 px-4 rounded border border-gray-300 
                     w-full mb-4 cursor-pointer"
        >
          <span role="img" aria-label="Google logo">
            G
          </span>{" "}
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signUp" className="text-teal-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <style jsx>{`
        .placeholder-xs::placeholder {
          font-size: 0.75rem;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Login;
