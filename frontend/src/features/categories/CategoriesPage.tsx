import { useState, type FormEvent } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PageHeader } from '../../components/PageHeader'
import { RemoveButton } from '../../components/RemoveButton'
import type { CategoryDraft, TransactionType } from '../drafts/types'
import { useDraftData } from '../drafts/useDraftData'

type CategoryValues = {
  name: string
  type: TransactionType
}

type CategoryErrors = Partial<Record<keyof CategoryValues, string>>

const initialValues: CategoryValues = { name: '', type: 'expense' }

export function CategoriesPage() {
  const { categories, addCategory, removeCategory } = useDraftData()
  const [isAdding, setIsAdding] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<CategoryErrors>({})
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryDraft | null>(null)
  const [feedback, setFeedback] = useState('')

  const expenseCategories = categories.filter(
    (category) => category.type === 'expense',
  )
  const incomeSources = categories.filter(
    (category) => category.type === 'income',
  )

  function closeForm() {
    setIsAdding(false)
    setValues(initialValues)
    setErrors({})
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: CategoryErrors = {
      name: values.name.trim() ? undefined : 'Enter a category name.',
      type:
        values.type === 'expense' || values.type === 'income'
          ? undefined
          : 'Select a category type.',
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    addCategory(values.name.trim(), values.type)
    closeForm()
    setFeedback(
      'Category draft added for this session. It has not been saved to Жени API.',
    )
  }

  function confirmDelete() {
    if (!categoryToDelete) return

    removeCategory(categoryToDelete.id)
    setCategoryToDelete(null)
    setFeedback('Local category draft removed. No server data was changed.')
  }

  function renderGroup(
    title: string,
    description: string,
    items: CategoryDraft[],
  ) {
    return (
      <section className="category-group" aria-label={title}>
        <div className="category-group-heading">
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
          <span>{items.length}</span>
        </div>
        {items.length ? (
          <ul className="compact-list">
            {items.map((category) => (
              <li key={category.id}>
                <strong>{category.name}</strong>
                <RemoveButton
                  label={category.name}
                  onClick={() => setCategoryToDelete(category)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="group-empty">No {title.toLowerCase()} added.</p>
        )}
      </section>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Classification"
        title="Categories"
        description="Keep expense categories and income sources separate for transaction entry."
        action={
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setIsAdding(true)
              setFeedback('')
            }}
          >
            Add category
          </button>
        }
      />

      {isAdding ? (
        <section className="form-panel" aria-labelledby="add-category-title">
          <div className="section-heading">
            <div>
              <h2 id="add-category-title">Add category</h2>
              <p>The selected type controls where this option appears.</p>
            </div>
          </div>

          <form className="management-form" noValidate onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="category-name">Category name</label>
              <input
                id="category-name"
                name="categoryName"
                value={values.name}
                maxLength={80}
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'category-name-error' : undefined}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                  setErrors((current) => ({ ...current, name: undefined }))
                }}
              />
              {errors.name ? (
                <p className="field-error" id="category-name-error" role="alert">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <fieldset className="radio-fieldset">
              <legend>Category type</legend>
              <div className="type-options">
                <label>
                  <input
                    type="radio"
                    name="categoryType"
                    value="expense"
                    checked={values.type === 'expense'}
                    onChange={() =>
                      setValues((current) => ({ ...current, type: 'expense' }))
                    }
                  />
                  <span>
                    <strong>Expense</strong>
                    <small>Used for money going out</small>
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="categoryType"
                    value="income"
                    checked={values.type === 'income'}
                    onChange={() =>
                      setValues((current) => ({ ...current, type: 'income' }))
                    }
                  />
                  <span>
                    <strong>Income source</strong>
                    <small>Used for money coming in</small>
                  </span>
                </label>
              </div>
            </fieldset>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                Add category draft
              </button>
              <button className="secondary-button" type="button" onClick={closeForm}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {feedback ? (
        <p className="workspace-notice" role="status">
          {feedback}
        </p>
      ) : null}

      <section className="data-section" aria-labelledby="category-list-title">
        <div className="section-heading">
          <div>
            <h2 id="category-list-title">Classification list</h2>
            <p>
              {categories.length} session {categories.length === 1 ? 'draft' : 'drafts'}
            </p>
          </div>
        </div>
        <div className="category-grid">
          {renderGroup(
            'Expense categories',
            'Available when recording an expense.',
            expenseCategories,
          )}
          {renderGroup(
            'Income sources',
            'Available when recording income.',
            incomeSources,
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Remove category draft?"
        description={`This removes “${categoryToDelete?.name ?? ''}” from this browser session. No server data will be changed.`}
        confirmLabel="Remove draft"
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
