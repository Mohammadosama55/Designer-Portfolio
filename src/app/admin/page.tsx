import { connectDB } from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'
import Testimonial from '@/models/Testimonial'
import Message from '@/models/Message'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

async function getStats() {
  try {
    await connectDB()
    const [portfolioCount, testimonialCount, messageCount, unreadCount] = await Promise.all([
      Portfolio.countDocuments({}),
      Testimonial.countDocuments({ approved: true }),
      Message.countDocuments({}),
      Message.countDocuments({ read: false }),
    ])
    return { portfolioCount, testimonialCount, messageCount, unreadCount }
  } catch {
    return { portfolioCount: 0, testimonialCount: 0, messageCount: 0, unreadCount: 0 }
  }
}

export default async function AdminPage() {
  const stats = await getStats()
  return <AdminDashboard stats={stats} />
}
