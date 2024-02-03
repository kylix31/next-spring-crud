"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { backendPath } from "@/components/helpers/database-path"
import {
  funcCreateCustomEvent,
  funcTriggerCustomEvent,
} from "@/components/helpers/function-custom-events"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Company = {
  id: string
  companyCode: number
  phantasyName: string
  postalCode: string
}

export function companyColumns(
  id?: string,
  type?: string,
  related?: string
): ColumnDef<Company>[] {
  const isRelatedSection = Boolean(related && type && id)

  const defaultPath = backendPath()

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "companyCode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            CompanyCode
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "phantasyName",
      header: "PhantasyName",
      // header: () => <div className="text-right">PhantasyName</div>,
      // cell: ({ row }) => {
      //   const amount = parseFloat(row.getValue("amount"))
      //   const formatted = new Intl.NumberFormat("en-US", {
      //     style: "currency",
      //     currency: "USD",
      //   }).format(amount)
      //
      //   return <div className="text-right font-medium">{formatted}</div>
      // },
    },
    {
      accessorKey: "postalCode",
      header: "PostalCode",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const currentRow = row.original

        const handleDelete = () => {
          axios
            .delete(
              isRelatedSection
                ? `${backendPath()}/companies/${currentRow.id}/supplies/${id}`
                : `${backendPath()}/companies/${currentRow.id}`
            )
            .catch((err) => console.error(err))

          funcCreateCustomEvent("delete", { id: currentRow.id })
        }

        const handleUpdate = () => {
          axios
            .put(
              isRelatedSection
                ? `${backendPath()}/supplies/${currentRow.id}`
                : `${backendPath()}/companies/${currentRow.id}`
            )
            .catch(() => funcTriggerCustomEvent("relativeError"))

          funcCreateCustomEvent("update", {
            id: currentRow.id,
            CompanyCode: currentRow.companyCode,
            phantasyName: currentRow.phantasyName,
            postalCode: currentRow.postalCode,
          })
        }

        const handleAddRelated = () =>
          funcCreateCustomEvent("related", { id: currentRow.id })

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isRelatedSection ? (
                <DropdownMenuItem onClick={handleDelete}>
                  Delete company
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuLabel>Relations</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/companies/${currentRow.id}/supplies?name=${currentRow.phantasyName}`}
                    >
                      See all related suppliers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleUpdate}>
                    Update company
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete}>
                    Delete company
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddRelated}>
                    Add supplier
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
