import mongoose, { Schema, Document } from 'mongoose'

export interface IAdmin extends Document {
  email: string
  password: string
  createdAt: Date
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Prevent model re-registration in development
export default mongoose.models?.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)
