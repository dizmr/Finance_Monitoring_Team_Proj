import { useState, type FormEvent } from 'react'
import { AuthLayout } from './AuthLayout'
import { FormField } from './FormField'
import { PasswordField } from './PasswordField'
import {
  hasErrors,
  validateEmail,
  validateRegister,
  validateRequiredPassword,
  type FieldErrors,
  type RegisterValues,
} from './validation'

const initialValues: RegisterValues = {
  email: '',
  password: '',
  confirmPassword: '',
}

export function RegisterPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FieldErrors<RegisterValues>>({})
  const [formMessage, setFormMessage] = useState('')

  function updateField(field: keyof RegisterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateRegister(values)
    setErrors(nextErrors)

    if (hasErrors(nextErrors)) return

    setFormMessage(
      'Account creation is ready for connection once the authentication API contract is available.',
    )
  }

  return (
    <AuthLayout
      title="Create account"
      description="Set up your account access details."
      footerPrompt="Already have an account?"
      footerAction="Sign in"
      footerTo="/login"
    >
      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          onChange={(event) => updateField('email', event.target.value)}
          onBlur={() =>
            setErrors((current) => ({
              ...current,
              email: validateEmail(values.email),
            }))
          }
        />
        <PasswordField
          id="password"
          label="Password"
          value={values.password}
          error={errors.password}
          autoComplete="new-password"
          onChange={(event) => updateField('password', event.target.value)}
          onBlur={() =>
            setErrors((current) => ({
              ...current,
              password: validateRequiredPassword(values.password),
            }))
          }
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          autoComplete="new-password"
          onChange={(event) =>
            updateField('confirmPassword', event.target.value)
          }
          onBlur={() =>
            setErrors((current) => ({
              ...current,
              confirmPassword: !values.confirmPassword
                ? 'Confirm your password.'
                : values.confirmPassword !== values.password
                  ? 'Passwords do not match.'
                  : undefined,
            }))
          }
        />

        {formMessage ? (
          <p className="form-notice" role="status">
            {formMessage}
          </p>
        ) : null}

        <button className="submit-button" type="submit">
          Create account
        </button>
      </form>
    </AuthLayout>
  )
}

