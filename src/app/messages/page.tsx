"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [messageText, setMessageText] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Moroccan Crafts",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      lastMessage: "Thank you for your order! It will be shipped tomorrow.",
      time: "5 min ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "TechFix Morocco",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      lastMessage: "Your repair is complete. You can pick it up anytime.",
      time: "1 hour ago",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Atlas Weavers",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      lastMessage: "Yes, we can customize the rug with your preferred colors.",
      time: "3 hours ago",
      unread: 1,
      online: true,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "other",
      content: "Hello! I'm interested in your leather bag.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      content: "Hi! Yes, it's available. Would you like to see more photos?",
      time: "10:32 AM",
    },
    {
      id: 3,
      sender: "other",
      content: "That would be great. Also, do you offer discounts for bulk orders?",
      time: "10:35 AM",
    },
    {
      id: 4,
      sender: "me",
      content: "Yes, we offer 10% off for orders of 5 or more items.",
      time: "10:38 AM",
    },
    {
      id: 5,
      sender: "other",
      content: "Thank you for your order! It will be shipped tomorrow.",
      time: "10:45 AM",
    },
  ]

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle send message logic
      console.log("Sending message:", messageText)
      setMessageText("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">Messages</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedConversation === conversation.id
                          ? "bg-royal-blue text-white"
                          : "hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar src={conversation.avatar} alt={conversation.name} />
                          {conversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold truncate">{conversation.name}</span>
                            <span className="text-xs">{conversation.time}</span>
                          </div>
                          <p className="text-sm truncate opacity-90">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center text-xs font-bold">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            {selectedConversation ? (
              <Card className="lg:col-span-2 overflow-hidden flex flex-col">
                <CardContent className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={conversations.find(c => c.id === selectedConversation)?.avatar} />
                    <div>
                      <h3 className="font-semibold">
                        {conversations.find(c => c.id === selectedConversation)?.name}
                      </h3>
                      <p className="text-sm text-green-600">Online</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          message.sender === "me"
                            ? "bg-royal-blue text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender === "me" ? "text-white/70" : "text-gray-500"}`}>
                          {message.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <CardContent className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="lg:col-span-2 flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
