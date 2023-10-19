import { useRef, useState } from "react";

import AvatarEditor from "react-avatar-editor";
import { FaFacebook, FaGithub, FaGoogle, FaPhoneAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Alert } from "@mui/material";

import alertMessages from "../../assets/translations/AlertMessages.json";
import formsTranslations from "../../assets/translations/FormsTranslations.json";
import reuseableTranslations from "../../assets/translations/ReusableTranslations.json";
import { useLogin } from "../../hooks/useLogin";

function SignUp() {
  const {
    signUpUser,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    error,
    isPending,
  } = useLogin();
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userImg, setUserImg] = useState(null);
  const [userImgError, setUserImgError] = useState(null);
  const [userEditImg, setUserEditImg] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const editorRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signUpUser(email, password, displayName, userImg);
  };

  const handleSelect = (e) => {
    setUserImgError(null);
    setUserImg(null);
    setUserEditImg(null);

    let selected = e.target.files[0];

    if (!selected) {
      setUserImgError(
        alertMessages.notifications.wrong.selectAnything[selectedLanguage]
      );
      return;
    }

    if (!selected.type.includes("image")) {
      setUserImgError(
        alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]
      );
      return;
    }

    if (selected.size > 100000) {
      setUserImgError(
        alertMessages.notifications.wrong.tooBigFile[selectedLanguage]
      );
      return;
    }

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setUserEditImg(fileReader.result);
      };
      return;
    }

    setUserImgError(null);
  };

  const handleSaveImg = () => {
    const editorImg = editorRef.current
      .getImageScaledToCanvas()
      .toDataURL("image/jpg");

    const byteCharacters = atob(editorImg.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    setUserImg(byteArray);
    setUserEditImg(null);
  };

  return (
    <div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
      {userEditImg && (
        <div className="fixed top-0 w-full h-full bg-imgCover p-4">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-white flex flex-col items-center">
            <AvatarEditor
              image={userEditImg}
              ref={editorRef}
              width={300}
              height={300}
              borderRadius={500}
              color={[0, 0, 0, 0.5]}
              scale={zoomLevel}
            />

            <label className="flex flex-col my-3">
              <span>Zoom:</span>
              <input
                class="range range-xs range-info sm:w-32 md:w-64"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoomLevel}
                onChange={(e) => setZoomLevel(+e.target.value)}
              />
            </label>
            <button
              className="btn bg-accColor text-white border-none hover:bg-green-400 hover:text-black"
              onClick={handleSaveImg}
            >
              {reuseableTranslations.saveBtn[selectedLanguage]}
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="px-4 py-2 sm:w-full md:w-4/5 lg:w-3/5 xl:w-1/2 2xl:w-2/5 bg-primeColor shadow-lg rounded-lg text-white m-4"
      >
        <h2 className="text-center font-semibold text-3xl leading-10 p-2">
          {formsTranslations.signUpForm.topText[selectedLanguage]}
        </h2>
        <div className="flex gap-4 w-full flex-wrap justify-center items-center sm:flex-col xl:flex-row">
          <label className="flex flex-col text-white sm:w-full lg:w-3/4 ">
            <span>
              {formsTranslations.userFields.nickname[selectedLanguage]}:
            </span>
            <input
              type="text"
              required
              className="py-2 outline-none text-white rounded-md w-full"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-white sm:w-full lg:w-3/4 ">
            <span>Email:</span>
            <input
              type="email"
              required
              className="py-2 outline-none text-white rounded-md w-full"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-white sm:w-full lg:w-3/4 ">
            <span>
              {formsTranslations.userFields.password[selectedLanguage]}:
            </span>
            <input
              type="password"
              required
              className="py-2 outline-none text-white rounded-md w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="flex flex-col text-white sm:w-full lg:w-3/4">
            <span>
              {formsTranslations.userFields.chooseAvatar[selectedLanguage]}:{" "}
            </span>
            <input
              className="file-input file-input-bordered bg-accColor text-white cursor-pointer w-full"
              type="file"
              required
              onChange={handleSelect}
            />
          </label>
        </div>

        <div className="flex justify-center items-center w-full">
          {isPending && (
            <button className="btn sm:w-full lg:w-1/2 my-6">Loading...</button>
          )}

          {!isPending && (
            <button className="btn sm:w-full bg-accColor lg:w-1/2 my-6 text-white">
              {formsTranslations.signUpForm.btnText[selectedLanguage]}
            </button>
          )}
        </div>

        {userImgError && (
          <div className="flex justify-center items-center p-4">
            <Alert className="bg-transparent text-red-400" severity="error">
              {userImgError}
            </Alert>
          </div>
        )}

        <h3 className="text-center text-white font-semibold text-2xl leading-9 p-2">
          {formsTranslations.signUpForm.optionsText[selectedLanguage]}
        </h3>
        <div className="flex w-full justify-center items-center flex-wrap gap-4">
          <Link
            className="btn text-white sm:w-full md:w-3/4 xl:w-2/5"
            to="/sign-in-with-phone"
          >
            <FaPhoneAlt className="text-xl" />
            <span>
              {formsTranslations.signingOptions.phone[selectedLanguage]}
            </span>
          </Link>
          <button
            className="btn sm:w-full md:w-3/4 xl:w-2/5 text-white bg-blue-600 border-none hover:bg-blue-500"
            onClick={signInWithGoogle}
          >
            <FaGoogle className="text-xl" />
            <span>Google</span>
          </button>
          <button
            className="btn sm:w-full md:w-3/4 xl:w-2/5 bg-facebook text-white border-none hover:bg-blue-800"
            onClick={signInWithFacebook}
          >
            <FaFacebook className="text-xl" />
            <span>Facebook</span>
          </button>
          <button
            className="btn sm:w-full md:w-3/4 xl:w-2/5 bg-github hover:bg-gray-900 text-white"
            onClick={signInWithGithub}
          >
            <FaGithub className="text-xl" />
            <span>Github</span>
          </button>
        </div>
        {error && (
          <div className="flex justify-center items-center p-4">
            <Alert className="bg-transparent text-red-400" severity="error">
              {error}
            </Alert>
          </div>
        )}
      </form>
    </div>
  );
}

export default SignUp;
