"use client"

import { SWRConfig } from "swr"

import { Company } from "@/app/[type]/company-columns"
import { Supply } from "@/app/[type]/supplies-columns"

interface WithSWRPRops {
  children: React.ReactNode
  data: Company[] | Supply[]
}

export function WithSWR({ children, data }: WithSWRPRops) {
  return <SWRConfig value={{ fallback: data }}>{children}</SWRConfig>
}
