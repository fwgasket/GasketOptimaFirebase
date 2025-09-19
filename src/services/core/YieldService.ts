import { Gasket, Material } from "@/store/quoteStore";

class YieldService {
  calculate(gasket: Gasket, material: Material): number {
    if (material.type === "sheet") {
      if (!material.width || !material.length) {
        return 0;
      }
      const usableWidth = material.width - 2 * material.edgeSpacing;
      const usableHeight = material.length - 2 * material.edgeSpacing;

      if (gasket.shape === "rectangle" && gasket.width && gasket.height) {
        return this.calculateRectangleSheetYield(
          gasket.width,
          gasket.height,
          usableWidth,
          usableHeight,
          material.partSpacing
        );
      }

      if (gasket.shape === "circle" && gasket.diameter) {
        return this.calculateCircleSheetYield(
          gasket.diameter,
          usableWidth,
          usableHeight,
          material.partSpacing
        );
      }
    }
    
    return 0;
  }

  calculateRollLength(gasket: Gasket, material: Material): number {
    if (!material.width) {
        return 0;
    }
    const usableWidth = material.width - 2 * material.edgeSpacing;
    
    if (gasket.shape === "rectangle" && gasket.width && gasket.height) {
        return this.calculateRectangleRollLength(gasket.quantity, gasket.width, gasket.height, usableWidth, material.partSpacing);
    }
    
    if (gasket.shape === "circle" && gasket.diameter) {
        return this.calculateCircleRollLength(gasket.quantity, gasket.diameter, usableWidth, material.partSpacing);
    }
    
    return 0;
  }
  
  private calculateRectangleRollLength(quantity: number, gasketWidth: number, gasketHeight: number, rollWidth: number, partSpacing: number): number {
      const gw = gasketWidth + partSpacing;
      const gh = gasketHeight + partSpacing;
      
      const partsAcrossWidth1 = Math.floor(rollWidth/gw);
      const rows1 = Math.ceil(quantity/partsAcrossWidth1);
      const length1 = rows1 * gh;
      
      const partsAcrossWidth2 = Math.floor(rollWidth/gh);
      const rows2 = Math.ceil(quantity/partsAcrossWidth2);
      const length2 = rows2 * gw;
      
      return Math.min(length1, length2);
  }
  
  private calculateCircleRollLength(quantity: number, gasketDiameter: number, rollWidth: number, partSpacing: number): number {
      const gasketWithSpacing = gasketDiameter + partSpacing;
      
      // Grid Packing
      const partsAcrossWidthGrid = Math.floor(rollWidth/gasketWithSpacing);
      const rowsGrid = Math.ceil(quantity/partsAcrossWidthGrid);
      const lengthGrid = rowsGrid * gasketWithSpacing;
      
      // Triangular Packing
      const partsInFirstRow = Math.floor(rollWidth/gasketWithSpacing);
      const partsInSecondRow = Math.floor((rollWidth - gasketWithSpacing/2)/gasketWithSpacing);
      let lengthTriangular = 0;
      if(partsInFirstRow + partsInSecondRow > 0) {
        const numRows = Math.ceil(quantity / ((partsInFirstRow + partsInSecondRow)/2));
        lengthTriangular = (numRows - 1) * (gasketWithSpacing * Math.sqrt(3)/2) + gasketWithSpacing;
      } else {
        lengthTriangular = Infinity;
      }

      return Math.min(lengthGrid, lengthTriangular);
  }

  private calculateRectangleSheetYield(
    gasketWidth: number,
    gasketHeight: number,
    sheetWidth: number,
    sheetHeight: number,
    partSpacing: number
  ): number {
    const gw = gasketWidth + partSpacing;
    const gh = gasketHeight + partSpacing;

    let maxYield = 0;

    // Test both sheet orientations
    for (const [sW, sH] of [[sheetWidth, sheetHeight], [sheetHeight, sheetWidth]]) {
        // 6 packing strategies
        // 1. Simple row/column
        let currentYield = Math.floor(sW / gw) * Math.floor(sH / gh);
        maxYield = Math.max(maxYield, currentYield);

        // 2. Simple row/column (rotated part)
        currentYield = Math.floor(sW / gh) * Math.floor(sH / gw);
        maxYield = Math.max(maxYield, currentYield);

        // 3. Hybrid 1
        currentYield = this.calculateHybridYield(sW, sH, gw, gh);
        maxYield = Math.max(maxYield, currentYield);
        
        // 4. Hybrid 2 (rotated part)
        currentYield = this.calculateHybridYield(sW, sH, gh, gw);
        maxYield = Math.max(maxYield, currentYield);
        
        // 5. Hybrid 3 (rotated sheet)
        currentYield = this.calculateHybridYield(sH, sW, gw, gh);
        maxYield = Math.max(maxYield, currentYield);

        // 6. Hybrid 4 (rotated part and sheet)
        currentYield = this.calculateHybridYield(sH, sW, gh, gw);
        maxYield = Math.max(maxYield, currentYield);
    }
    
    return maxYield;
  }

  private calculateHybridYield(sheetWidth: number, sheetHeight: number, gasketWidth: number, gasketHeight: number): number {
    const numHorizontal = Math.floor(sheetWidth / gasketWidth);
    const remainingWidth = sheetWidth - numHorizontal * gasketWidth;
    const numVerticalInRemainder = Math.floor(remainingWidth / gasketHeight) * Math.floor(sheetHeight / gasketWidth);
    
    const numVertical = Math.floor(sheetHeight / gasketHeight);
    const remainingHeight = sheetHeight - numVertical * gasketHeight;
    const numHorizontalInRemainder = Math.floor(remainingHeight / gasketHeight) * Math.floor(sheetWidth / gasketWidth);
    
    return (numHorizontal * numVertical) + Math.max(numVerticalInRemainder, numHorizontalInRemainder);
  }

  private calculateCircleSheetYield(
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
    
    const numInFirstRow = Math.floor(sheetWidth / gasketWithSpacing);
    const numInSecondRow = Math.floor((sheetWidth - gasketWithSpacing/2) / gasketWithSpacing);
    const numRows = Math.floor((sheetHeight - gasketWithSpacing) / verticalSpacing) + 1;
    
    let triangularYield2 = 0;
    if (numRows > 0) {
        triangularYield2 = Math.ceil(numRows / 2) * numInFirstRow + Math.floor(numRows / 2) * numInSecondRow;
    }


    return Math.max(gridYield, triangularYield1, triangularYield2);
  }
}

export default new YieldService();
