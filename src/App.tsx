import GasketForm from "@/components/forms/GasketForm"
import MaterialForm from "@/components/forms/MaterialForm"
import QuoteDisplay from "@/components/reports/QuoteDisplay"
import { Button } from "@/components/ui/button"
import { useQuoteEngine } from "@/hooks/useQuoteEngine"

function App() {
  const { result, isCalculating, calculate } = useQuoteEngine()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">GasketOptima 2.0</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <GasketForm />
          <MaterialForm />
        </div>
        <div>
          <QuoteDisplay result={result} />
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={calculate} disabled={isCalculating}>
          {isCalculating ? "Calculating..." : "Calculate"}
        </Button>
      </div>
    </div>
  )
}

export default App
