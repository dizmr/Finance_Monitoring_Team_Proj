export type CashFlowPoint = {
  label: string
  income: number
  expenses: number
}

type IncomeExpenseChartProps = {
  data: CashFlowPoint[]
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  if (!data.length) {
    return (
      <div className="chart-empty" role="status">
        <strong>No cash-flow data yet</strong>
        <span>
          Income and expense history is not available from the current data
          source.
        </span>
      </div>
    )
  }

  const width = 640
  const height = 250
  const left = 48
  const top = 18
  const plotWidth = width - left - 18
  const plotHeight = height - top - 42
  const maximum = Math.max(
    1,
    ...data.flatMap((point) => [point.income, point.expenses]),
  )
  const groupWidth = plotWidth / data.length
  const barWidth = Math.min(22, Math.max(8, groupWidth * 0.25))
  const ticks = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="cash-flow-chart">
      <div className="chart-legend" aria-label="Chart legend">
        <span><i className="legend-income" />Income</span>
        <span><i className="legend-expense" />Expenses</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Income and expenses over time"
      >
        {ticks.map((tick) => {
          const y = top + plotHeight - plotHeight * tick
          return (
            <g key={tick}>
              <line
                className="chart-grid-line"
                x1={left}
                x2={width - 18}
                y1={y}
                y2={y}
              />
              <text className="chart-axis-label" x={left - 9} y={y + 4}>
                {Math.round(maximum * tick)}
              </text>
            </g>
          )
        })}
        {data.map((point, index) => {
          const center = left + groupWidth * index + groupWidth / 2
          const incomeHeight = (point.income / maximum) * plotHeight
          const expenseHeight = (point.expenses / maximum) * plotHeight

          return (
            <g key={`${point.label}-${index}`}>
              <rect
                className="chart-bar chart-income-bar"
                x={center - barWidth - 2}
                y={top + plotHeight - incomeHeight}
                width={barWidth}
                height={incomeHeight}
              >
                <title>{`${point.label}: income ${point.income}`}</title>
              </rect>
              <rect
                className="chart-bar chart-expense-bar"
                x={center + 2}
                y={top + plotHeight - expenseHeight}
                width={barWidth}
                height={expenseHeight}
              >
                <title>{`${point.label}: expenses ${point.expenses}`}</title>
              </rect>
              <text
                className="chart-axis-label chart-axis-label-x"
                x={center}
                y={height - 13}
              >
                {point.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

