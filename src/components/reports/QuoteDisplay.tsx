import useQuoteStore from "@/store/quoteStore"

interface QuoteDisplayProps {
  result: {
    totalCost: number
    totalTime: number
  } | null
}

function QuoteDisplay({ result }: QuoteDisplayProps) {
  const gaskets = useQuoteStore((state) => state.gaskets)

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Current Quote</h2>
      <div>
        <h3 className="text-lg font-bold">Gaskets</h3>
        <ul>
          {gaskets.map((gasket) => (
            <li key={gasket.id}>
              {gasket.quantity}x {gasket.shape === "rectangle" ? `${gasket.width}x${gasket.height}` : `${gasket.diameter}" Dia`}
            </li>
          ))}
        </ul>
      </div>
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Results</h3>
          <p>Total Cost: ${result.totalCost.toFixed(2)}</p>
          <p>Total Time: {result.totalTime.toFixed(2)} hours</p>
        </div>
      )}
    </div>
  )
}

export default QuoteDisplay
