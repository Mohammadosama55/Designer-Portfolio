import { connectDB } from '@/lib/mongodb'
import SiteContent from '@/models/SiteContent'
import { Portfolio } from '@/models'
import Testimonial from '@/models/Testimonial'
import { Navbar } from '@/components/portfolio/Navbar'
import { HeroSection } from '@/components/portfolio/HeroSection'
import { PortfolioSection } from '@/components/portfolio/PortfolioSection'
import { AboutSection } from '@/components/portfolio/AboutSection'
import { TestimonialsSection } from '@/components/portfolio/TestimonialsSection'
import { ContactSection } from '@/components/portfolio/ContactSection'
import { Footer } from '@/components/portfolio/Footer'

// Disable caching - ensures new content from MongoDB appears immediately
export const revalidate = 0

async function getSiteData() {
  try {
    await connectDB()
    console.log('[Home Page] Connecting to MongoDB...')
    
    const [heroDoc, aboutDoc, settingsDoc, portfolioItems, testimonials] = await Promise.all([
      SiteContent.findOne({ section: 'hero' }),
      SiteContent.findOne({ section: 'about' }),
      SiteContent.findOne({ section: 'settings' }),
      Portfolio.find({}).sort({ order: 1, createdAt: -1 }).limit(20),
      Testimonial.find({ approved: true }).sort({ createdAt: -1 }).limit(10),
    ])
    
    console.log('[Home Page] Raw portfolio query result:', portfolioItems)
    console.log('[Home Page] Number of items:', portfolioItems?.length || 0)
    
    console.log('[Home Page] Data fetched successfully:')
    console.log(`  - Portfolio items: ${portfolioItems.length}`)
    console.log(`  - Testimonials: ${testimonials.length}`)
    
    // Log portfolio items for debugging
    if (portfolioItems.length === 0) {
      console.warn('[Home Page] Warning: No published portfolio items found. Check:')
      console.warn('  1. Items have published: true in the database')
      console.warn('  2. MONGODB_URI is correctly configured')
      console.warn('  3. Database connection is working')
    } else {
      portfolioItems.forEach((item: any, index: number) => {
        console.log(`  Portfolio [${index}]: ${item.title} (published: ${item.published}, category: ${item.category})`)
      })
    }
    
    return {
      hero: heroDoc?.data || {},
      about: aboutDoc?.data || {},
      settings: settingsDoc?.data || {},
      // Convert Mongoose documents to plain objects for JSON serialization
      portfolio: JSON.parse(JSON.stringify(portfolioItems)),
      testimonials: JSON.parse(JSON.stringify(testimonials)),
    }
  } catch (error) {
    console.error('[Home Page] Error fetching site data:', error)
    if (error instanceof Error) {
      console.error('[Home Page] Error details:', error.message)
      console.error('[Home Page] Stack trace:', error.stack)
    }
    // Return empty data instead of crashing
    return {
      hero: {},
      about: {},
      settings: {},
      portfolio: [],
      testimonials: [],
    }
  }
}

export default async function Home() {
  console.log('=== Home page loading ===')
  const data = await getSiteData()
  console.log('=== Final data for Home page ===', {
    portfolioCount: data.portfolio.length,
    portfolioItems: data.portfolio.map((p: any) => ({ id: p._id, title: p.title, published: p.published }))
  })

  return (
    <main className="relative">
      <Navbar settings={data.settings} />
      <HeroSection hero={data.hero} />
      <PortfolioSection items={data.portfolio} />
      <AboutSection about={data.about} />
      {data.settings.showTestimonials !== false && (
        <TestimonialsSection testimonials={data.testimonials} />
      )}
      {data.settings.showContact !== false && (
        <ContactSection about={data.about} />
      )}
      <Footer settings={data.settings} about={data.about} />
    </main>
  )
}



