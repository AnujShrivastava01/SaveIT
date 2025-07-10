<div align="center">

# 📚 SaveIT - Your Personal Knowledge Hub

<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/bookmark.svg" width="100" height="100" alt="SaveIT Logo">

_Save, organize, and access your digital knowledge effortlessly_

[![Demo](https://img.shields.io/badge/Demo-Live%20Site-green)](https://save-it-pink.vercel.app/)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red)](#)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=120&section=header&animation=fadeIn"/>

</div>

## ✨ What is SaveIT?

SaveIT is a modern, intuitive web application designed to help you save, organize, and retrieve your digital content effortlessly. Whether it's important links, code snippets, study notes, or personal thoughts - SaveIT keeps everything organized and accessible.

### 🎯 Key Features

- 🔐 **Secure Authentication** - Powered by Clerk for seamless user management
- 📁 **Smart Organization** - Categorize items with custom tags and categories
- 🔍 **Powerful Search** - Find your saved content instantly
- 📌 **Pin Important Items** - Keep your most important content at the top
- 🌐 **Link Preview** - Automatic favicon detection for website links
- �️ **Custom Images** - Add personalized images to your cards via URL or data URI
- �📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Real-time Updates** - Instant synchronization across devices
- 🎨 **Beautiful UI** - Modern design with smooth animations

### 🎬 Demo

🌐 **Live Demo**: [SaveIT App](https://save-it-pink.vercel.app/)

_Experience the full functionality with the live demo!_

<div align="center">
<img width="80%" src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=4&section=header&%20render"/>
</div>

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,typescript,vite,tailwind,supabase,nodejs&theme=light" alt="Tech Stack" />

<br><br>

| Frontend                                                                     | Backend                                                                  | Database                                                                     | Auth                                                                                                    | Styling                                                                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| <img src="https://skillicons.dev/icons?i=react" width="40"/> React 18        | <img src="https://skillicons.dev/icons?i=supabase" width="40"/> Supabase | <img src="https://skillicons.dev/icons?i=postgresql" width="40"/> PostgreSQL | <img src="https://img.shields.io/badge/Clerk-6C47FF?style=flat&logo=clerk&logoColor=white" width="60"/> | <img src="https://skillicons.dev/icons?i=tailwind" width="40"/> Tailwind CSS                                      |
| <img src="https://skillicons.dev/icons?i=typescript" width="40"/> TypeScript | Supabase Functions                                                       | Row Level Security                                                           | JWT                                                                                                     | shadcn/ui                                                                                                         |
| <img src="https://skillicons.dev/icons?i=vite" width="40"/> Vite             | Edge Functions                                                           | Real-time                                                                    | OAuth                                                                                                   | <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/palette.svg" width="20"/> Lucide Icons |

</div>

<div align="center">
<img width="80%" src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=4&section=header&%20render"/>
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
3. Run the custom image migration from `add-custom-image-migration.sql` (if needed)
4. Update your `.env` file with your Supabase credentials

For detailed setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

<div align="center">
<img width="80%" src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=4&section=header&%20render"/>
</div>

## 📖 Usage

### Saving Content

1. **Click the "+" button** to add new content
2. **Choose content type**: Link or Text
3. **Add details**: Title, description, tags, and category
4. **Custom Image (Optional)**: Add a personalized image URL to display as the card icon
5. **Save and organize** your content instantly

### Custom Image Feature

SaveIT now supports custom images for your saved items:

- **🖼️ Image URLs**: Add any publicly accessible image URL
- **📊 Data URIs**: Support for base64 encoded images
- **🔄 Live Preview**: See your image preview before saving
- **🎯 Icon Override**: Custom images take priority over automatic favicons
- **✨ Fallback**: Graceful fallback to favicon if custom image fails to load

**Supported formats**: JPG, PNG, GIF, SVG, WebP and more

### Managing Items

- **🔍 Search**: Use the search bar to find specific content
- **🏷️ Filter**: Filter by categories or tags
- **📌 Pin**: Mark important items to keep them at the top
- **✏️ Edit**: Update your saved content anytime
- **🗑️ Delete**: Remove items you no longer need

<div align="center">
<img width="80%" src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=4&section=header&%20render"/>
</div>

## 🎨 Features Showcase

<div align="center">
<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg" width="50" height="50" alt="Features">
</div>

### Categories & Organization

- 💻 **Coding**: Development resources, snippets, documentation
- 📚 **Study**: Educational materials, notes, research
- ❤️ **Personal**: Personal links, memories, ideas
- 💼 **Work**: Professional resources, projects, tools

### Smart Link Recognition

- Automatic favicon detection
- Social media platform recognition (LinkedIn, GitHub, Twitter)
- Custom image support with URL/data URI input
- Clean domain display
- Link validation
- Graceful fallbacks for failed image loads

<div align="center">
<img width="80%" src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=4&section=header&%20render"/>
</div>

## 🚀 Recent Updates

### ✨ v1.2.0 - Custom Image Feature

- **🖼️ Custom Images**: Users can now add custom images to their saved items
- **🔄 Live Preview**: Real-time preview of custom images in add/edit forms
- **📊 Data URI Support**: Support for base64 encoded images
- **🎯 Smart Fallbacks**: Graceful fallback to favicons if custom images fail
- **💾 Database Migration**: Added `custom_image` column to support the feature

---

## 🤝 Contributing

<div align="center">
<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/users.svg" width="50" height="50" alt="Contributing">
</div>

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<div align="center">
<img width="80%" src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=4&section=header&%20render"/>
</div>

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
<img width="80%" src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=4&section=header&%20render"/>
</div>

## 🙏 Acknowledgments

<div align="center">
<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/heart-handshake.svg" width="50" height="50" alt="Acknowledgments">
</div>

- [React](https://reactjs.org/) - The web framework used
- [Supabase](https://supabase.com/) - Backend and database
- [Clerk](https://clerk.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

<div align="center">
<img width="80%" src="https://capsule-render.vercel.app/api?type=rect&color=gradient&height=4&section=header&%20render"/>
</div>

## 📞 Support

If you encounter any issues or have questions:

- 📧 Create an issue in this repository
- 🌐 Check out the [live demo](https://save-it-pink.vercel.app/)
- 📖 Read the documentation

---

<div align="center">

### Made with 💖 by [Anuj](https://github.com/yourusername)

<div align="center">

_Building tools that make developers' lives easier, one commit at a time._

<br>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anujshrivastava1/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Anujshrivastava01)

<br>

<img src="https://skillicons.dev/icons?i=react,typescript,nodejs,vscode&theme=light" alt="Technologies I Love" />

</div>
