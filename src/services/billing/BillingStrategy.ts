import { Gasket, Material } from "@/store/quoteStore";

export interface BillingStrategy {
  calculate(gaskets: Gasket[], material: Material): number;
}
