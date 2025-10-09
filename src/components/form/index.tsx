import { useEffect } from 'react'

import {
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
  useForm as UseReactHookForm
} from 'react-hook-form'

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues
>(
  { defaultValues, ...props } = {} as UseFormProps<
    TFieldValues,
    TContext,
    TTransformedValues
  >
): UseFormReturn<TFieldValues, TContext, TTransformedValues> {
  const { reset, ...form } = UseReactHookForm<
    TFieldValues,
    TContext,
    TTransformedValues
  >(props)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues as TFieldValues, {
        keepDefaultValues: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false
      })
    }
  }, [defaultValues, reset])

  return { ...form, reset }
}
