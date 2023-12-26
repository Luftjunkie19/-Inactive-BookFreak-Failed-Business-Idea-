import "../stylings/backgrounds.css";

import { useState } from "react";

import Lottie from "lottie-react";
import { FaFacebook, FaGithub, FaGoogle, FaPhoneAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Alert } from "@mui/material";

import loginAnimation from "../../assets/lottieAnimations/Animation - 1703334726800.json";
import formsTranslations from "../../assets/translations/FormsTranslations.json";
import { useLogin } from "../../hooks/useLogin";

function Login() {
  const {
    signInNormally,
    signInWithGithub,
    signInWithGoogle,
    signInWithFacebook,
    error,
  } = useLogin();

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    signInNormally(email, password);
  };

  return (
    <div className="min-h-screen h-full w-full flex flex-wrap justify-around items-center pattern-bg">
      <div className="max-w-md">
        <h2 className="text-center text-3xl text-white leading-10 my-2 font-bold">
          {formsTranslations.signInForm.topText[selectedLanguage]}
        </h2>
        <Lottie animationData={loginAnimation} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="py-8 text-white sm:w-full md:max-w-md lg:max-w-lg 2xl:max-w-2xl lg:border-2 lg:shadow-md lg:shadow-accColor lg:border-accColor lg:rounded-lg lg:bg-primeColor"
      >
        <div className="flex justify-center items-center flex-wrap gap-3 w-full">
          <label className="flex flex-col sm:w-full md:max-w-md">
            <span>Email:</span>
            <input
              className="p-2 rounded-md border-accColor outline-none input text-white w-full"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col sm:w-full md:max-w-md">
            <span>
              {formsTranslations.userFields.password[selectedLanguage]}:
            </span>
            <input
              className="p-2 rounded-md input border-accColor outline-none text-white w-full"
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        <div className="flex justify-center items-center flex-col my-3">
          <button className="btn sm:w-full lg:w-1/2 bg-accColor text-white">
            {formsTranslations.signUpForm.btnText[selectedLanguage]}
          </button>

          {error && (
            <Alert className="bg-transparent text-red-400" severity="error">
              {error}
            </Alert>
          )}
        </div>

        <div className="flex w-full flex-wrap gap-5 justify-center items-center my-2">
          <Link
            className="btn sm:w-3/4 lg:w-2/5 text-white"
            to="/forgot-password"
          >
            {
              formsTranslations.signingOptions.passwordForgotten[
                selectedLanguage
              ]
            }
          </Link>
        </div>

        <h3 className="text-center text-2xl leading-9 p-2">
          {formsTranslations.signInForm.optionsText[selectedLanguage]}
        </h3>
        <div className="flex w-full flex-wrap justify-center items-center gap-8">
          <button
            className="btn text-white w-24 h-24 bg-blue-600 border-none hover:bg-blue-500"
            onClick={signInWithGoogle}
          >
            <FaGoogle className=" text-5xl" />
          </button>
          <button
            className="btn bg-facebook  w-24 h-24 text-white border-none hover:bg-blue-800"
            onClick={signInWithFacebook}
          >
            <FaFacebook className=" text-5xl" />
          </button>
          <button
            className="btn text-white  w-24 h-24 bg-github hover:bg-gray-900"
            onClick={signInWithGithub}
          >
            <FaGithub className=" text-5xl" />
          </button>
          <Link
            className="btn w-24 h-24 bg-green-400 text-white"
            to="/login-with-phone"
          >
            <FaPhoneAlt className=" text-5xl" />{" "}
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
