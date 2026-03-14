# 🎨 Visual Designer Portfolio — Next.js + Cloudinary + MongoDB

A full-stack portfolio website for graphic designers, built with Next.js 14, Cloudinary for media, and MongoDB for data storage.

## ✨ Features

- **Public Portfolio** — Masonry grid of images/videos with category filters & lightbox
- **Admin Dashboard** — Fully protected CMS with:
  - 🎨 Portfolio manager — Upload to Cloudinary, manage items
  - ✏️ Content editor — Edit hero, about, stats, socials
  - ⭐ Testimonials manager
  - ✉️ Messages inbox
  - ⚙️ Site settings
- **Cloudinary CDN** — Images & videos served from CDN, URLs stored in MongoDB
- **No user login** — Only admin access

## 🚀 Setup

### 1. Clone and install
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env.local` and fill in:

```env
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud
NEXTAUTH_SECRET=your_32_char_secret
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourPassword123
```

### 3. Initialize admin account
Visit: `http://localhost:3000/api/admin/seed`

### 4. Run
```bash
npm run dev
```

## 📁 Project Structure
```
src/
├── app/
│   ├── page.tsx              # Portfolio homepage
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard
│   │   └── login/page.tsx    # Admin login
│   └── api/
│       ├── auth/             # NextAuth
│       ├── upload/           # Cloudinary upload
│       ├── contact/          # Contact form
│       ├── portfolio/        # Public portfolio API
│       └── admin/            # Protected admin APIs
├── components/
│   ├── portfolio/            # Public-facing components
│   └── admin/                # Admin dashboard components
├── models/                   # Mongoose models
└── lib/                      # MongoDB, Cloudinary, Auth utils
```

## 🔑 Admin Access
- URL: `/admin/login`
- Default: `admin@portfolio.com` / `Admin@123456`
- Change password in Settings after first login

## 🌐 Deployment
Works on Vercel. Add all environment variables in Vercel dashboard.
