import QuoteOrchestrator from "../services/core/QuoteOrchestrator";

self.onmessage = (event) => {
  const { gaskets, material } = event.data;
  const result = QuoteOrchestrator.calculate(gaskets, material);
  self.postMessage(result);
};
