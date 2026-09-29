export type LoginValues = {
  email: string
  password: string
}

export type RegisterValues = LoginValues & {
  confirmPassword: string
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  const value = email.trim()

  if (!value) return 'Enter your email address.'
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.'
  return undefined
}

export function validateRequiredPassword(password: string) {
  return password ? undefined : 'Enter your password.'
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  return {
    email: validateEmail(values.email),
    password: validateRequiredPassword(values.password),
  }
}

export function validateRegister(
  values: RegisterValues,
): FieldErrors<RegisterValues> {
  return {
    email: validateEmail(values.email),
    password: validateRequiredPassword(values.password),
    confirmPassword: !values.confirmPassword
      ? 'Confirm your password.'
      : values.confirmPassword !== values.password
        ? 'Passwords do not match.'
        : undefined,
  }
}

export function hasErrors<T extends object>(errors: FieldErrors<T>) {
  return Object.values(errors).some(Boolean)
}

