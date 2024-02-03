"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Company } from "@/app/[type]/company-columns"
import { Supply } from "@/app/[type]/supplies-columns"

import { backendPath } from "./helpers/database-path"
import { funcTriggerCustomEvent } from "./helpers/function-custom-events"
import { useIsCompany } from "./hooks/use-is-company"

interface SelectRelationProps<T extends Company[] | Supply[]> {
  relationData: T
  dataId: number
  isLoading: boolean
}

const FormSchema = z.object({
  id: z.string({
    required_error: "Please select a company to save.",
  }),
})

export default function SelectRelation<T extends Company[] | Supply[]>({
  relationData,
  isLoading,
  dataId,
}: SelectRelationProps<T>) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const isCompany = useIsCompany()

  const { toast } = useToast()

  const isCompanyObj = (data: any): data is Company =>
    typeof data === "object" && "phantasyName" in data

  const onSubmit = (value: z.infer<typeof FormSchema>) => {
    axios
      .post(
        `${backendPath()}/companies/${isCompany ? dataId : value.id}/supplies/${
          isCompany ? value.id : dataId
        }`
      )
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
      )

    funcTriggerCustomEvent("toggleSheetRelated")
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel />
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue className="m-4" placeholder="Select a name" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {relationData.map((data) => {
                    if (isCompanyObj(data)) {
                      return (
                        <SelectItem key={data.id} value={data.id.toString()}>
                          {data.phantasyName}
                        </SelectItem>
                      )
                    }

                    return (
                      <SelectItem key={data.id} value={data.id.toString()}>
                        {data.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <FormDescription>
                You can select a valid name to add
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
