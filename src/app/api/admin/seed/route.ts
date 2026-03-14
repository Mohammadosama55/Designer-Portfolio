import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import SiteContent from '@/models/SiteContent'

export async function GET() {
  await connectDB()
  const existing = await Admin.findOne({})
  if (existing) return NextResponse.json({ message: 'Already seeded' })

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12)
  await Admin.create({ email: process.env.ADMIN_EMAIL || 'admin@portfolio.com', password: hashed })

  const defaults = [
    {
      section: 'hero',
      data: {
        name: 'Alex Rivera',
        title: 'Visual Designer & Motion Artist',
        tagline: 'Crafting stories through visuals',
        description: 'I create compelling brand identities, motion graphics, and visual experiences that leave a lasting impression.',
        availableForWork: true,
        showreel: '',
        stats: [
          { value: '120+', label: 'Projects Done' },
          { value: '40+', label: 'Happy Clients' },
          { value: '5+', label: 'Years Exp.' },
        ],
        socials: { instagram: '', behance: '', dribbble: '', linkedin: '' },
      },
    },
    {
      section: 'about',
      data: {
        bio: "I'm a passionate graphic designer and motion artist with a love for bold aesthetics and purposeful design.",
        skills: ['Adobe Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Figma', 'Cinema 4D'],
        experience: '5+ Years',
        location: 'Mumbai, India',
        email: 'hello@alexrivera.design',
        resumeUrl: '',
      },
    },
    {
      section: 'settings',
      data: {
        siteTitle: 'Alex Rivera — Visual Designer',
        metaDescription: 'Portfolio of Alex Rivera, graphic designer and motion artist.',
        showTestimonials: true,
        showContact: true,
        logoText: 'AR',
      },
    },
  ]

  for (const d of defaults) {
    await SiteContent.findOneAndUpdate({ section: d.section }, d, { upsert: true })
  }

  return NextResponse.json({ message: 'Seeded successfully' })
}
