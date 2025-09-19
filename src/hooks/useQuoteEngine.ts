import { useState, useEffect, useCallback } from "react";
import useQuoteStore from "@/store/quoteStore";
import { Gasket, Material } from "@/store/quoteStore";

export function useQuoteEngine() {
  const { gaskets, material } = useQuoteStore();
  const [result, setResult] = useState<{ totalCost: number; totalTime: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const newWorker = new Worker(new URL("../workers/calculation.worker.ts", import.meta.url), {
      type: "module",
    });
    setWorker(newWorker);

    newWorker.onmessage = (event) => {
      setResult(event.data);
      setIsCalculating(false);
    };

    return () => {
      newWorker.terminate();
    };
  }, []);

  const calculate = useCallback(() => {
    if (worker) {
      setIsCalculating(true);
      worker.postMessage({ gaskets, material });
    }
  }, [worker, gaskets, material]);

  return { result, isCalculating, calculate };
}
