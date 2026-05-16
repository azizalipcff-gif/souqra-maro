"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  CreditCard, Truck, MapPin, Phone, Lock, ArrowRight, 
  CheckCircle, AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    postalCode: "",
    notes: "",
  })

  const cartItems = [
    {
      id: 1,
      title: "Premium Moroccan Leather Bag",
      price: 1200,
      quantity: 1,
    },
    {
      id: 2,
      title: "Handwoven Berber Rug",
      price: 3500,
      quantity: 1,
    },
    {
      id: 3,
      title: "Argan Oil Set",
      price: 450,
      quantity: 2,
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 2000 ? 0 : 50
  const total = subtotal + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle checkout logic here
    console.log("Checkout:", { ...formData, paymentMethod, total })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+212 6XX XXX XXX"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="street"
                          placeholder="123 Main Street"
                          className="pl-10"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Select
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        >
                          <option value="">Select city</option>
                          <option value="casablanca">Casablanca</option>
                          <option value="marrakech">Marrakech</option>
                          <option value="rabat">Rabat</option>
                          <option value="fes">Fes</option>
                          <option value="tangier">Tangier</option>
                          <option value="agadir">Agadir</option>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions for delivery..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "cod" ? "border-royal-blue bg-royal-blue/5" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-sm text-gray-500">Pay when you receive your order</div>
                      </div>
                      <Badge variant="outline">Popular</Badge>
                    </label>

                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "bank_transfer" ? "border-royal-blue bg-royal-blue/5" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Bank Transfer</div>
                        <div className="text-sm text-gray-500">Transfer directly to our bank account</div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "cash_plus" ? "border-royal-blue bg-royal-blue/5" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cash_plus"
                        checked={paymentMethod === "cash_plus"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Cash Plus</div>
                        <div className="text-sm text-gray-500">Pay using Cash Plus mobile payment</div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "stripe" ? "border-royal-blue bg-royal-blue/5" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="stripe"
                        checked={paymentMethod === "stripe"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">Pay securely with Stripe</div>
                      </div>
                      <Badge variant="success">Secure</Badge>
                    </label>

                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "paypal" ? "border-royal-blue bg-royal-blue/5" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">PayPal</div>
                        <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Lock className="h-5 w-5 text-royal-blue mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Your payment information is secure and encrypted. We never store your payment details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.title} x{item.quantity}
                        </span>
                        <span className="font-medium">{item.price * item.quantity} MAD</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">{subtotal} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? "FREE" : `${shipping} MAD`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-sm text-gray-500">
                        Free shipping on orders over 2000 MAD
                      </p>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-royal-blue">{total} MAD</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Free returns within 30 days of delivery
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    onClick={handleSubmit}
                  >
                    Place Order
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <Link href="/cart">
                    <Button variant="outline" className="w-full">
                      Return to Cart
                    </Button>
                  </Link>

                  <p className="text-xs text-gray-500 text-center">
                    By placing this order, you agree to our{" "}
                    <Link href="/terms" className="text-royal-blue hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-royal-blue hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
