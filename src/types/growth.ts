export type ValueId = 'droplet1' | 'droplet2' | 'droplet3' | 'droplet4'

export type ValueState = 'idle' | 'selected' | 'bursting' | 'memory' | 'absorbing' | 'completed'
export type ArchiveModalVariant = 'heatmap' | 'slider'

export interface MemoryPhoto {
  id: string
  src: string
  alt: string
  caption: string
}

export interface GrowthValue {
  id: ValueId
  title: string
  archiveLabel: string
  modalVariant: ArchiveModalVariant
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
