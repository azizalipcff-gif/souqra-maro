import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90">
              Last updated: May 2026
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                    <p className="text-gray-600 mb-4">
                      SOUQORA collects information you provide directly to us when you use our platform. This includes:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li><strong>Account Information:</strong> Name, email address, and profile information when you create an account</li>
                      <li><strong>Business Information:</strong> Business name, category, location, phone number, and description when you list your business</li>
                      <li><strong>Usage Data:</strong> Information about how you use our platform, including pages visited and features used</li>
                      <li><strong>Device Information:</strong> IP address, browser type, and device identifiers for security and analytics</li>
                    </ul>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Information</h2>
                    <p className="text-gray-600 mb-4">
                      We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Provide, maintain, and improve our platform</li>
                      <li>Process transactions and send you related information</li>
                      <li>Send you technical notices and support messages</li>
                      <li>Respond to your comments and questions</li>
                      <li>Monitor and analyze trends, usage, and activities</li>
                      <li>Detect, prevent, and address technical issues and fraud</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Data</h2>
                    <p className="text-gray-600 mb-4">
                      When you create an account on SOUQORA, we collect:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Your name and email address (via Google OAuth)</li>
                      <li>Profile information you choose to provide</li>
                      <li>Authentication tokens for secure access</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      Your account data is used to authenticate your access to the platform and provide personalized features. We use Google OAuth for secure authentication and do not store your Google password.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Business Information</h2>
                    <p className="text-gray-600 mb-4">
                      When you list a business on SOUQORA, we collect:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Business name and description</li>
                      <li>Category and location (city)</li>
                      <li>Contact information (phone number)</li>
                      <li>Associated user account</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      Business information is displayed publicly on our platform to help customers find and contact local businesses. You can update or remove your business listing at any time through your account settings.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
                    <p className="text-gray-600 mb-4">
                      SOUQORA uses cookies and similar technologies to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Remember your preferences and settings</li>
                      <li>Authenticate your session</li>
                      <li>Analyze platform usage and performance</li>
                      <li>Provide personalized content and recommendations</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our platform.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                    <p className="text-gray-600 mb-4">
                      We implement appropriate technical and organizational measures to protect your information, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Secure authentication mechanisms</li>
                      <li>Regular security assessments and updates</li>
                      <li>Access controls and authentication requirements</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      Despite our efforts, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
                    <p className="text-gray-600 mb-4">
                      SOUQORA may use third-party services to help operate our platform, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Google OAuth for authentication</li>
                      <li>Supabase for database and authentication services</li>
                      <li>Analytics services to understand platform usage</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      These third parties have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>
                  </section>

                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">8. User Rights</h2>
                    <p className="text-gray-600 mb-4">
                      You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>Access the personal information we hold about you</li>
                      <li>Request correction of inaccurate information</li>
                      <li>Request deletion of your personal information</li>
                      <li>Opt out of marketing communications</li>
                      <li>Object to processing of your personal information</li>
                    </ul>
                    <p className="text-gray-600 mt-4">
                      To exercise these rights, please contact us using the information provided below.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
                    <p className="text-gray-600 mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-2"><strong>Email:</strong> souqoramoroc@gmail.com</p>
                      <p className="text-gray-700 mb-2"><strong>Phone:</strong> +212 6 59 78 54 64</p>
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
