# RegOps Platform

A production-ready regulatory operations platform built with Next.js, featuring AI-powered permit applications, compliance checking, and regulatory guidance.

## 🚀 Features

### Core Functionality
- **SmartPermit**: AI-driven permit application workflow with jurisdiction-specific forms
- **AuditGenie**: Real-time compliance checking with automated PDF report generation
- **AI Assistant**: Interactive chat interface for regulatory guidance and support
- **Document Management**: Comprehensive file upload and organization system
- **Dashboard**: Real-time overview of permits, compliance status, and key metrics

### Technical Features
- **Authentication**: Secure signup/login with email verification and RBAC
- **Responsive Design**: Mobile-first approach with adaptive navigation
- **Dark/Light Mode**: System preference detection with manual toggle
- **Internationalization**: Multi-language support ready for global deployment
- **State Management**: Zustand for efficient global state handling
- **Animations**: Framer Motion for smooth, professional interactions

## 🛠️ Tech Stack

### Frontend
- **Next.js 13.5+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **Zustand** for state management

### Testing
- **Jest** for unit testing
- **React Testing Library** for component testing
- **Cypress** for end-to-end testing

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd regops-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

### Demo Credentials
- **Email**: admin@regops.com
- **Password**: admin123

### User Roles
- **Admin**: Full system access and user management
- **Manager**: Department-level access and team oversight
- **User**: Standard access to personal permits and compliance

## 🧪 Testing

### Unit Tests
```bash
npm run test
npm run test:watch
```

### End-to-End Tests
```bash
npm run test:e2e
npm run test:e2e:dev
```

## 🏗️ Project Structure

```
regops-platform/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # Base UI components
├── lib/                  # Utilities and configurations
│   ├── store/           # Zustand store definitions
│   └── utils.ts         # Utility functions
├── public/              # Static assets
└── tests/               # Test files
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb) - Trust and professionalism
- **Secondary**: Green (#059669) - Success and compliance
- **Accent**: Orange (#ea580c) - Attention and warnings
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#eab308)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (system fallback: system-ui, sans-serif)
- **Scales**: 3-weight system (regular, medium, semibold)
- **Line Heights**: 150% for body text, 120% for headings

### Spacing
- **Grid**: 8px base unit system
- **Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Role-Based Access Control** (RBAC)
- **Input Validation** with Zod schemas
- **XSS Protection** through React's built-in sanitization
- **CSRF Protection** via SameSite cookies

## ♿ Accessibility

- **WCAG 2.1 AA Compliance**
- **Keyboard Navigation** support
- **Screen Reader** compatibility
- **Focus Management** with proper tab order
- **Color Contrast** ratios exceeding 4.5:1
- **Skip Links** for main content navigation

## 📱 Responsive Design

### Mobile (< 768px)
- Drawer navigation
- Touch-optimized interactions
- Stacked layouts
- Compressed information density

### Tablet (768px - 1024px)
- Collapsible sidebar
- Grid-based layouts
- Medium information density

### Desktop (> 1024px)
- Full sidebar navigation
- Multi-column layouts
- High information density
- Hover interactions

## 🌍 Internationalization

The platform is prepared for multi-language support:

```typescript
// Add new language files in /locales
// Configure in next-i18next.config.js
// Use translation hooks in components
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=your-database-url
```

### Hosting Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** deployment ready

## 📊 Performance

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Techniques
- **Code Splitting** with dynamic imports
- **Image Optimization** with Next.js Image component
- **Bundle Analysis** with @next/bundle-analyzer
- **Progressive Web App** capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Follow TypeScript strict mode
- Use conventional commit messages
- Maintain test coverage above 80%
- Follow accessibility guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Bolt.new](https://bolt.new) - AI-powered development platform
- UI components powered by [Radix UI](https://radix-ui.com)
- Styling system based on [Tailwind CSS](https://tailwindcss.com)
- Icons from [Lucide React](https://lucide.dev)

## 📞 Support

For support and questions:
- 📧 Email: support@regops.com
- 📖 Documentation: [docs.regops.com](https://docs.regops.com)
- 🐛 Issues: [GitHub Issues](https://github.com/regops/platform/issues)

---

**Built with ❤️ using [Bolt.new](https://bolt.new)**