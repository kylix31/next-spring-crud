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
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { backendPath } from "./helpers/database-path"
import { funcCreateCustomEvent } from "./helpers/function-custom-events"
import validateCPFCNPJ from "./helpers/validates"

type UpdataDataProps = Record<string, any>

const companyCodeSchema = z.string().refine((value) => {
  if (value.length < 14) {
    return false
  }

  const isValid = validateCPFCNPJ(value)

  return isValid
}, "Invalid number")

const formSchema = z.object({
  companyCode: companyCodeSchema,
  phantasyName: z.string().min(4),
  postalCode: z.string().min(9).max(9),
})

export default function CompanyForm({ updateData }: UpdataDataProps) {
  // 1. Define your form.
  //

  console.log(updateData)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyCode: updateData.CompanyCode ?? "",
      phantasyName: updateData.phantasyName ?? "",
      postalCode: updateData.postalCode ?? "",
    },
  })
  const { toast } = useToast()

  const ref = React.useRef<z.infer<typeof formSchema>>(null!)

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    ref.current = values

    const cleanedPostalCode = values.postalCode.replace(/\D/g, "")
    const response = await axios.get(`http://cep.la/${cleanedPostalCode}`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.data) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => onSubmit(ref.current)}
          >
            Try again
          </ToastAction>
        ),
      })

      return
    }

    if (Array.isArray(response.data) && !response.data.length) {
      toast({
        variant: "destructive",
        title: "Oooopss... Invalid CEP",
        description: "Please, put some valid CEP",
      })

      return
    }

    if (updateData && updateData.id) {
      await axios
        .put(`${backendPath()}/companies/${updateData.id}`, values)
        .catch((_) =>
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          })
        )
    } else {
      await axios.post(`${backendPath()}/companies`, values).catch((_) =>
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
      )
    }

    funcCreateCustomEvent("optimisticUiTrigger", { values })
    funcCreateCustomEvent("toggleSheet", {})
  }

  const supplierCodehandleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: any[]) => void
  ) => {
    const { value } = event.target

    let maskedNumber = value

    const cleanedValue = value.replace(/\D/g, "")

    maskedNumber = cleanedValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/,
      (_, group1, group2, group3, group4, group5) =>
        `${group1}.${group2}.${group3}/${group4}-${group5}`
    )

    // Set the masked number in your component state or using setState()
    formOnChange(maskedNumber)
  }

  const supplierPostalCodeOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: any[]) => void
  ) => {
    const { value } = event.target

    let maskedNumber = value

    if (/^\d{8}$/.test(value)) {
      maskedNumber = maskedNumber.replace(
        /(\d{5})(\d{0,3})/,
        (_, group1, group2) => `${group1}-${group2}`
      )
    }

    formOnChange(maskedNumber)
  }

  return (
    <Form {...form}>
      <form className="mt-5 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="phantasyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John" {...field} />
              </FormControl>
              <FormDescription>
                This is the main name of a company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input
                  maxLength={18}
                  type="text"
                  placeholder="999.999.999-10"
                  value={value}
                  onBlur={onBlur}
                  onChange={(event) =>
                    supplierCodehandleChange(event, onChange)
                  }
                />
              </FormControl>
              <FormDescription>
                This is a main document info of a company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field: { onBlur, onChange, value } }) => (
            <FormItem>
              <FormLabel>Postalcode</FormLabel>
              <FormControl>
                <Input
                  maxLength={9}
                  type="text"
                  placeholder="09088-098"
                  onBlur={onBlur}
                  onChange={(event) =>
                    supplierPostalCodeOnChange(event, onChange)
                  }
                  value={value}
                />
              </FormControl>
              <FormDescription>
                This is a main CEP of a company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-5 w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
