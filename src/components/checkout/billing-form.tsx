"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const billingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  companyName: z.string().optional(),
  streetAddress: z.string().min(5, "Street address is required"),
  apartment: z.string().optional(),
  townCity: z.string().min(2, "Town/City is required"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  emailAddress: z.string().email("Please enter a valid email address"),
  saveInfo: z.boolean().default(false),
  paymentMethod: z.enum(["bank", "cash"], {
    required_error: "Please select a payment method",
  }),
})

type BillingValues = z.infer<typeof billingSchema>

export default function BillingForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BillingValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      firstName: "",
      companyName: "",
      streetAddress: "",
      apartment: "",
      townCity: "",
      phoneNumber: "",
      emailAddress: "",
      saveInfo: false,
      paymentMethod: "bank",
    },
  })

  async function onSubmit(data: BillingValues) {
    setIsLoading(true)

    try {
      // Add your order submission logic here
      console.log(data)
      // Redirect to order confirmation page
      // window.location.href = "/order-confirmation"
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing Details</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name*</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address*</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apartment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment, floor, etc. (optional)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="townCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Town/City*</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number*</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address*</FormLabel>
                <FormControl>
                  <Input {...field} type="email" disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center gap-2">
                        Bank
                        <div className="flex gap-1">
                          <div className="h-6 w-10 rounded bg-gray-200"></div>
                          <div className="h-6 w-10 rounded bg-gray-200"></div>
                          <div className="h-6 w-10 rounded bg-gray-200"></div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash on delivery</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <div className="flex w-full max-w-md gap-4">
              <input
                type="text"
                placeholder="Coupon Code"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Apply Coupon
              </button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="saveInfo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Save this information for faster check-out next time</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primary text-primary-foreground" disabled={isLoading}>
            Place Order
          </Button>
        </form>
      </Form>
    </div>
  )
}

