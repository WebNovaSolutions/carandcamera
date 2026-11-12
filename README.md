# ApexMotion Rentals — Premium Luxury Car & Cinema Camera Rental Platform

A modern, high-performance, responsive Car Rental and Camera Rental website with an intuitive Admin Dashboard.

Engineered with a **No-Traditional-Database Architecture**: all content is stored in **GitHub JSON files**, committed via the **GitHub REST API** through **Vercel Serverless Functions**, media hosted on **Cloudinary**, and client reservations managed exclusively via **WhatsApp click-to-chat** with dynamic pre-filled messages.

---

## 🚀 Key Architectural Highlights

- **Zero Traditional Database**: Eliminates the operational overhead and monthly cost of MongoDB, PostgreSQL, or Firestore.
- **GitHub JSON Content Storage**: `public/data/*.json` serves as the primary dataset (`cars.json`, `cameras.json`, `services.json`, `website.json`, `contact.json`, `navigation.json`).
- **Serverless API Layer**: Secure Vercel Serverless Functions (`/api/admin/save-content`, `/api/auth/*`, `/api/cloudinary/*`) manage GitHub commits and signed image uploads without exposing tokens to frontend JavaScript.
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
| **Media Hosting** | Cloudinary signed image uploads + URL image fallback |
| **Communications** | WhatsApp Business Click-to-Chat (`https://wa.me/`) |
| **Hosting** | Vercel, GitHub |

---

## 📁 Project Structure

```
├── api/                        # Vercel Serverless Functions
│   ├── _utils/
│   │   └── auth.js             # Session JWT signing and cookie management
│   ├── admin/
│   │   └── save-content.js     # Validates session & commits JSON to GitHub
│   ├── auth/
│   │   ├── login.js            # Admin password verification & cookie issuance
│   │   ├── logout.js           # Session termination
│   │   └── me.js               # Session status check
│   └── cloudinary/
│       └── sign.js             # Generates signed parameters for image upload
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
│   │   ├── ImageUploader.jsx   # Cloudinary & URL image manager
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
│   │       ├── ManageCars.jsx  # Add/edit/delete cars, specs, images
│   │       ├── ManageCameras.jsx # Add/edit/delete cameras, accessories
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
git clone https://github.com/your-username/cameracarrentals.git
cd cameracarrentals
npm install
```

### 2. Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default local credentials:
- **Admin Password**: `admin123`
- In local development mode, content edits save directly to `public/data/*.json` on your local filesystem if GitHub variables are left blank.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser:
- Customer Website: `http://localhost:5173/`
- Admin Dashboard: `http://localhost:5173/admin` (Password: `admin123`)

---

## 🔐 Environment Variables for Production (Vercel)

When deploying to Vercel, set these in **Project Settings > Environment Variables**:

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Personal Access Token with `repo` (Contents read/write) permissions |
| `GITHUB_OWNER` | Your GitHub username or organization |
| `GITHUB_REPO` | Repository name (e.g. `cameracarrentals`) |
| `GITHUB_BRANCH` | Default repository branch (usually `main`) |
| `ADMIN_PASSWORD` | Plaintext admin password (or use hash below) |
| `ADMIN_PASSWORD_HASH` | Optional bcrypt hash of the admin password |
| `SESSION_SECRET` | 32+ character random secret string for JWT cookie signing |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier for image hosting |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret (used by serverless signing) |
| `CLOUDINARY_UPLOAD_PRESET`| Optional upload preset name |

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
6. The customer confirms and chats directly with your team without credit card processing friction.
7. The business recipient number is fully editable in **Admin Dashboard > Contact Details**.

---

## 🛡️ Admin Dashboard Features (`/admin`)

- **Secure Session**: Protected by HttpOnly, SameSite cookies and JWT session verification.
- **Genuine Overview Stats**: Total fleet, available equipment, featured listings, and recently updated items calculated directly from the JSON files.
- **Car Management**: Full CRUD operations, image uploading, daily/hourly rates, specs (seating, fuel, transmission, engine), amenities, and availability flags.
- **Camera Management**: Full CRUD operations, image uploading, cinema sensor specs, mount types, resolution, codecs, and included kit accessories.
- **Service Packages**: Manage chauffeur services, self-drive policies, and crew assistant rates.
- **Website Copywriting**: Modify headlines, hero backgrounds, about story, why choose us highlights, testimonials, and footer copyright text.
- **Header & Footer**: Add, remove, or modify navigation links and footer columns.
- **Direct GitHub Commit**: Every change is committed cleanly using the GitHub REST API with conflict handling and immediate runtime revalidation.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial production release of ApexMotion"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com/new).
3. Set the Framework Preset to **Vite**.
4. Add the Environment Variables listed above.
5. Click **Deploy**. Your site will be live globally in under 2 minutes!

---

## 📄 License

MIT License. Designed and engineered for high-performance luxury automotive and cinema camera rentals.
