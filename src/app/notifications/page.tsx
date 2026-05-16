"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Check, X, ShoppingBag, MessageCircle, Star, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Order Shipped",
      message: "Your order #ORD-001 has been shipped and will arrive in 2-3 days.",
      type: "order" as const,
      time: "5 minutes ago",
      read: false,
      icon: ShoppingBag,
    },
    {
      id: 2,
      title: "New Message",
      message: "Moroccan Crafts sent you a message about your order.",
      type: "message" as const,
      time: "1 hour ago",
      read: false,
      icon: MessageCircle,
    },
    {
      id: 3,
      title: "Review Received",
      message: "A customer left a 5-star review on your product.",
      type: "review" as const,
      time: "3 hours ago",
      read: true,
      icon: Star,
    },
    {
      id: 4,
      title: "System Alert",
      message: "Your store verification is pending approval.",
      type: "system" as const,
      time: "1 day ago",
      read: true,
      icon: AlertTriangle,
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((n) => n.id !== id)
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`hover:shadow-lg transition-shadow ${
                    !notification.read ? "border-l-4 border-l-gold" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          !notification.read
                            ? "bg-royal-blue text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <notification.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{notification.title}</h3>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                          </div>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              notification.type === "order"
                                ? "default"
                                : notification.type === "message"
                                ? "gold"
                                : notification.type === "review"
                                ? "success"
                                : "warning"
                            }
                            className="text-xs"
                          >
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {notifications.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">No notifications</h2>
                <p className="text-gray-600">
                  You're all caught up! We'll notify you when something important happens.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
