import mongoose, { Schema } from 'mongoose';

// ─── ADMIN USER ───────────────────────────────────────────────────────────────
const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

export const Admin = mongoose.models?.Admin || mongoose.model('Admin', AdminSchema);

// ─── PORTFOLIO ITEM (Image or Video) ──────────────────────────────────────────
const PortfolioSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  mediaUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: false },
  thumbnailUrl: { type: String, default: '' },  // for videos
  cloudinaryThumbnailId: { type: String, default: '' },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  clientName: { type: String },
  projectDate: { type: Date },
}, { timestamps: true });

export const Portfolio = mongoose.models?.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────
const SiteSettingsSchema = new Schema({
  key: { type: String, unique: true, required: true },
  value: { type: Schema.Types.Mixed },
}, { timestamps: true });

export const SiteSettings = mongoose.models?.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
const HeroSchema = new Schema({
  name: { type: String, default: 'Your Name' },
  tagline: { type: String, default: 'Visual Storyteller' },
  subtitle: { type: String, default: 'I craft stunning visuals & motion' },
  description: { type: String, default: 'Award-winning graphic designer specializing in brand identity, motion graphics, and cinematic video production.' },
  profileImageUrl: { type: String, default: '' },
  profileImagePublicId: { type: String, default: '' },
  showreel: { type: String, default: '' }, // Cloudinary video URL for showreel
  showreelPublicId: { type: String, default: '' },
  ctaPrimary: { type: String, default: 'View Work' },
  ctaSecondary: { type: String, default: 'Let\'s Talk' },
  availableForWork: { type: Boolean, default: true },
  stats: [{
    value: { type: String },
    label: { type: String },
  }],
  socials: {
    instagram: { type: String, default: '' },
    behance: { type: String, default: '' },
    dribbble: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    vimeo: { type: String, default: '' },
  },
}, { timestamps: true });

export const Hero = mongoose.models?.Hero || mongoose.model('Hero', HeroSchema);

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
const AboutSchema = new Schema({
  bio: { type: String, default: 'A passionate visual designer...' },
  bio2: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  skills: [{ name: String, level: Number }], // level 0-100
  tools: [{ name: String, iconUrl: String }],
  experience: { type: String, default: '5+' },
  projects: { type: String, default: '200+' },
  clients: { type: String, default: '50+' },
}, { timestamps: true });

export const About = mongoose.models?.About || mongoose.model('About', AboutSchema);

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🎨' },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

export const Service = mongoose.models?.Service || mongoose.model('Service', ServiceSchema);

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  text: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  avatarUrl: { type: String, default: '' },
  approved: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const Testimonial = mongoose.models?.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
const MessageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
}, { timestamps: true });

export const Message = mongoose.models?.Message || mongoose.model('Message', MessageSchema);

// ─── CONTACT INFO ─────────────────────────────────────────────────────────────
const ContactInfoSchema = new Schema({
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  availability: { type: String, default: 'Available for freelance' },
}, { timestamps: true });

export const ContactInfo = mongoose.models?.ContactInfo || mongoose.model('ContactInfo', ContactInfoSchema);
