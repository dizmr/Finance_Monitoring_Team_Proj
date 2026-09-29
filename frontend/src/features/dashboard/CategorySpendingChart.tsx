export type CategorySpending = {
  name: string
  amount: number
  currency: string
}

type CategorySpendingChartProps = {
  data: CategorySpending[]
  configuredCategoryCount: number
}

export function CategorySpendingChart({
  data,
  configuredCategoryCount,
}: CategorySpendingChartProps) {
  if (!data.length) {
    return (
      <div className="chart-empty" role="status">
        <strong>No category spending yet</strong>
        <span>
          {configuredCategoryCount
            ? `${configuredCategoryCount} expense ${configuredCategoryCount === 1 ? 'category is' : 'categories are'} ready, but transaction amounts are unavailable.`
            : 'Add expense categories to prepare transaction classification.'}
        </span>
      </div>
    )
  }

  const maximum = Math.max(1, ...data.map((item) => item.amount))

  return (
    <ol className="category-spending-list">
      {data.map((item) => (
        <li key={`${item.name}-${item.currency}`}>
          <div>
            <strong>{item.name}</strong>
            <span>
              {item.amount.toLocaleString()} {item.currency}
            </span>
          </div>
          <span className="category-bar-track" aria-hidden="true">
            <span
              className="category-bar-fill"
              style={{ width: `${(item.amount / maximum) * 100}%` }}
            />
          </span>
        </li>
      ))}
    </ol>
  )
}

