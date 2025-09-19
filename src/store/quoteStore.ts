import { create } from 'zustand'

export interface Gasket {
  id: number
  quantity: number
  shape: "rectangle" | "circle"
  width?: number
  height?: number
  diameter?: number
  innerDiameter?: number
  boltHoles?: number
}

export interface Material {
  name: string
  type: "sheet" | "roll"
  length?: number
  width?: number
  cost: number
  edgeSpacing: number
  partSpacing: number
  stocked: boolean
}

interface QuoteState {
  gaskets: Gasket[]
  material: Material
  addGasket: (gasket: Omit<Gasket, "id">) => void
  updateMaterial: (material: Material) => void
}

const useQuoteStore = create<QuoteState>((set) => ({
  gaskets: [],
  material: {
    name: "Default Material",
    type: "sheet",
    width: 36,
    length: 36,
    cost: 1000,
    edgeSpacing: 0.5,
    partSpacing: 0.25,
    stocked: true,
  },
  addGasket: (gasket) =>
    set((state) => ({
      gaskets: [...state.gaskets, { ...gasket, id: Date.now() }],
    })),
  updateMaterial: (material) => set({ material }),
}))

export default useQuoteStore
