import mongoose, { Schema, Document } from 'mongoose'

export interface IPortfolio extends Document {
  title: string
  description: string
  category: string
  tags: string[]
  mediaUrl: string
  thumbnailUrl: string
  cloudinaryPublicId: string
  cloudinaryThumbnailId: string
  mediaType: 'image' | 'video'
  featured: boolean
  published: boolean
  order: number
  clientName?: string
  projectDate?: Date
  createdAt: Date
  updatedAt: Date
}

const PortfolioSchema = new Schema<IPortfolio>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  mediaUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  cloudinaryPublicId: { type: String, required: false },
  cloudinaryThumbnailId: { type: String, default: '' },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  clientName: { type: String },
  projectDate: { type: Date },
}, { timestamps: true })

// Prevent model re-registration in development
export default mongoose.models?.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema)
