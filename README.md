# Tableegh Track 🕌

A comprehensive Islamic dawat tracking system for housing societies and communities.

Tableegh Track helps you organize and track your dawat efforts, manage contacts across different housing blocks, record visits, and follow up with people interested in learning about Islam.

## ✨ Features

- **🏘️ Block Management**: Organize contacts by housing blocks (G Block, H Block, I Block, J Block, K Block, L Block, M Block, N Block)
- **👥 Contact Management**: Store detailed information about people you've met
- **📝 Visit Tracking**: Record dawat visits with purpose, response, and follow-ups
- **📊 Dashboard**: Visual overview of your dawat progress and statistics
- **🔐 Secure Authentication**: User-based access with NextAuth.js
- **📱 Mobile-Friendly**: Responsive design for use on any device
- **🎨 Clean UI/UX**: Intuitive interface designed for all age groups

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/faisal-saddique/tableegh-track.git
   cd tableegh-track
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Turso database credentials:
   ```bash
   AUTH_SECRET="your-generated-secret"           # Generate with: npx auth secret
   DATABASE_URL="your-turso-database-url"        # From: turso db show --url <db-name>
   TURSO_AUTH_TOKEN="your-turso-auth-token"      # From: turso db tokens create <db-name>
   ```

4. **Set up the database**
   ```bash
   # Apply all migrations to Turso (first time setup)
   pnpm migrate apply all

   # Setup initial data
   pnpm users setup
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 User Management

### Adding Users
```bash
# Add a new user
pnpm users create "Ahmad Ali" ahmadali ahmad@masjid.com password123

# List all users
pnpm users list

# Delete a user
pnpm users delete ahmadali

# Initial setup (creates default blocks G-N)
pnpm users setup

# Reset blocks to default G, H, I, J, K, L, M, N blocks
pnpm blocks
```

### Default Test Users
The application comes with three pre-created users for testing:

| **Name** | **Username** | **Email** | **Password** |
|----------|-------------|-----------|-------------|
| Faisal Saddique | `faisalsaddique` | faisal@tableegh.com | `faisal123` |
| Abdul Sattar | `abdulsattar` | abdulsattar@tableegh.com | `abdul123` |
| Ijaz Joiya | `ijazjoiya` | ijaz@tableegh.com | `ijaz123` |

You can sign in using either the **username** or **email** with the corresponding password.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── dashboard/         # Main application pages
│   │   ├── contacts/      # Contact management
│   │   ├── blocks/        # Block views
│   │   └── visits/        # Visit tracking
│   └── api/               # API routes
├── server/
│   ├── api/               # tRPC routers
│   │   └── routers/       # API endpoints
│   ├── auth/              # Authentication config
│   └── db.ts              # Database connection
└── trpc/                  # tRPC client setup

scripts/
└── manage-users.ts        # User management script

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migrations
```

## 💾 Database Schema

The application uses the following main models:

- **User**: Authentication and user management
- **Block**: Housing society blocks (G Block through N Block in New City Housing Society Bahawalnagar)
- **Contact**: People you've met during dawat
- **Visit**: Records of dawat visits and interactions

## 🛠️ Available Scripts

```bash
# Development
pnpm dev                   # Start dev server
pnpm build                 # Build for production
pnpm start                 # Start production server

# Database & Migrations
pnpm migrate list         # List available migrations
pnpm migrate apply all    # Apply all migrations to Turso
pnpm migrate apply <name> # Apply specific migration
pnpm new-migration <name> # Create new migration and apply to Turso
pnpm db:generate          # Generate Prisma client
pnpm db:studio            # Open Prisma Studio

# Code Quality
pnpm lint                 # Run ESLint
pnpm lint:fix             # Fix linting issues
pnpm typecheck            # Check TypeScript
pnpm format:check         # Check formatting
pnpm format:write         # Format code

# User Management
pnpm users                # User management commands
pnpm setup                # Initial setup with default blocks G-N
pnpm blocks               # Reset blocks to default G, H, I, J, K, L, M, N
```

## 🔧 Configuration

### Authentication
The app uses NextAuth.js with credentials-based authentication. Users can sign in with their username or email and password.

**Environment Variables:**
```bash
AUTH_SECRET="your-generated-secret"
DATABASE_URL="libsql://your-turso-database.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```

**Database Setup:**
The application uses Turso (libSQL) as the database. To set up your database:
1. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
2. Create a database: `turso db create <db-name>`
3. Get credentials: `turso db show --url <db-name>` and `turso db tokens create <db-name>`

### Database Migrations

**Creating New Migrations (when you change the schema):**
```bash
# After updating prisma/schema.prisma, run:
pnpm new-migration add_feature_name

# This automatically:
# 1. Creates the migration file
# 2. Applies it to your Turso database
```

**Managing Existing Migrations:**
```bash
# List all available migrations
pnpm migrate list

# Apply all migrations (useful for new setups)
pnpm migrate apply all

# Apply a specific migration
pnpm migrate apply 20250921030510_init
```

### Managing Blocks
Use the block management commands:
```bash
pnpm users         # Shows available user commands
pnpm blocks        # Reset blocks to default G, H, I, J, K, L, M, N (New City Housing Society Bahawalnagar)
pnpm users setup   # Complete setup including blocks and initial data
```

## 📱 Usage Guide

### For Masjid Administrators
1. **Initial Setup**: Run `pnpm users setup` to create default blocks
2. **Add Users**: Create accounts for team members who will be doing dawat
3. **Manage Blocks**: Add or modify housing society blocks as needed

### For Dawat Teams
1. **Add Contacts**: Record details of people you meet
2. **Track Visits**: Log each dawat visit with purpose and response
3. **Follow-ups**: Set reminders for people who need follow-up visits
4. **View Progress**: Monitor your dawat efforts through the dashboard

## 🎨 Design Philosophy

- **Simplicity First**: Clean, intuitive interface suitable for all age groups
- **Islamic Values**: Respectful design with Islamic greetings and terminology
- **Accessibility**: Large buttons, clear text, and simple navigation
- **Mobile-First**: Works perfectly on phones and tablets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is designed for Islamic dawat purposes. Please use it to spread the message of Allah (SWT) and benefit the Muslim community.

## 🤲 Du'a

*"رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ"*

*"Our Lord, accept this from us. Indeed, You are the Hearing, the Knowing."*

---

**Built with ❤️ for the Muslim Ummah**
