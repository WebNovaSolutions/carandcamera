# OneRentals — Premium Luxury Car & Cinema Camera Rental Platform

A modern, high-performance, responsive Car Rental and Camera Rental website with an intuitive Admin Dashboard.

Engineered with a **No-Traditional-Database Architecture**: all content is stored in **GitHub JSON files**, committed via the **GitHub REST API** through **Vercel Serverless Functions**, online image links (Unsplash, Imgur, CDN, etc.) for zero third-party media overhead, and client reservations managed exclusively via **WhatsApp click-to-chat** with dynamic pre-filled messages.

---

## 🚀 Key Architectural Highlights

- **Zero Traditional Database**: Eliminates the operational overhead and monthly cost of MongoDB, PostgreSQL, or Firestore.
- **GitHub JSON Content Storage**: `public/data/*.json` serves as the primary dataset (`cars.json`, `cameras.json`, `services.json`, `website.json`, `contact.json`, `navigation.json`).
- **Online Image Links**: Add high-definition online image URLs directly from Unsplash, Imgur, or any image CDN for cars and cameras with instant live previews and primary cover selection.
- **Serverless API Layer**: Secure Vercel Serverless Functions (`/api/admin/save-content`, `/api/auth/*`) manage GitHub commits without exposing tokens to frontend JavaScript.
- **WhatsApp Booking Desk**: Dynamic click-to-chat generator producing formatted, pre-filled rental requests with date calculations and pricing estimates.
- **Dynamic Content Refresh**: Runtime JSON fetching with cache revalidation so updates made in the Admin Dashboard reflect on the customer website without triggering full Vercel rebuilds.
- **Premium Dark UI**: Built with Tailwind CSS, Framer Motion animations, glassmorphism, glowing amber and electric blue accents, and responsive layout across desktop, tablet, and mobile.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, React Router DOM v6, Framer Motion, Lucide React, React Hook Form, React Hot Toast |
| **Backend / API** | Vercel Serverless Functions (Node.js runtime), JWT session authentication, bcryptjs, native Fetch API |
| **Storage & Sync** | GitHub REST API v3, JSON datasets (`public/data/`) |
| **Media Links** | Direct Online Image URLs (Unsplash, Imgur, CDN, any web URL) |
| **Communications** | WhatsApp Business Click-to-Chat (`https://wa.me/`) |
| **Hosting** | Vercel, GitHub |

---

## 📋 What You Need Now (Configuration Checklist)

Cloudinary has been completely removed. You do **NOT** need any Cloudinary account or API keys.

To run the project in full production with GitHub auto-commits, you only need:

1. **`GITHUB_TOKEN`**: A GitHub Personal Access Token (classic with `repo` scope or fine-grained with `Contents: Read and write`).
2. **`GITHUB_OWNER`**: Your GitHub username or organization (e.g. `yourname`).
3. **`GITHUB_REPO`**: The name of your GitHub repository (e.g. `onerentals`).
4. **`GITHUB_BRANCH`**: Default branch name (usually `main`).
5. **`ADMIN_PASSWORD`**: Your chosen password to log into `/admin` (defaults to `admin123` in dev).
6. **`SESSION_SECRET`**: A 32+ character random secret string used to sign secure HttpOnly cookies.

*(In local development mode without GitHub tokens, the dashboard safely saves directly to `public/data/*.json` on your local disk!)*

---

## 📁 Project Structure

