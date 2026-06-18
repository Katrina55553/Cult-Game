import type { ReactNode } from 'react'

type Tone = 'jade' | 'gold' | 'cinnabar' | 'mist'
type Size = 'sm' | 'md'

interface Props {
  children: ReactNode
  tone?: Tone
  solid?: boolean
  size?: Size
  className?: string
}

export function Badge({ children, tone = 'gold', solid = false, size = 'md', className = '' }: Props) {
  const sizeClass = size === 'sm' ? 'badge-sm' : 'badge-md'
  const toneClass = solid ? `badge-solid-${tone}` : `badge-${tone}`

  return (
    <span className={`badge ${sizeClass} ${toneClass} ${className}`.trim()}>
      {children}
    </span>
  )
}
