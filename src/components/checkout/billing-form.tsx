// components/checkout/billing-form.tsx - FIXED SESSION ID ISSUE
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Building,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Edit3,
  Shield
} from 'lucide-react';
import { ShippingAddress, CheckoutData } from '@/types/checkout';
import { checkoutService } from '@/lib/database/services/checkout-service';
import { PricingService } from '@/lib/database/services/pricing-service';

const INDONESIAN_PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
  'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta',
  'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat'
];

export default function BillingForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isEditingAutoFill, setIsEditingAutoFill] = useState(false);
  
  const [pricingData, setPricingData] = useState({
    subtotal: 0,
    shippingCost: 0,
    tax: 0,
    total: 0
  });
  
  // Form state
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    company: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Indonesia',
    phone: '',
    email: ''
  });
  
  const [notes, setNotes] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  // FIXED: Enhanced session ID management
  const [sessionId] = useState(() => {
    // Ensure session ID is available immediately
    const ensuredSessionId = checkoutService.ensureSessionId();
    console.log('🆔 Session ID ensured:', ensuredSessionId);
    return ensuredSessionId;
  });

  // Debug session state on component mount
  useEffect(() => {
    checkoutService.debugSessionState();
  }, []);

  // Auto-fill form data from user session
  useEffect(() => {
    const autoFillUserData = async () => {
      if (session?.user && !isAutoFilled) {
        console.log('👤 Auto-filling form with user data...');
        
        try {
          const fullName = session.user.name || '';
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          const autoFillData: Partial<ShippingAddress> = {
            firstName,
            lastName,
            email: session.user.email || '',
            phone: (session.user as any).phone || '',
          };

          setFormData(prev => ({
            ...prev,
            ...autoFillData
          }));

          setIsAutoFilled(true);
          console.log('✅ Form auto-filled with user data:', autoFillData);
          
        } catch (error) {
          console.warn('Failed to auto-fill user data:', error);
        }
      }
    };

    autoFillUserData();
  }, [session, isAutoFilled]);

  // Calculate pricing when form data or cart changes
  useEffect(() => {
    const calculatePricing = () => {
      let items = cart.items;
      if (items.length === 0) {
        // Use sample data for demonstration
        items = [{
          productId: 'sample-1',
          name: 'Sample Product',
          price: 150000,
          quantity: 1
        }];
      }

      const calculatedPricing = PricingService.calculateOrderTotals(items, formData);
      setPricingData(calculatedPricing);
      
      console.log('💰 Frontend pricing calculated:', calculatedPricing);
    };

    calculatePricing();
  }, [cart, formData.city, formData.state]);

  // Form validation
  useEffect(() => {
    const validation = checkoutService.validateShippingAddress(formData);
    const isValid = validation.isValid && agreeToTerms;
    setIsFormValid(isValid);
  }, [formData, agreeToTerms]);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const validation = checkoutService.validateShippingAddress(formData);
    
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        if (error.includes('first name')) newErrors.firstName = error;
        else if (error.includes('last name')) newErrors.lastName = error;
        else if (error.includes('street address')) newErrors.streetAddress = error;
        else if (error.includes('city')) newErrors.city = error;
        else if (error.includes('state')) newErrors.state = error;
        else if (error.includes('postal code')) newErrors.postalCode = error;
        else if (error.includes('phone')) newErrors.phone = error;
        else if (error.includes('email')) newErrors.email = error;
      });
      setErrors(newErrors);
      return false;
    }

    if (!agreeToTerms) {
      setErrors(prev => ({
        ...prev,
        terms: 'You must agree to the terms and conditions'
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🛒 ===============================================');
    console.log('🛒 FORM SUBMISSION - Enhanced Debug');
    console.log('🛒 ===============================================');
    
    // FIXED: Enhanced pre-submission validation
    if (!sessionId) {
      console.error('❌ No session ID available!');
      setErrors({ submit: 'Session ID not available. Please refresh the page and try again.' });
      return;
    }

    console.log('🔑 Session ID confirmed:', sessionId);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed:', errors);
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // FIXED: Include calculated pricing in checkout data
      const checkoutData: CheckoutData = {
        shippingAddress: formData,
        paymentMethod: 'bank_transfer',
        notes: notes.trim(),
        calculatedPricing: pricingData // FIXED: Include frontend pricing
      };

      console.log('📤 Submitting enhanced checkout data:', {
        isLoggedIn: !!session?.user,
        userId: session?.user?.id,
        sessionId: sessionId,
        saveAddress: saveAddress && !!session?.user,
        checkoutData,
        hasCalculatedPricing: !!checkoutData.calculatedPricing
      });

      // FIXED: Ensure session ID is fresh before submission
      const currentSessionId = checkoutService.ensureSessionId();
      console.log('🔄 Final session ID check:', currentSessionId);

      const response = await checkoutService.processCheckout(checkoutData);

      if (response.success && response.data) {
        console.log('✅ Checkout successful:', response.data);
        
        if (session?.user && saveAddress) {
          try {
            console.log('💾 Address would be saved for future use');
          } catch (saveError) {
            console.warn('Failed to save address:', saveError);
          }
        }
        
        setShowSuccess(true);
        
        if (cart.items.length > 0) {
          await clearCart();
        }
        
        setTimeout(() => {
          const redirectUrl = session?.user 
            ? `/orders/${response.data!.id}`
            : `/orders/${response.data!.id}?sessionId=${currentSessionId}`;
          router.push(redirectUrl);
        }, 2000);
      } else {
        console.error('❌ Checkout failed:', response.error);
        setErrors({ submit: response.error || 'Failed to process checkout' });
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      setErrors({ 
        submit: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    } finally {
      setIsLoading(false);
      console.log('🛒 ===============================================');
    }
  };

  if (showSuccess) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order placed successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            {session?.user 
              ? "You can track your order in your account dashboard."
              : "We've sent order details to your email. Save the order link to track your order."
            }
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Redirecting to order details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* FIXED: Enhanced Session Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-sm text-orange-900">🔧 Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>User Status:</strong> {session?.user ? 'Logged In' : 'Guest'}</p>
                <p><strong>Session ID:</strong> <code className="bg-orange-100 px-1 rounded">{sessionId}</code></p>
                <p><strong>Session ID Length:</strong> {sessionId?.length || 0}</p>
                <p><strong>Form Valid:</strong> {isFormValid ? '✅' : '❌'}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <p className="font-medium text-blue-900">Pricing Data:</p>
                <p>Subtotal: {PricingService.formatCurrency(pricingData.subtotal)}</p>
                <p>Shipping: {PricingService.formatCurrency(pricingData.shippingCost)}</p>
                <p>Tax: {PricingService.formatCurrency(pricingData.tax)}</p>
                <p className="font-bold">Total: {PricingService.formatCurrency(pricingData.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Authentication Status & Auto-fill */}
      {session?.user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Logged in as {session.user.name}</p>
                  <p className="text-sm text-green-700">{session.user.email}</p>
                </div>
              </div>
              {isAutoFilled && !isEditingAutoFill && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingAutoFill(true)}
                  className="gap-2"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit Info
                </Button>
              )}
            </div>

            {isAutoFilled && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                <CheckCircle className="h-4 w-4" />
                <span>Form auto-filled with your account information</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact & Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Contact & Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-red-500' : ''}
                placeholder="Enter your first name"
                disabled={isAutoFilled && !isEditingAutoFill}
                required
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? 'border-red-500' : ''}
                placeholder="Enter your last name"
                disabled={isAutoFilled && !isEditingAutoFill}
                required
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="Enter your email address"
              disabled={isAutoFilled && !isEditingAutoFill}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="08123456789 or +6281234567890"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={errors.phone ? 'border-red-500' : ''}
              disabled={isAutoFilled && !isEditingAutoFill}
              required
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: 08XXXXXXXXX or +628XXXXXXXXX
            </p>
          </div>

          {/* Company (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              Company Name (Optional)
            </Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address *</Label>
            <Input
              id="streetAddress"
              type="text"
              placeholder="House number and street name"
              value={formData.streetAddress}
              onChange={(e) => handleInputChange('streetAddress', e.target.value)}
              className={errors.streetAddress ? 'border-red-500' : ''}
              required
            />
            {errors.streetAddress && (
              <p className="text-sm text-red-500">{errors.streetAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartment">Apartment, suite, unit, etc. (Optional)</Label>
            <Input
              id="apartment"
              type="text"
              placeholder="Apartment, suite, unit, building, floor, etc."
              value={formData.apartment}
              onChange={(e) => handleInputChange('apartment', e.target.value)}
            />
          </div>

          {/* City, State, Postal Code */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
                required
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Province *</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {INDONESIAN_PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="12345"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className={errors.postalCode ? 'border-red-500' : ''}
                maxLength={5}
                pattern="[0-9]{5}"
                required
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500">{errors.postalCode}</p>
              )}
            </div>
          </div>

          {/* Save Address Option (for logged-in users) */}
          {session?.user && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Checkbox
                id="saveAddress"
                checked={saveAddress}
                onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
              />
              <Label htmlFor="saveAddress" className="text-sm text-blue-900">
                💾 Save this address for future orders
              </Label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Special instructions for delivery, gift message, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {notes.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 bg-blue-50">
            <div className="flex items-center space-x-2 mb-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Bank Transfer</span>
              <Badge variant="secondary" className="ml-auto">Only Available</Badge>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Transfer payment directly to our bank account. Your order will be processed after payment confirmation.
            </p>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <p className="font-medium text-blue-900 mb-2">Bank Account Details:</p>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Bank:</strong> BCA (Bank Central Asia)</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Account Name:</strong> Your Store Name</p>
                <p><strong>Branch:</strong> Jakarta Pusat</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please use your order number as payment reference and upload payment proof after checkout.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{PricingService.formatCurrency(pricingData.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping:</span>
            <span>
              {pricingData.shippingCost === 0 
                ? <Badge variant="secondary" className="text-xs">Free</Badge>
                : PricingService.formatCurrency(pricingData.shippingCost)
              }
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (11% PPN):</span>
            <span>{PricingService.formatCurrency(pricingData.tax)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">
                {PricingService.formatCurrency(pricingData.total)}
              </span>
            </div>
          </div>
          
          {/* Shipping Info */}
          {formData.city && formData.state && (
            <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
              📍 Shipping calculated for {formData.city}, {formData.state}
              {pricingData.shippingCost === 0 && (
                <div className="text-green-600 font-medium mt-1">
                  🎉 You qualify for free shipping!
                </div>
              )}
            </div>
          )}
          
          {cart.items.length === 0 && (
            <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              ⚠️ Note: Using sample data (cart is empty)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className={errors.terms ? 'border-red-500' : ''}
          />
          <Label htmlFor="terms" className="text-sm leading-6">
            I have read and agree to the{' '}
            <a href="/terms" className="text-primary underline hover:text-primary/80" target="_blank">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary underline hover:text-primary/80" target="_blank">
              Privacy Policy
            </a>{' '}
            *
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-500">{errors.terms}</p>
        )}
      </div>

      {/* Error Messages */}
      {errors.submit && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errors.submit}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || !isFormValid || !sessionId}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Order...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {session?.user ? 'Place Order' : 'Place Order (Guest)'} ({PricingService.formatCurrency(pricingData.total)})
            </>
          )}
        </Button>

        {/* Form Status Indicators */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className={`flex items-center gap-1 ${session?.user ? 'text-green-600' : 'text-orange-600'}`}>
            {session?.user ? <CheckCircle className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {session?.user ? 'Logged In' : 'Guest'}
          </div>
          <div className={`flex items-center gap-1 ${sessionId ? 'text-green-600' : 'text-red-600'}`}>
            {sessionId ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            Session {sessionId ? 'Ready' : 'Missing'}
          </div>
          <div className={`flex items-center gap-1 ${isFormValid ? 'text-green-600' : 'text-yellow-600'}`}>
            {isFormValid ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            Form {isFormValid ? 'Complete' : 'Incomplete'}
          </div>
          <div className={`flex items-center gap-1 ${agreeToTerms ? 'text-green-600' : 'text-red-600'}`}>
            {agreeToTerms ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            Terms
          </div>
        </div>
      </div>

      {/* Security & Benefits Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-1">🔒 Secure Checkout</p>
              <p className="text-gray-600">
                Your information is encrypted and secure. 
                {session?.user && " Your address can be saved for faster future checkouts."}
              </p>
            </div>
          </div>
        </div>

        {!session?.user && (
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">👤 Create Account</p>
                <p className="text-blue-700">
                  <a href="/auth/register" className="underline hover:text-blue-800">
                    Sign up
                  </a> for faster checkouts, order tracking, and exclusive offers.
                </p>
              </div>
            </div>
          </div>
        )}

        {session?.user && (
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-green-900 mb-1">✨ Member Benefits</p>
                <p className="text-green-700">
                  Enjoy order tracking, faster checkouts, and exclusive member offers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}