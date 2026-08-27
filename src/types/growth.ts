export type ValueId = 'ai' | 'integrity' | 'professionalism' | 'value'

export type ValueState = 'idle' | 'selected' | 'bursting' | 'memory' | 'absorbing' | 'completed'

export interface MemoryPhoto {
  id: string
  src: string
  alt: string
  caption: string
}

export interface GrowthValue {
  id: ValueId
  title: string
  subtitle: string
  description: string
  photos: MemoryPhoto[]
  sphereOffset: {
    x: number
    y: number
  }
}

export interface BurstOrigin {
  id: ValueId
  x: number
  y: number
}
