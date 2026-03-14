import mongoose, { Schema, Document } from 'mongoose'

export interface ITestimonial extends Document {
  name: string
  role: string
  company: string
  text: string
  rating: number
  avatarUrl?: string
  approved: boolean
  featured: boolean
  createdAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  text: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  avatarUrl: { type: String },
  approved: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

// Prevent model re-registration in development
export default mongoose.models?.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)
