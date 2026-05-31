import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90">
              Last updated: May 2026
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-600 mb-4">
                      By accessing and using SOUQORA, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                    <p className="text-gray-600">
                      SOUQORA is a digital marketplace platform designed to connect local businesses with customers across Morocco. These terms govern your use of our platform and services.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
                    <p className="text-gray-600 mb-4">
                      As a user of SOUQORA, you agree to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Provide accurate and truthful information when creating your account</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Use the platform only for lawful purposes</li>
                      <li>Respect the rights of other users and businesses</li>
                      <li>Not attempt to gain unauthorized access to our systems</li>
                      <li>Not use the platform to distribute malware or engage in fraudulent activities</li>
                    </ul>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Business Listings</h2>
                    <p className="text-gray-600 mb-4">
                      Business owners who list their businesses on SOUQORA agree to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Provide accurate and up-to-date business information</li>
                      <li>Ensure they have the legal right to list the business</li>
                      <li>Maintain the quality of their business listings</li>
                      <li>Respond to customer inquiries in a timely manner</li>
                      <li>Not use the platform to mislead customers</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      SOUQORA reserves the right to review, approve, or reject any business listing at our sole discretion.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content Ownership</h2>
                    <p className="text-gray-600 mb-4">
                      You retain ownership of any content you submit to SOUQORA, including business listings, reviews, and other materials. However, by submitting content, you grant SOUQORA a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on our platform.
                    </p>
                    <p className="text-gray-600">
                      You represent and warrant that you have the right to submit such content and that it does not infringe upon the rights of any third party.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Activities</h2>
                    <p className="text-gray-600 mb-4">
                      You may not use SOUQORA to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>List businesses that are illegal or fraudulent</li>
                      <li>Post false, misleading, or deceptive information</li>
                      <li>Engage in spam or unsolicited communications</li>
                      <li>Violate any applicable laws or regulations</li>
                      <li>Infringe upon the intellectual property rights of others</li>
                      <li>Harass, abuse, or harm other users</li>
                      <li>Attempt to manipulate our platform's ranking or review systems</li>
                    </ul>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Account Suspension</h2>
                    <p className="text-gray-600 mb-4">
                      SOUQORA reserves the right to suspend or terminate your account at any time, with or without notice, for any reason, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Violation of these Terms of Service</li>
                      <li>Violation of applicable laws or regulations</li>
                      <li>Fraudulent or suspicious activity</li>
                      <li>Abuse of our platform or other users</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      Upon termination, your right to use the platform will immediately cease.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                    <p className="text-gray-600 mb-4">
                      SOUQORA shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Your access to or use of or inability to access or use the platform</li>
                      <li>Any conduct or content of any third party on the platform</li>
                      <li>Any content obtained from the platform</li>
                      <li>Unauthorized access to or alterations of your transmissions or data</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      In no event shall SOUQORA's total liability to you for all claims exceed the amount you paid, if any, for using the platform.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
                    <p className="text-gray-600">
                      SOUQORA reserves the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of the platform after such modifications constitutes your acceptance of the new Terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
                    <p className="text-gray-600 mb-4">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-2"><strong>Email:</strong> souqoramoroc@gmail.com</p>
                      <p className="text-gray-700 mb-2"><strong>Phone:</strong> +212 6 59 78 57 64</p>
                      <p className="text-gray-700"><strong>Location:</strong> Berkane, Morocco</p>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
