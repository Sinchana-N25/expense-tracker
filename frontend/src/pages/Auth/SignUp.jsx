import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContextDef";
import { validateEmail } from "../../utils/helper";
import PasswordInput from "../../components/Inputs/PasswordInput";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Signup Form Submit
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
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
      <div className="bg-white p-8 m-5 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">
          Create Account
        </h3>
        <p className="text-sm text-gray-600 mt-2 mb-6 text-center">
          Please fill in the details to sign up
        </p>

        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <PasswordInput
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              label="Email Address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
            />
          </div>

          <div className="mb-6">
            <PasswordInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
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
              Sign Up
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
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-500 hover:underline">
            Login
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

export default Signup;
