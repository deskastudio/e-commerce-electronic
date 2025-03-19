"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Upload } from "lucide-react"

const storeSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  storeEmail: z.string().email("Please enter a valid email address"),
  storePhone: z.string().min(10, "Please enter a valid phone number"),
  storeAddress: z.string().min(5, "Address must be at least 5 characters"),
  storeCity: z.string().min(2, "City must be at least 2 characters"),
  storeState: z.string().min(2, "State must be at least 2 characters"),
  storeZip: z.string().min(5, "ZIP code must be at least 5 characters"),
  storeCountry: z.string().min(2, "Country must be at least 2 characters"),
  storeCurrency: z.string().min(1, "Please select a currency"),
  storeDescription: z.string().optional(),
})

const paymentSchema = z.object({
  enableCreditCard: z.boolean().default(true),
  enablePaypal: z.boolean().default(true),
  enableBankTransfer: z.boolean().default(false),
  enableCashOnDelivery: z.boolean().default(false),
  paypalEmail: z.string().email("Please enter a valid email address").optional(),
  stripePublishableKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
})

const shippingSchema = z.object({
  enableFlatRate: z.boolean().default(true),
  enableFreeShipping: z.boolean().default(true),
  enableLocalPickup: z.boolean().default(false),
  flatRatePrice: z.coerce.number().positive("Price must be positive").optional(),
  freeShippingMinimum: z.coerce.number().positive("Minimum amount must be positive").optional(),
})

type StoreValues = z.infer<typeof storeSchema>
type PaymentValues = z.infer<typeof paymentSchema>
type ShippingValues = z.infer<typeof shippingSchema>

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("store")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const storeForm = useForm<StoreValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeName: "Exclusive",
      storeEmail: "info@exclusive.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress: "123 Main St",
      storeCity: "New York",
      storeState: "NY",
      storeZip: "10001",
      storeCountry: "United States",
      storeCurrency: "USD",
      storeDescription: "Your one-stop shop for electronics and gaming accessories.",
    },
  })

  const paymentForm = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      enableCreditCard: true,
      enablePaypal: true,
      enableBankTransfer: false,
      enableCashOnDelivery: false,
      paypalEmail: "payments@exclusive.com",
      stripePublishableKey: "",
      stripeSecretKey: "",
    },
  })

  const shippingForm = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      enableFlatRate: true,
      enableFreeShipping: true,
      enableLocalPickup: false,
      flatRatePrice: 5.99,
      freeShippingMinimum: 50,
    },
  })

  async function onSubmitStore(data: StoreValues) {
    setIsSubmitting(true)

    try {
      // In a real app, you would submit the data to your API
      console.log(data)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Store settings saved successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to save store settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onSubmitPayment(data: PaymentValues) {
    setIsSubmitting(true)

    try {
      // In a real app, you would submit the data to your API
      console.log(data)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Payment settings saved successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to save payment settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onSubmitShipping(data: ShippingValues) {
    setIsSubmitting(true)

    try {
      // In a real app, you would submit the data to your API
      console.log(data)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Shipping settings saved successfully!")
    } catch (error) {
      console.error(error)
      alert("Failed to save shipping settings")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="store" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Logo</CardTitle>
              <CardDescription>Upload your store logo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-md bg-gray-100">
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xl font-bold text-primary">E</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex cursor-pointer flex-col items-start rounded-md border border-dashed p-4 text-center hover:bg-gray-50">
                    <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload</p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG (max. 800x400px)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Form {...storeForm}>
            <form onSubmit={storeForm.handleSubmit(onSubmitStore)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>Basic information about your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={storeForm.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={storeForm.control}
                      name="storeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={storeForm.control}
                      name="storePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={storeForm.control}
                    name="storeDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Description</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Address</CardTitle>
                  <CardDescription>Physical address of your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={storeForm.control}
                    name="storeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={storeForm.control}
                      name="storeCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={storeForm.control}
                      name="storeState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={storeForm.control}
                      name="storeZip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP/Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={storeForm.control}
                      name="storeCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Configure payment methods for your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={paymentForm.control}
                    name="enableCreditCard"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Credit Card</FormLabel>
                          <FormDescription>Accept credit card payments via Stripe</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {paymentForm.watch("enableCreditCard") && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={paymentForm.control}
                        name="stripePublishableKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stripe Publishable Key</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="stripeSecretKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stripe Secret Key</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={paymentForm.control}
                    name="enablePaypal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">PayPal</FormLabel>
                          <FormDescription>Accept payments via PayPal</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {paymentForm.watch("enablePaypal") && (
                    <FormField
                      control={paymentForm.control}
                      name="paypalEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PayPal Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={paymentForm.control}
                    name="enableBankTransfer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Bank Transfer</FormLabel>
                          <FormDescription>Accept payments via bank transfer</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={paymentForm.control}
                    name="enableCashOnDelivery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Cash on Delivery</FormLabel>
                          <FormDescription>Accept cash on delivery</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Form {...shippingForm}>
            <form onSubmit={shippingForm.handleSubmit(onSubmitShipping)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Methods</CardTitle>
                  <CardDescription>Configure shipping methods for your store</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={shippingForm.control}
                    name="enableFlatRate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Flat Rate</FormLabel>
                          <FormDescription>Charge a fixed rate for shipping</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {shippingForm.watch("enableFlatRate") && (
                    <FormField
                      control={shippingForm.control}
                      name="flatRatePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flat Rate Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                              <Input type="number" placeholder="0.00" className="pl-7" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={shippingForm.control}
                    name="enableFreeShipping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Free Shipping</FormLabel>
                          <FormDescription>Offer free shipping above a minimum order amount</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {shippingForm.watch("enableFreeShipping") && (
                    <FormField
                      control={shippingForm.control}
                      name="freeShippingMinimum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Order Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                              <Input type="number" placeholder="0.00" className="pl-7" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={shippingForm.control}
                    name="enableLocalPickup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Local Pickup</FormLabel>
                          <FormDescription>Allow customers to pick up orders from your store</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

