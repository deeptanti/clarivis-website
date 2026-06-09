'use client'
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface CalcContextValue {
  primaryValue: number
  setPrimaryValue: (n: number) => void
}

const CalcContext = createContext<CalcContextValue | null>(null)

export function CalcProvider({
  children,
  defaultValue,
}: {
  children: ReactNode
  defaultValue: number
}) {
  const [primaryValue, setPrimaryValue] = useState(defaultValue)
  return (
    <CalcContext.Provider value={{ primaryValue, setPrimaryValue }}>
      {children}
    </CalcContext.Provider>
  )
}

export function useCalcContext(): CalcContextValue | null {
  return useContext(CalcContext)
}
