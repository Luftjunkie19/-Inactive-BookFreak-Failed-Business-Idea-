'use client';
import React from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'

type Props<T extends FieldValues> = {
  children: React.ReactNode,
  

};

function FormContainer<T extends FieldValues>({children }: Props<T>) {
  const methods = useForm<T>();
  
  return (
    <FormProvider {...methods}>
    {children}
    </FormProvider >
  )
}

export default FormContainer