import { Gasket } from "@/store/quoteStore";

const CUT_SPEED_IPM = 10;
const PIERCE_TIME_PENALTY_MIN = 0.04;

class LaborService {
  calculate(gaskets: Gasket[]): number {
    let totalLinearCutTime = 0;
    let totalPierceTime = 0;

    for (const gasket of gaskets) {
      const { perimeter, piercePoints } = this.getGasketDetails(gasket);
      totalLinearCutTime += (perimeter * gasket.quantity) / CUT_SPEED_IPM;
      totalPierceTime += piercePoints * gasket.quantity * PIERCE_TIME_PENALTY_MIN;
    }

    return (totalLinearCutTime + totalPierceTime) / 60; // Convert to hours
  }

  private getGasketDetails(gasket: Gasket): { perimeter: number; piercePoints: number } {
    let perimeter = 0;
    let piercePoints = 0;

    if (gasket.shape === "rectangle" && gasket.width && gasket.height) {
      perimeter = 2 * (gasket.width + gasket.height);
      piercePoints = 1;
    }

    if (gasket.shape === "circle" && gasket.diameter) {
      perimeter = Math.PI * gasket.diameter;
      piercePoints = 1;

      if (gasket.innerDiameter) {
        perimeter += Math.PI * gasket.innerDiameter;
        piercePoints++;
      }

      if (gasket.boltHoles) {
        // Assuming 0.5" diameter for bolt holes for perimeter calculation
        perimeter += gasket.boltHoles * Math.PI * 0.5;
        piercePoints += gasket.boltHoles;
      }
    }

    return { perimeter, piercePoints };
  }
}

export default new LaborService();