```
├── api/                        # Vercel Serverless Functions
│   ├── _utils/
│   │   └── auth.js             # Session JWT signing and cookie management
│   ├── admin/
│   │   └── save-content.js     # Validates session & commits JSON to GitHub
│   └── auth/
│       ├── login.js            # Admin password verification & cookie issuance
│       ├── logout.js           # Session termination
│       └── me.js               # Session status check
├── public/
│   ├── data/                   # Primary JSON data storage
│   │   ├── cars.json           # Luxury fleet catalogue & specifications
│   │   ├── cameras.json        # Cinema cameras, lenses, lighting kits
│   │   ├── services.json       # Chauffeur, self-drive, and crew packages
│   │   ├── website.json        # Hero, About, Why Choose Us, Testimonials
│   │   ├── contact.json        # WhatsApp number, address, social links
│   │   └── navigation.json     # Header links and footer columns
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── BookingModal.jsx    # WhatsApp booking dialog & price calculator
│   │   ├── CarCard.jsx         # Luxury vehicle display card
│   │   ├── CameraCard.jsx      # Cinema equipment display card
│   │   ├── Footer.jsx          # Dynamic multi-column footer
│   │   ├── ImageUploader.jsx   # Online image link manager & live previewer
│   │   ├── Navbar.jsx          # Sticky glassmorphic navbar with mobile menu
│   │   ├── ScrollToTop.jsx
│   │   ├── SectionHeader.jsx
│   │   └── SEO.jsx             # Dynamic meta tags & page titles
│   ├── context/
│   │   ├── AuthContext.jsx     # Admin authentication state provider
│   │   └── DataContext.jsx     # Global runtime data & update handler
│   ├── layouts/
│   │   ├── AdminLayout.jsx     # SaaS-style responsive admin layout
│   │   └── MainLayout.jsx      # Public customer website wrapper
│   ├── pages/
│   │   ├── Home.jsx            # Hero, categories, featured gear, reviews
│   │   ├── Cars.jsx            # Vehicle directory with filters & sorting
│   │   ├── CarDetails.jsx      # Gallery, tech specs, booking CTA
│   │   ├── Cameras.jsx         # Cinema equipment directory
│   │   ├── CameraDetails.jsx   # Gear specifications, included kit items
│   │   ├── Services.jsx        # Production packages & rates
│   │   ├── About.jsx           # Mission, brand story, quality standards
│   │   ├── Contact.jsx         # WhatsApp desk, address, Google Maps
│   │   ├── NotFound.jsx        # 404 handler
│   │   └── admin/
│   │       ├── Login.jsx       # Admin login screen
│   │       ├── Dashboard.jsx   # Overview statistics calculated from JSON
│   │       ├── ManageCars.jsx  # Add/edit/delete cars, specs, image URLs
│   │       ├── ManageCameras.jsx # Add/edit/delete cameras, image URLs
│   │       ├── ManageServices.jsx# Service packages & pricing
│   │       ├── ManageWebsite.jsx # Copywriting, hero, testimonials
│   │       ├── ManageNavigation.jsx # Header & footer link editor
│   │       └── ManageContact.jsx # WhatsApp number & social profiles
│   ├── services/
│   │   ├── api.js              # Fetching and serverless communication
│   │   └── whatsapp.js         # WhatsApp link generator & message formatter
│   ├── styles/
│   │   └── index.css           # Tailwind base, utilities & glassmorphism
│   ├── utils/
│   │   └── formatters.js       # Currency (₹), date, and duration utilities
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── vercel.json                 # SPA rewrites & cache control headers
└── package.json
```

---

## ⚡ Quick Start & Local Development

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/onerentals.git
cd onerentals
npm install
```

### 2. Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default credentials:
- **Admin Password**: `admin123`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser:
- Customer Website: `http://localhost:5173/`
- Admin Dashboard: `http://localhost:5173/admin` (Password: `admin123`)

---

## 🖼️ How to Add Online Images for Cars and Cameras

1. Navigate to **Admin Dashboard > Manage Cars** or **Manage Cameras**.
2. Click **Add New Vehicle** or **Add New Equipment** (or click Edit on an existing item).
3. In the **Online Image Links** section:
   - Paste any image link from Unsplash, Imgur, Pexels, or your own CDN into the input field.
   - An instant visual verification preview appears.
   - Click **Add Image Link**.
4. You can add up to 6 gallery links per item.
5. Click **Set Primary** on any image to make it the primary cover image displayed in cards.
6. Click **Save & Commit** to immediately update the live JSON data.

---

## 📲 How the WhatsApp Booking System Works

1. Customer browses any vehicle or camera gear.
2. Clicking **"Book on WhatsApp"** or **"Reserve via WhatsApp"** opens the Booking Enquiry Modal.
3. The customer fills in:
   - Full Name
   - Contact Number
   - Pickup Date & Return Date (validated so return date >= pickup date)
   - Pickup Location
   - Notes / Special shooting requirements
4. The system calculates:
   - Rental duration in days
   - Estimated total rental cost based on daily rate
5. On submit, the app encodes the formatted message and opens:
   ```
   https://wa.me/<BUSINESS_NUMBER>?text=<ENCODED_MESSAGE>
   ```
6. The customer confirms and chats directly with your team.
7. The business recipient number is fully editable in **Admin Dashboard > Contact Details**.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "OneRentals production release"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com/new).
3. Set the Framework Preset to **Vite**.
4. Add the 6 environment variables from `.env.example`.
5. Click **Deploy**. Your site will be live globally in under 2 minutes!
