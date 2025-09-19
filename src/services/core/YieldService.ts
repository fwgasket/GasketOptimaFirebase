import { Gasket, Material } from "@/store/quoteStore";

class YieldService {
  calculate(gasket: Gasket, material: Material): number {
    if (!material.width || !material.length) {
      return 0;
    }

    const usableWidth = material.width - 2 * material.edgeSpacing;
    const usableHeight = material.length - 2 * material.edgeSpacing;

    if (gasket.shape === "rectangle" && gasket.width && gasket.height) {
      return this.calculateRectangleYield(gasket.width, gasket.height, usableWidth, usableHeight, material.partSpacing);
    }

    if (gasket.shape === "circle" && gasket.diameter) {
      return this.calculateCircleYield(gasket.diameter, usableWidth, usableHeight, material.partSpacing);
    }

    return 0;
  }

  private calculateRectangleYield(
    gasketWidth: number,
    gasketHeight: number,
    sheetWidth: number,
    sheetHeight: number,
    partSpacing: number
  ): number {
    const gasketWithSpacingWidth = gasketWidth + partSpacing;
    const gasketWithSpacingHeight = gasketHeight + partSpacing;

    const orientations = [
      { w: gasketWithSpacingWidth, h: gasketWithSpacingHeight },
      { w: gasketWithSpacingHeight, h: gasketWithSpacingWidth },
    ];

    let maxYield = 0;

    for (const { w, h } of orientations) {
        const yield1 = Math.floor(sheetWidth / w) * Math.floor(sheetHeight / h);
        const yield2 = Math.floor(sheetWidth / h) * Math.floor(sheetHeight / w);
        maxYield = Math.max(maxYield, yield1, yield2);
    }
    
    return maxYield;
  }

  private calculateCircleYield(
    gasketDiameter: number,
    sheetWidth: number,
    sheetHeight: number,
    partSpacing: number
  ): number {
    const gasketWithSpacing = gasketDiameter + partSpacing;

    // Grid Packing
    const gridYield =
      Math.floor(sheetWidth / gasketWithSpacing) *
      Math.floor(sheetHeight / gasketWithSpacing);

    // Triangular (Hexagonal) Packing
    const verticalSpacing = gasketWithSpacing * (Math.sqrt(3) / 2);
    const triangularYield1 =
      Math.floor(sheetWidth / gasketWithSpacing) *
      Math.floor((sheetHeight - gasketWithSpacing) / verticalSpacing + 1);
    
    const triangularYield2 =
        Math.floor(sheetHeight / gasketWithSpacing) *
        Math.floor((sheetWidth - gasketWithSpacing) / verticalSpacing + 1);

    return Math.max(gridYield, triangularYield1, triangularYield2);
  }
}

export default new YieldService();
