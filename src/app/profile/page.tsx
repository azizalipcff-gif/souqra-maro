"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  User, MapPin, Phone, Mail, ShoppingBag, Heart, Settings, 
  Shield, LogOut, Camera, Edit2, CheckCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "Ahmed Benali",
    email: "ahmed@example.com",
    phone: "+212 600 000 000",
    location: "Casablanca",
    bio: "Passionate about Moroccan crafts and supporting local artisans.",
  })

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1200,
      items: 2,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      total: 3500,
      items: 1,
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "processing",
      total: 450,
      items: 3,
    },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Handle save logic here
    console.log("Saving profile:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-32 h-32 border-4 border-gold" />
                      <button className="absolute bottom-0 right-0 p-2 bg-royal-blue text-white rounded-full hover:bg-royal-blue-light transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
                    <p className="text-gray-600 mb-4">{formData.email}</p>
                    <Badge variant="success" className="mb-4">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                      <MapPin className="h-4 w-4" />
                      {formData.location}
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-royal-blue">12</p>
                        <p className="text-xs text-gray-600">Orders</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-royal-blue">5</p>
                        <p className="text-xs text-gray-600">Reviews</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-royal-blue">8</p>
                        <p className="text-xs text-gray-600">Favorites</p>
                      </div>
                    </div>

                    <div className="space-y-2 w-full">
                      <Link href="/orders">
                        <Button variant="outline" className="w-full justify-start">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          My Orders
                        </Button>
                      </Link>
                      <Link href="/favorites">
                        <Button variant="outline" className="w-full justify-start">
                          <Heart className="h-4 w-4 mr-2" />
                          Favorites
                        </Button>
                      </Link>
                      <Link href="/settings">
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Select
                          value={formData.location}
                          onValueChange={(value) => setFormData({ ...formData, location: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="casablanca">Casablanca</SelectItem>
                            <SelectItem value="marrakech">Marrakech</SelectItem>
                            <SelectItem value="rabat">Rabat</SelectItem>
                            <SelectItem value="fes">Fes</SelectItem>
                            <SelectItem value="tangier">Tangier</SelectItem>
                            <SelectItem value="agadir">Agadir</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{formData.location}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Bio</p>
                        <p className="font-medium">{formData.bio}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-gold transition-colors">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-royal-blue">{order.total} MAD</p>
                          <Badge
                            variant={
                              order.status === "delivered" ? "success" :
                              order.status === "shipped" ? "warning" : "secondary"
                            }
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/orders">
                    <Button variant="outline" className="w-full mt-4">
                      View All Orders
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
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
