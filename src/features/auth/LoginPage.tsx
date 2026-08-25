import { useState, type FormEvent } from 'react'
import { AuthLayout } from './AuthLayout'
import { FormField } from './FormField'
import { PasswordField } from './PasswordField'
import {
  hasErrors,
  validateEmail,
  validateLogin,
  validateRequiredPassword,
  type FieldErrors,
  type LoginValues,
} from './validation'

const initialValues: LoginValues = { email: '', password: '' }

export function LoginPage() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({})
  const [formMessage, setFormMessage] = useState('')

  function updateField(field: keyof LoginValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateLogin(values)
    setErrors(nextErrors)

    if (hasErrors(nextErrors)) return

    setFormMessage(
      'Sign in is ready for connection once the authentication API contract is available.',
    )
  }

  return (
    <AuthLayout
      title="Sign in"
      description="Enter the details associated with your account."
      footerPrompt="Don’t have an account?"
      footerAction="Create account"
      footerTo="/register"
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
          autoComplete="current-password"
          onChange={(event) => updateField('password', event.target.value)}
          onBlur={() =>
            setErrors((current) => ({
              ...current,
              password: validateRequiredPassword(values.password),
            }))
          }
        />

        {formMessage ? (
          <p className="form-notice" role="status">
            {formMessage}
          </p>
        ) : null}

        <button className="submit-button" type="submit">
          Sign in
        </button>
      </form>
    </AuthLayout>
  )
}

