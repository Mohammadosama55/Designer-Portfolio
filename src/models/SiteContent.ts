import mongoose, { Schema, Document } from 'mongoose'

export interface ISiteContent extends Document {
  section: string
  data: Record<string, unknown>
  updatedAt: Date
}

const SiteContentSchema = new Schema<ISiteContent>({
  section: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true })

// Prevent model re-registration in development
export default mongoose.models?.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema)
