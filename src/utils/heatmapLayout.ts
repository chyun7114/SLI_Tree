export interface HeatmapRectangle {
  index: number
  x: number
  y: number
  width: number
  height: number
}

interface LayoutMetrics {
  ratio: number
  count: number
  minimumArea: number
  squaredAreas: number
}

type LayoutNode = LayoutMetrics & (
  | { kind: 'photo'; index: number }
  | { kind: 'split'; axis: 'x' | 'y'; first: LayoutNode; second: LayoutNode }
)

function combine(first: LayoutNode, second: LayoutNode, axis: 'x' | 'y'): LayoutNode {
  const ratioSum = first.ratio + second.ratio
  const firstShare = axis === 'x' ? first.ratio / ratioSum : second.ratio / ratioSum
  const secondShare = 1 - firstShare
  return {
    kind: 'split',
    axis,
    first,
    second,
    ratio: axis === 'x' ? ratioSum : first.ratio * second.ratio / ratioSum,
    count: first.count + second.count,
    minimumArea: Math.min(first.minimumArea * firstShare, second.minimumArea * secondShare),
    squaredAreas: first.squaredAreas * firstShare ** 2 + second.squaredAreas * secondShare ** 2,
  }
}

// Keep several different compositions, rather than committing to uniform rows.
// Area balance prevents a close ratio match from producing tiny photo slivers.
function retainCandidates(candidates: LayoutNode[], targetRatio: number): LayoutNode[] {
  const anchors = [0.2, 0.3, 0.45, 0.67, 1, 1.5, 2.25, 3.4, 5, 7.5, targetRatio * 0.8, targetRatio, targetRatio * 1.2]
  const retained = new Set<LayoutNode>()
  for (const anchor of anchors) {
    let best = candidates[0]!
    let bestScore = Infinity
    for (const candidate of candidates) {
      const balance = candidate.squaredAreas * candidate.count - 1
      const score = Math.abs(Math.log(candidate.ratio / anchor)) + balance * 0.005
      if (score < bestScore) {
        best = candidate
        bestScore = score
      }
    }
    retained.add(best)
  }
  return [...retained]
}

/** Partition the actual viewport, with no overlaps, gaps, or offscreen tiles. */
export function createHeatmapLayout(ratios: number[], width: number, height: number): HeatmapRectangle[] {
  if (ratios.length === 0 || width <= 0 || height <= 0) return []

  const targetRatio = width / height
  const table = Array.from({ length: ratios.length }, () => new Map<number, LayoutNode[]>())
  for (let index = 0; index < ratios.length; index++) {
    table[index]!.set(index + 1, [{
      kind: 'photo',
      index,
      ratio: ratios[index]!,
      count: 1,
      minimumArea: 1,
      squaredAreas: 1,
    }])
  }

  let finalists: LayoutNode[] = table[0]!.get(1)!
  for (let count = 2; count <= ratios.length; count++) {
    for (let start = 0; start + count <= ratios.length; start++) {
      const end = start + count
      const byRatio = new Map<number, LayoutNode>()
      let fallback: LayoutNode | undefined
      for (let split = start + 1; split < end; split++) {
        for (const first of table[start]!.get(split)!) {
          for (const second of table[split]!.get(end)!) {
            for (const axis of ['x', 'y'] as const) {
              const candidate = combine(first, second, axis)
              fallback ??= candidate
              if (candidate.minimumArea < 1 / (count * 6)) continue
              const key = Math.round(Math.log(candidate.ratio) * 2000)
              const previous = byRatio.get(key)
              if (!previous || candidate.squaredAreas < previous.squaredAreas) byRatio.set(key, candidate)
            }
          }
        }
      }
      const candidates = byRatio.size > 0 ? [...byRatio.values()] : [fallback!]
      table[start]!.set(end, retainCandidates(candidates, targetRatio))
      if (count === ratios.length) finalists = candidates
    }
  }

  const best = finalists.reduce((closest, candidate) => {
    const score = (node: LayoutNode) => Math.abs(Math.log(node.ratio / targetRatio))
      + (node.squaredAreas * node.count - 1) * 0.0001
    return score(candidate) < score(closest) ? candidate : closest
  })
  const rectangles: HeatmapRectangle[] = []

  function place(node: LayoutNode, x: number, y: number, rectWidth: number, rectHeight: number) {
    if (node.kind === 'photo') {
      rectangles.push({ index: node.index, x, y, width: rectWidth, height: rectHeight })
      return
    }
    const ratioSum = node.first.ratio + node.second.ratio
    if (node.axis === 'x') {
      const firstWidth = rectWidth * node.first.ratio / ratioSum
      place(node.first, x, y, firstWidth, rectHeight)
      place(node.second, x + firstWidth, y, rectWidth - firstWidth, rectHeight)
    } else {
      const firstHeight = rectHeight * node.second.ratio / ratioSum
      place(node.first, x, y, rectWidth, firstHeight)
      place(node.second, x, y + firstHeight, rectWidth, rectHeight - firstHeight)
    }
  }

  // Only the final fit may slightly adjust the requested aspect ratios.
  // Shared split coordinates guarantee that the fixed viewport is fully tiled.
  place(best, 0, 0, 100, 100)
  return rectangles.sort((first, second) => first.index - second.index)
}
