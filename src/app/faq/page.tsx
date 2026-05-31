"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "What is SOUQORA?",
    answer: "SOUQORA is Morocco's premier digital marketplace platform designed to connect local businesses with customers across the country. Our mission is to digitize the Moroccan marketplace by providing a modern, accessible platform that helps local businesses thrive and customers find the services they need."
  },
  {
    question: "How do I add my business?",
    answer: "Adding your business to SOUQORA is simple and free. First, create an account by logging in with Google. Then navigate to your profile page and click the 'Add Your Business' button. Fill in your business details including name, category, city, phone number, and description. Your business will be submitted for review and approval."
  },
  {
    question: "Is adding a business free?",
    answer: "Yes! Adding your business to SOUQORA is completely free. We believe in supporting local businesses by providing an accessible platform without any upfront costs. There are no hidden fees or charges for listing your business."
  },
  {
    question: "How can I edit my business?",
    answer: "To edit your business information, log in to your account and navigate to your profile. From there, you can access your business listings and make updates to your business details, including name, description, contact information, and more."
  },
  {
    question: "How long does approval take?",
    answer: "Business approval typically takes 1-2 business days. Our team reviews each submission to ensure quality and accuracy. You will receive a notification once your business has been approved and is live on the platform."
  },
  {
    question: "How do customers contact me?",
    answer: "Customers can contact you directly through the phone number listed on your business page. Your contact information is displayed prominently on your business listing, making it easy for potential customers to reach out to you."
  },
  {
    question: "How do I create an account?",
    answer: "Creating an account on SOUQORA is quick and easy. Simply click the 'Login' button and sign in with your Google account. We use Google OAuth for secure and convenient authentication. Once logged in, you can access all features including adding your business and managing your profile."
  },
  {
    question: "Is SOUQORA available across Morocco?",
    answer: "Yes! SOUQORA is available across all of Morocco. We support businesses and customers in major cities including Casablanca, Rabat, Tangier, Marrakech, Agadir, Fes, and many more. Our goal is to connect businesses and customers throughout the entire country."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90">
              Find answers to common questions about SOUQORA
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="mb-4 border-2 border-gray-100 hover:border-blue-300 transition-colors"
              >
                <CardContent className="p-6">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-white/90 mb-8">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <a href="/contact">
              <Button 
                size="lg" 
                variant="default" 
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
