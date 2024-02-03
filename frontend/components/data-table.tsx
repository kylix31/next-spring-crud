"use client"

import * as React from "react"
import { useParams, useSearchParams } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetcher } from "@/components/helpers/fetcher"
import LoadingSkeleton from "@/components/loading-sekeleton"
import { companyColumns } from "@/app/[type]/company-columns"
import { Supply, suppliesColumns } from "@/app/[type]/supplies-columns"

import CompanyForm from "./companies-form"
import { backendPath } from "./helpers/database-path"
import { useCustomEventTrigger } from "./hooks/event-listener"
import { useIsCompany } from "./hooks/use-is-company"
import SelectRelation from "./select-relation"
import SupplierForm from "./supplies-form"
import { useToast } from "./ui/use-toast"

interface DataTableProps {
  filterName: string
  filterBy: string
}

export function DataTable({ filterName, filterBy }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [shouldOpenSheet, setShouldOpenSheet] = React.useState(false)
  const [shouldOpenRelated, setShouldOpenRelated] = React.useState(false)
  const [currentDataId, setCurrentDataId] = React.useState(0)
  const [updateData, setUpdateData] = React.useState({})

  const isCompany = useIsCompany()
  const params = useParams()
  const searchParams = useSearchParams()
  const currentParamsName = React.useMemo(
    () => searchParams.get("name"),
    [searchParams]
  )

  const { toast } = useToast()

  const defaultPath = backendPath()

  const columns = React.useMemo(() => {
    if (params.related && params.type === "companies") {
      return suppliesColumns(params?.id, params?.type, params?.related)
    }

    if (params.related && params.type === "supplies") {
      return companyColumns(params?.id, params?.type, params?.related)
    }

    if (params.type === "companies") {
      return companyColumns(params?.id, params?.type, params?.related)
    }

    return suppliesColumns(params?.id, params?.type, params?.related)
  }, [params?.id, params.related, params.type])

  const { data, mutate, isLoading } = useSWR(
    params.related
      ? `${defaultPath}/${params.type}/${params.id}/${params.related}`
      : `${defaultPath}/${params.type}`,
    fetcher
  )
  const {
    data: relationData,
    // mutate: relationMutate,
    isLoading: relationIsLoading,
  } = useSWR(`${defaultPath}/${isCompany ? "supplies" : "companies"}`, fetcher)

  useCustomEventTrigger("related", (event) => {
    setShouldOpenRelated(true)
    setCurrentDataId(event.id)
  })

  useCustomEventTrigger("update", (event) => {
    setShouldOpenSheet(true)
    setUpdateData({ ...event })
  })

  useCustomEventTrigger("toggleSheetRelated", () => {
    setShouldOpenRelated((prev) => !prev)
  })

  useCustomEventTrigger("toggleSheet", () => {
    setShouldOpenSheet((prev) => !prev)
  })

  useCustomEventTrigger("optimisticUiTrigger", (event) => {
    mutate([...data, event.values], {
      // optimisticData: [...data, event],
      // rollbackOnError: true,
      // populateCache: true,
      // revalidate: false,
    }).catch((e) => console.error(e))
  })

  useCustomEventTrigger("relativeError", () => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "Did you removed the relative ones?",
    })
  })

  useCustomEventTrigger("delete", (event) => {
    const filterdData = data.filter((d: any) => d.id !== event.id)

    mutate(filterdData, {
      optimisticData: filterdData,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    }).catch((e) => console.error(e))
  })

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<Supply, unknown>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div>
      {params.related ? (
        <h1 className="text-xl font-bold uppercase">{`${currentParamsName} ${params.type} related to ${params.related}`}</h1>
      ) : (
        <h1 className="text-xl font-bold uppercase">
          {isCompany ? "add your company" : "add your supplier"}
        </h1>
      )}

      <div className=" flex items-center py-4">
        <div className="flex w-2/3 flex-wrap gap-3 md:flex-nowrap">
          <Input
            placeholder={
              isCompany ? "Filter by phantasy name" : "Filter by name"
            }
            value={
              (table
                .getColumn(isCompany ? "phantasyName" : "name")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(isCompany ? "phantasyName" : "name")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder={isCompany ? "Filter by CNPJ" : "Filter by CPF/CNPJ"}
            value={
              (table
                .getColumn(isCompany ? "companyCode" : "supplierCode")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(isCompany ? "companyCode" : "supplierCode")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {!params.related && (
          <Button
            variant="default"
            size="sm"
            onClick={() => setShouldOpenSheet(true)}
          >
            Add
          </Button>
        )}

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      <Sheet
        open={shouldOpenSheet}
        onOpenChange={(bool) => setShouldOpenSheet(bool)}
      >
        <SheetContent position="right" size="content">
          <SheetHeader>
            <SheetTitle>Add {isCompany ? "company" : "supplier"}</SheetTitle>
            <SheetDescription>
              Add a new {isCompany ? "company" : "supplier"} . Click on submit
              to save.
            </SheetDescription>
          </SheetHeader>
          {isCompany ? (
            <CompanyForm updateData={updateData} />
          ) : (
            <SupplierForm updateData={updateData} />
          )}
        </SheetContent>
      </Sheet>
      <Sheet
        open={shouldOpenRelated}
        onOpenChange={(bool) => setShouldOpenRelated(bool)}
      >
        <SheetContent position="right" size="content">
          <SheetHeader>
            <SheetTitle>Add relation for the supply</SheetTitle>
            <SheetDescription>
              Add a new supplier. Click on submit to save.
            </SheetDescription>
          </SheetHeader>
          <SelectRelation
            dataId={currentDataId}
            relationData={relationData}
            isLoading={relationIsLoading}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
