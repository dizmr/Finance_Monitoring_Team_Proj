import type { ChangeEventHandler, FocusEventHandler } from 'react'

type FormFieldProps = {
  id: string
  label: string
  type?: 'email' | 'text'
  value: string
  error?: string
  autoComplete: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur: FocusEventHandler<HTMLInputElement>
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  error,
  autoComplete,
  onChange,
  onBlur,
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error ? (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

