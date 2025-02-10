'use client';
import React, {
  useMemo,
  useRef,
  useState,
} from 'react';

import emptyImg from '../../../assets/emptyBox.png'
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll"
import AvatarEditor from 'react-avatar-editor';
import { BsStars } from 'react-icons/bs';
import { CgDetailsMore } from 'react-icons/cg';
import {
  FaImage,
  FaWindowClose,
} from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import uniqid from 'uniqid';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import LabeledInput from 'components/input/LabeledInput';
import { Avatar, Checkbox, Chip, Select, SelectItem, SharedSelection, tv, useCheckbox, useDisclosure } from '@nextui-org/react';
import { bookCategories } from 'assets/CreateVariables';
import ReactFlagsSelect from 'react-flags-select/build/components/ReactFlagsSelect';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InputSwitch } from 'primereact/inputswitch';
import Button from 'components/buttons/Button';
import { HiOutlineUpload } from 'react-icons/hi';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import MultipleDropDown from 'components/drowdown/MultipleDropDown';
import ModalComponent from 'components/modal/ModalComponent';
import { IoIosAddCircle } from 'react-icons/io';
import { Requirement, requirementOptions } from '../competition/page';
import { useFieldArray, useForm } from 'react-hook-form';
import RequirementSelect from 'react-tailwindcss-select'
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import toast from 'react-hot-toast';
import useStorage from 'hooks/storage/useStorage';

import FormContainer from 'components/forms/FormContainer';
import ClubForm from 'components/forms/club/ClubForm';

export interface Club{
  hasRequirements: boolean,
  clubName: string,
  clubLogo:File,
  description: string,
  isFreeToJoin:boolean,
  requirements:Requirement[]
}


function CreateClub() {
  const { register, reset, getValues, setError, clearErrors, setValue, handleSubmit } = useForm<Club>();
  const { register: registerRequirement, reset: resetRequirement, getValues: getRequirementValues, setError: setRequirementError, clearErrors: clearRequirementErrors, setValue: setRequirementValue, handleSubmit: handleRequirementSubmit } = useForm<Requirement>();
  const [selectedBookType, setselectedBookType] = useState<SelectValue>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useRouter();

  const { user } = useAuthContext();
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  const [previewImage, setPreviewImage] = useState<string>();
  const [selectedType, setSelectedType] = useState<SelectValue>(null);
  const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(new Set([]));
  const [modalRequirementContent, setModalRequirementContent] = useState<Requirement>();
  const { isOpen: isAnswerModalOpen, onOpen: onAnswerModalOpen, onOpenChange: onAnswerModalOpenChange, onClose: onAnswerModalClose } = useDisclosure();
  const { uploadImage, uploadImageUrl, getImageUrl } = useStorage();
  const answerModal = (item: Requirement) => {
    return (<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div>
      <p className="text-white">{item.requirementQuestion}</p>
      <p className='text-base text-white'>{item.requirementQuestionPossibleAnswers && item.requirementQuestionPossibleAnswers.join(', ')}</p>
    </div>} onClose={() => {
      setModalRequirementContent(undefined);
      onAnswerModalClose();
    }} onOpenChange={() => {
      onAnswerModalOpenChange();
    }} />)
  }

 
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  
  
  const {
    children,
    isSelected,
    isFocusVisible,
    isFocused,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    defaultSelected: true,
  })

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: true,
    isEnabled: isFocusVisible,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
  });
  
  


  return (
    <FormContainer<Club>>
<ClubForm/>
    </FormContainer>
  );
}

export default CreateClub;
