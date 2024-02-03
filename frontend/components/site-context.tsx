"use client"

import * as React from "react"

interface ContextProps {
  children: React.ReactNode
}

const SiteContext = React.createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

function SiteProvider({ children }: ContextProps) {
  const state = React.useState(false)

  return <SiteContext.Provider value={state}>{children}</SiteContext.Provider>
}

function useSiteContext() {
  const context = React.useContext(SiteContext)

  if (!context) {
    throw new Error("useSiteContext must be in SiteProvider provider")
  }

  return context
}

export { SiteProvider, useSiteContext }
