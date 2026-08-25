type RemoveButtonProps = {
  label: string
  onClick: () => void
}

export function RemoveButton({ label, onClick }: RemoveButtonProps) {
  return (
    <button
      className="row-action-button"
      type="button"
      aria-label={`Remove ${label}`}
      title="Remove"
      onClick={onClick}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M7 3h6l.7 1.5H17v1.6H3V4.5h3.3L7 3Zm-2 4.3h10l-.6 9.7H5.6L5 7.3Zm2.1 1.5.4 6.6h5l.4-6.6H7.1Z" />
      </svg>
    </button>
  )
}
