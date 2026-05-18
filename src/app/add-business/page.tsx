import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import BusinessForm from "@/components/BusinessForm"

// Force dynamic rendering to avoid build-time environment variable issues
export const dynamic = 'force-dynamic'

// Server component to check authentication
export default async function AddBusinessPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?next=/add-business")
  }

  // Get user ID from session
  const userId = session.user.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <BusinessForm userId={userId} />
      </div>
      <Footer />
    </div>
  )
}
