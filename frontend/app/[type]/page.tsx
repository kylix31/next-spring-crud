import { DataTable } from "@/components/data-table"
import { backendPath } from "@/components/helpers/database-path"
import { WithSWR } from "@/components/with-swr"

import { Company, companyColumns } from "./company-columns"
import { Supply, suppliesColumns } from "./supplies-columns"

type Type = "companies" | "supplies"

interface DemoPageProps {
  params: { type: Type }
}

async function getData(type: Type): Promise<Supply[] | Company[]> {
  const res = await fetch(`${backendPath()}/${type}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function DemoPage({ params: { type } }: DemoPageProps) {
  const data = await getData(type)

  const isSupplies = type === "supplies"

  const currentFilterName = isSupplies
    ? "Filter by name"
    : "Filter by phantasy name"

  const currentFilterBy = isSupplies ? "name" : "phantasyName"

  return (
    <div className="container mx-auto py-10">
      <WithSWR data={data}>
        <DataTable filterName={currentFilterName} filterBy={currentFilterBy} />
      </WithSWR>
    </div>
  )
}
