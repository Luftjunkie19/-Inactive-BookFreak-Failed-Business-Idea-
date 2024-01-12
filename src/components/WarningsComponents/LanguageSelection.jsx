import React, {
  useEffect,
  useState,
} from 'react';

import ReactFlagsSelect from 'react-flags-select';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { Link } from 'react-router-dom';

import formsTranslations
  from '../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../context/SnackBarContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useRealDatabase } from '../../hooks/useRealDatabase';
import useRealtimeDocument from '../../hooks/useRealtimeDocument';

function LanguageSelection() {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState('');
  const [hasNoNationality, setHasNoNationalitySet] = useState(false);
  const [hasNotRegistered, setHasNotRegistered] = useState(false);
  const { addToDataBase, updateDatabase, removeFromDataBase} = useRealDatabase();
  const selectedLanguage = useSelector((state) => state.languageSelection.selectedLangugage);
  const { getDocument } = useRealtimeDocument();
  const [link, setLink] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUserDocument = async () => {
    if (user) {
      const userObject = await getDocument('users', user.uid);

      if (userObject) {
        setLink(userObject?.accountLinkObject?.url);
      }

      if (!userObject.nationality && user && userObject.accountLinkObject) {
        setHasNoNationalitySet(true);
      } else if (userObject.nationality && user && userObject.accountLinkObject) {
        setHasNotRegistered(true);
      } else {
        setHasNoNationalitySet(false);
        setHasNotRegistered(false);
      }
    }
  };

  const askLater=()=>{
    removeFromDataBase('users', `${user.uid}/accountLinkObject`);
    setHasNotRegistered(false);
  }

  useEffect(() => {
    loadUserDocument();
  }, [loadUserDocument]);

  const submitHandle = () => {
    if (user && selected.trim('') !== '') {
      addToDataBase('users', `${user.uid}/nationality`, {
        nationality: selected.toLowerCase(),
        nationalityFlag: `https://flagcdn.com/h40/${selected.toLowerCase()}.png`,
      });
      setHasNoNationalitySet(false);
    }
  };

  const updateAccountLink = async () => {
    try {
      const userObject = await getDocument('users', user.uid);

      const accountLinkResponse =await fetch(
        "https://us-central1-bookfreak-954da.cloudfunctions.net/stripeFunctions/createAccountLink",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Connection: "keep-alive",
            Accept: "*",
          },
          body: JSON.stringify({ accountId: userObject.stripeAccountData.id }),
        }
      );

      const { accountLinkObject } = accountLinkResponse.data;

      updateDatabase(accountLinkObject, 'users', `${user.uid}/accountLinkObject`);

      setLink(accountLinkObject.url);
      dispatch(snackbarActions.showMessage({ message: '', alertType: 'success' }));
    } catch (error) {
      dispatch(snackbarActions.showMessage({ message: '', alertType: 'error' }));
      console.log(error.message);
    }
  };

  return (
    <div
      className={`fixed z-[99999999] top-0 left-0 w-full h-full bg-imgCover ${
        (hasNoNationality || hasNotRegistered) ? 'flex' : 'hidden'
      } flex-col justify-center items-center group`}
    >
  

      <div className="flex flex-col gap-2 justify-center items-center border-2 border-primeColor shadow-md shadow-primeColor bg-accColor rounded-xl py-8 px-4 mx-3 sm:w-full max-w-md transition-all duration-500">
        <ul className="steps">
          <li className="step step-success">{formsTranslations.fullfillData.first[selectedLanguage]}</li>
          <li className={`step ${!hasNoNationality && 'step-success'}`}>
            {formsTranslations.fullfillData.second[selectedLanguage]}
          </li>
          <li className={`step ${!hasNotRegistered && !hasNoNationality && 'step-success'}`}>
            {formsTranslations.fullfillData.third[selectedLanguage]}
          </li>
        </ul>
        {hasNoNationality && (
          <>
            <h2 className="text-xl text-white font-bold text-center">
              {formsTranslations.topText.selectNationality[selectedLanguage]}
            </h2>

            <ReactFlagsSelect
              searchPlaceholder="Search countries"
              className="text-black sm:w-full lg:w-3/4"
              selectButtonClassName="bg-accColor text-white rounded-md border-white text-white"
              selected={selected}
              onSelect={(code) => {
                setSelected(code);
                console.log(code);
              }}
            />

            <button className="btn bg-primeColor border-none text-white" onClick={submitHandle}>
              {formsTranslations.submit[selectedLanguage]}
            </button>
          </>
        )}

        {!hasNoNationality && hasNotRegistered && (
          <>
            <p className="text-white font-medium">{formsTranslations.provideFinancialData[selectedLanguage]}</p>
            <Link to={`${link}`} className="btn bg-primeColor border-none text-white">
              {formsTranslations.provide[selectedLanguage]}
            </Link>

            <small className="text-white">{formsTranslations.info[selectedLanguage]}</small>
            <div className="w-full flex flex-wrap justify-center gap-2">
            <button
          className={`btn btn-info`}
          onClick={askLater}
        >
          {formsTranslations.askLater[selectedLanguage]}
        </button>
            <button onClick={updateAccountLink} className="btn text-white bg-primeColor">
              {formsTranslations.testFields.buttonText.createBtn[selectedLanguage]}
            </button>
            </div>
          </>
        )}   
      </div>
    </div>
  );
}

export default LanguageSelection;
