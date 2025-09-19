import GasketList from "@/components/GasketList";

interface QuoteDisplayProps {
  result: {
    totalCost: number;
    totalTime: number;
  } | null;
  isStale: boolean;
}

function QuoteDisplay({ result, isStale }: QuoteDisplayProps) {
  return (
    <div className={`p-4 border rounded-md ${isStale ? "opacity-50" : ""}`}>
      <h2 className="text-xl font-bold mb-4">Current Quote</h2>
      <div>
        <h3 className="text-lg font-bold">Gaskets</h3>
        <GasketList />
      </div>
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Results</h3>
          <p>Total Cost: ${result.totalCost.toFixed(2)}</p>
          <p>Total Time: {result.totalTime.toFixed(2)} hours</p>
        </div>
      )}
    </div>
  );
}

export default QuoteDisplay;
