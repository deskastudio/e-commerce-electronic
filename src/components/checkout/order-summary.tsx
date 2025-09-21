// components/checkout/order-summary.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/providers/cart-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { checkoutService } from '@/lib/database/services/checkout-service';

export default function OrderSummary() {
  const { cart, isLoading } = useCart();

  // Calculate additional costs
  const shippingCost = cart.items.length > 0 ? checkoutService.calculateShippingCost({}, cart.items) : 0;
  const tax = checkoutService.calculateTax(cart.total);
  const finalTotal = cart.total + shippingCost + tax;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              {/* Product Image */}
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {/* Quantity Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 text-xs"
                >
                  {item.quantity}
                </Badge>
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium leading-tight">{item.name}</h4>
                  <span className="text-sm font-medium">
                    {checkoutService.formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
                
                {/* Variant Information */}
                {item.variant && (
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {item.variant.color && (
                      <span>Color: {item.variant.color}</span>
                    )}
                    {item.variant.size && (
                      <span>Size: {item.variant.size}</span>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Qty: {item.quantity}</span>
                  <span>{checkoutService.formatCurrency(item.price)} each</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Cost Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({cart.itemCount} items):</span>
            <span>{checkoutService.formatCurrency(cart.total)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Shipping:</span>
            <span>
              {shippingCost === 0 
                ? "Free" 
                : checkoutService.formatCurrency(shippingCost)
              }
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Tax (11% PPN):</span>
            <span>{checkoutService.formatCurrency(tax)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-base font-bold">
          <span>Total:</span>
          <span>{checkoutService.formatCurrency(finalTotal)}</span>
        </div>

        {/* Payment Method Info */}
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>💳</span>
            <span>Bank Transfer</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Payment will be processed after order confirmation
          </p>
        </div>

        {/* Shipping Note */}
        <div className="rounded-lg bg-blue-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
            <span>🚚</span>
            <span>Shipping Information</span>
          </div>
          <p className="mt-1 text-xs text-blue-700">
            Orders are typically processed within 1-2 business days. 
            Shipping time varies by location (3-7 business days).
          </p>
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>🔒</span>
          <span>Your order information is secure and encrypted</span>
        </div>
      </CardContent>
    </Card>
  );
}