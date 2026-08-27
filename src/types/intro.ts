export type IntroStage = 'idle' | 'typing' | 'ready' | 'coding' | 'completed' | 'transition'

export interface CodingSequence {
  file: string
  code: string
}

export interface CodeToken {
  text: string
  className?: string
}
