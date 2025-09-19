import { useState, useEffect } from "react"
import GasketForm from "@/components/forms/GasketForm"
import MaterialForm from "@/components/forms/MaterialForm"
import QuoteDisplay from "@/components/reports/QuoteDisplay"
import { Button } from "@/components/ui/button"
import { useQuoteEngine } from "@/hooks/useQuoteEngine"
import useQuoteStore from "@/store/quoteStore"

function App() {
  const { result, isCalculating, calculate } = useQuoteEngine()
  const [isStale, setIsStale] = useState(false)
  const { gaskets, material } = useQuoteStore()

  useEffect(() => {
    setIsStale(true)
  }, [gaskets, material])

  const handleCalculate = () => {
    calculate()
    setIsStale(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">GasketOptima 2.0</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <GasketForm />
          <MaterialForm />
        </div>
        <div>
          <QuoteDisplay result={result} isStale={isStale} />
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={handleCalculate} disabled={isCalculating} className={isStale ? "animate-pulse" : ""}>
          {isCalculating ? "Calculating..." : "Calculate"}
        </Button>
      </div>
    </div>
  )
}

export default App
