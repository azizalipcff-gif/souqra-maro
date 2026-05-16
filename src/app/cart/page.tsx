"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Premium Moroccan Leather Bag",
      price: 1200,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200",
      seller: "Moroccan Crafts",
    },
    {
      id: 2,
      title: "Handwoven Berber Rug",
      price: 3500,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=200",
      seller: "Atlas Weavers",
    },
    {
      id: 3,
      title: "Argan Oil Set",
      price: 450,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200",
      seller: "Beauty Morocco",
    },
  ])

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shipping = subtotal > 2000 ? 0 : 50
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length})</h1>

          {cartItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                <Link href="/marketplace">
                  <Button size="lg">
                    Browse Marketplace
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-500">by {item.seller}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-semibold">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xl font-bold text-royal-blue">
                                {item.price * item.quantity} MAD
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-royal-blue">{total} MAD</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Payment Methods</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Cash on Delivery</Badge>
                        <Badge variant="outline">Bank Transfer</Badge>
                        <Badge variant="outline">Cash Plus</Badge>
                        <Badge variant="outline">Stripe</Badge>
                        <Badge variant="outline">PayPal</Badge>
                      </div>
                    </div>

                    <Link href="/checkout" className="block">
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>

                    <Link href="/marketplace">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
