import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSupabase } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Star, Share2, Heart, Edit2 } from "lucide-react"
import BusinessActions from "./business-actions"

interface BusinessPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { data: business } = await getSupabase()
    .from('businesses')
    .select('*')
    .eq('slug', params.slug)
    .eq('approved', true)
    .eq('status', 'active')
    .single()

  if (!business) {
    return {
      title: 'Business Not Found',
    }
  }

  return {
    title: `${business.name} | SOUQORA`,
    description: business.short_description,
    keywords: `${business.category}, ${business.city}, ${business.name}, Morocco, business, services`,
    openGraph: {
      title: business.name,
      description: business.short_description,
      type: 'website',
    },
  }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  // Fetch business data with related information
  const { data: business, error } = await getSupabase()
    .from('businesses')
    .select(`
      *,
      business_images (
        image_type,
        image_url,
        order_index
      ),
      business_services (
        name,
        description,
        price,
        order_index
      ),
      business_tags (
        tag
      ),
      business_hours (
        day,
        open_time,
        close_time,
        is_closed
      )
    `)
    .eq('slug', params.slug)
    .eq('approved', true)
    .eq('status', 'active')
    .single()

  if (error || !business) {
    notFound()
  }

  // Increment view count
  await getSupabase()
    .from('businesses')
    .update({ views: (business.views || 0) + 1 })
    .eq('id', business.id)

  const logoImage = business.business_images?.find((img: any) => img.image_type === 'logo')
  const coverImage = business.business_images?.find((img: any) => img.image_type === 'cover')
  const galleryImages = business.business_images?.filter((img: any) => img.image_type === 'gallery') || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Cover Image */}
        {coverImage && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={coverImage.image_url}
              alt={`${business.name} cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {logoImage && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-lg">
                      <img
                        src={logoImage.image_url}
                        alt={`${business.name} logo`}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{business.category}</Badge>
                          {business.verified && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <BusinessActions businessId={business.id} userId={business.user_id} />
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{business.short_description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{business.rating || 'N/A'}</span>
                      </div>
                      <span>•</span>
                      <span>{business.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Full Description */}
            {business.full_description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <p className="text-gray-600 whitespace-pre-line">{business.full_description}</p>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {business.business_services && business.business_services.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Services</h2>
                  <div className="space-y-4">
                    {business.business_services.map((service: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{service.name}</h3>
                          {service.price && (
                            <Badge variant="secondary">{service.price}</Badge>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-gray-600">{service.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image: any, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image.image_url}
                          alt={`${business.name} gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Contact</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-royal-blue" />
                    <div>
                      <p className="font-semibold">{business.city}</p>
                      {business.neighborhood && <p className="text-sm text-gray-600">{business.neighborhood}</p>}
                      {business.address && <p className="text-sm text-gray-600">{business.address}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-royal-blue" />
                    <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                      {business.phone}
                    </a>
                  </div>
                  {business.whatsapp && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`} className="text-green-600 hover:underline">
                        WhatsApp
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-royal-blue" />
                    <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                      {business.email}
                    </a>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  {business.whatsapp && (
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            {business.business_hours && business.business_hours.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Business Hours</h2>
                  <div className="space-y-2">
                    {business.business_hours.map((hours: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium">{hours.day}</span>
                        {hours.is_closed ? (
                          <span className="text-red-600">Closed</span>
                        ) : (
                          <span className="text-gray-600">
                            {hours.open_time} - {hours.close_time}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media */}
            {(business.website || business.instagram || business.facebook) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Follow Us</h2>
                  <div className="space-y-3">
                    {business.website && (
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                        Website
                      </a>
                    )}
                    {business.instagram && (
                      <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="block text-pink-600 hover:underline">
                        Instagram
                      </a>
                    )}
                    {business.facebook && (
                      <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="block text-blue-800 hover:underline">
                        Facebook
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {business.business_tags && business.business_tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {business.business_tags.map((tag: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag.tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
