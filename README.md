<div align="center">

# 📚 SaveIT - Your Personal Knowledge Hub

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/bookmark.svg" width="100" height="100" alt="SaveIT Logo">

_Save, organize, and access your digital knowledge effortlessly_

[![Demo](https://img.shields.io/badge/Demo-Live%20Site-green)](https://save-it-pink.vercel.app/)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red)](#)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)

</div>

## ✨ What is SaveIT?

SaveIT is a modern, intuitive web application designed to help you save, organize, and retrieve your digital content effortlessly. Whether it's important links, code snippets, study notes, or personal thoughts - SaveIT keeps everything organized and accessible.

### 🎯 Key Features

- 🔐 **Secure Authentication** - Powered by Clerk for seamless user management
- 📁 **Smart Organization** - Categorize items with custom tags and categories
- 🔍 **Powerful Search** - Find your saved content instantly
- 📌 **Pin Important Items** - Keep your most important content at the top
- 🌐 **Link Preview** - Automatic favicon detection for website links
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Real-time Updates** - Instant synchronization across devices
- 🎨 **Beautiful UI** - Modern design with smooth animations

### 🎬 Demo

🌐 **Live Demo**: [SaveIT App](https://save-it-pink.vercel.app/)

_Experience the full functionality with the live demo!_

## 🛠️ Tech Stack

<div align="center">

| Frontend   | Backend            | Database           | Auth  | Styling      |
| ---------- | ------------------ | ------------------ | ----- | ------------ |
| React 18   | Supabase           | PostgreSQL         | Clerk | Tailwind CSS |
| TypeScript | Supabase Functions | Row Level Security | JWT   | shadcn/ui    |
| Vite       | Edge Functions     | Real-time          | OAuth | Lucide Icons |

</div>

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/SaveIT.git
cd SaveIT

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env

# 4. Start the development server
npm run dev
```

### 🔑 Environment Setup

> **Note for Project Owner**: Add environment variables from Vercel dashboard. For others, you can access the live demo link above.

Create a `.env` file in the root directory with:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 📋 Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL script from `supabase-setup.sql` in your Supabase SQL editor
3. Update your `.env` file with your Supabase credentials

For detailed setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## 📖 Usage

### Saving Content

1. **Click the "+" button** to add new content
2. **Choose content type**: Link or Text
3. **Add details**: Title, description, tags, and category
4. **Save and organize** your content instantly

### Managing Items

- **🔍 Search**: Use the search bar to find specific content
- **🏷️ Filter**: Filter by categories or tags
- **📌 Pin**: Mark important items to keep them at the top
- **✏️ Edit**: Update your saved content anytime
- **🗑️ Delete**: Remove items you no longer need

## 🎨 Features Showcase

### Categories & Organization

- 💻 **Coding**: Development resources, snippets, documentation
- 📚 **Study**: Educational materials, notes, research
- ❤️ **Personal**: Personal links, memories, ideas
- 💼 **Work**: Professional resources, projects, tools

### Smart Link Recognition

- Automatic favicon detection
- Social media platform recognition (LinkedIn, GitHub, Twitter)
- Clean domain display
- Link validation

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Supabase](https://supabase.com/) - Backend and database
- [Clerk](https://clerk.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

## 📞 Support

If you encounter any issues or have questions:

- 📧 Create an issue in this repository
- 🌐 Check out the [live demo](https://save-it-pink.vercel.app/)
- 📖 Read the documentation

---

<div align="center">

### 💖 Made with Love by [Anuj](https://github.com/yourusername)

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/heart.svg" width="20" height="20" alt="Heart">

_Building tools that make developers' lives easier, one commit at a time._

</div>
