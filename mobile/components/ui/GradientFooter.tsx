import { LinearGradient } from 'expo-linear-gradient'
import { ReactNode } from 'react'

interface GradientFooterProps {
  children?: ReactNode
  className?: string
}

export function GradientFooter({ children, className = '' }: GradientFooterProps) {
  return (
    <LinearGradient
      className={`absolute bottom-0 w-full h-[120px] pointer-events-none justify-end pb-[24px] ${className}`}
      colors={['rgba(17,18,23,0)', 'rgba(17,18,23,0.95)', '#111217', '#111217']}
      locations={[0, 0.2, 0.7, 1]}
    >
      {children}
    </LinearGradient>
  )
}
