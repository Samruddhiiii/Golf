# ⛳ GolfImpact: Charity Subscription Platform

GolfImpact is a premium, "Golf 2.0" web application that combines golf performance tracking with charitable giving and a monthly reward engine. Built for Digital Heroes, this platform avoids traditional golf aesthetics in favor of a modern, high-emotion dark mode experience.

---

## 🌟 Key Features

### 🎮 For Users
- **Performance-Based Draws**: Enter your latest **5 Stableford scores** (Range 1-45). These aren't just stats—they are your tickets to the monthly prize draw.
- **Rolling Logic**: The system automatically maintains only your 5 most recent scores, ensuring every round counts toward your next win.
- **Impactful Giving**: Allocate at least **10% of your subscription** to a charity of your choice. You can increase this percentage at any time.
- **Prize Winnings**: Match 3, 4, or 5 numbers to win from the prize pool.
- **Verification System**: Upload proof of your scores directly for admin verification and seamless payouts.
- **Smart Notifications**: Receive welcome emails, draw result alerts, and winner notifications.

### 🛡️ For Administrators
- **Full Platform Control**: Manage users, monitor subscriptions, and curate the charity directory.
- **Draw Engine**: Simulate upcoming draws, publish results, and manage the **Jackpot Rollover** logic.
- **Analytics Dashboard**: Real-time tracking of total platform revenue, prize money distributed, and total charity impact.
- **Winner Management**: Review uploaded proofs and manage payout statuses (Pending → Approved → Paid).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion (for high-emotion UI).
- **Backend**: Node.js & Express API.
- **Database**: MongoDB with Mongoose ORM.
- **Authentication**: NextAuth.js (Credentials Provider) + JWT.
- **Notifications**: Nodemailer (Transactional Emails).
- **Security**: Admin-only route protection and secure password hashing with Bcrypt.

---

## 🚀 Getting Started

### 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd "New folder"
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file (see .env.example)
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local file (see .env.example)
   npm run dev
   ```

### 🔑 Default Admin Account
A default administrator account has been seeded for evaluation:
- **Email**: `admin@golfimpact.club`
- **Password**: `AdminPassword123!`

---

## 📊 Distinct Dashboards

The platform features two entirely separate experiences based on user roles:

### [User Dashboard](https://golf-rho-sage.vercel.app/dashboard)
Features high-emotion UI cards for:
- **Subscription Management** (Stripe Mock).
- **Lottery Numbers** (Latest 5 scores).
- **Charity Impact Tracking**.
- **Winnings Overview** with proof upload capability.

### [Admin Dashboard](https://golf-rho-sage.vercel.app/admin)
A command-and-control center for:
- **Platform Analytics** (Revenue, Payouts, Charity totals).
- **User Records** (Promote/Demote admin status).
- **Draw Simulation & Publishing**.
- **Fraud Control** (Proof of win verification).

---

## 📄 License
This project was developed as a sample assignment for Digital Heroes. All rights reserved.
