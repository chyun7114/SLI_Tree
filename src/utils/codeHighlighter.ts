import type { CodeToken } from '../types/intro'

function getTokenClass(value: string) {
  if (value.startsWith('//')) return 'syntax-comment'
  if (value.startsWith("'") || value.startsWith('"') || value.startsWith('`')) return 'syntax-string'
  if (value.startsWith('<') || value === '>' || value === '/>') return 'syntax-tag'
  if (/^\d+$/.test(value)) return 'syntax-number'
  if (value.startsWith('✓')) return 'syntax-success'
  if (/^[A-Z][A-Za-z0-9_]*$/.test(value)) return 'syntax-component'
  return 'syntax-keyword'
}

export function tokenizeCodeLine(line: string): CodeToken[] {
  if (line.startsWith('✓')) {
    return [{ text: line, className: 'syntax-success' }]
  }

  const tokenPattern =
    /\/\/.*$|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|<\/?[\w.-]+|\/?>|\b(import|from|const|export|return|interface|type|defineProps|Array|length|template|script|setup|lang|v-for|v-if|key|class|aria-label|loading|src|alt|new|ref)\b|\b[A-Z][A-Za-z0-9_]*\b|\b\d+\b/g

  const tokens: CodeToken[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = tokenPattern.exec(line)) !== null) {
    if (match.index > cursor) {
      tokens.push({ text: line.slice(cursor, match.index) })
    }

    tokens.push({ text: match[0], className: getTokenClass(match[0]) })
    cursor = match.index + match[0].length
  }

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor) })
  }

  return tokens.length > 0 ? tokens : [{ text: '' }]
}
