# Deployment Guide

This guide covers deploying the MS Automation Frontend to production.

## Prerequisites

- Node.js 18+ installed
- Firebase project created
- Vercel account (recommended) or other hosting platform
- (Optional) Custom domain

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Firestore

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose your location
5. Apply the security rules from `FIRESTORE_SECURITY_RULES.md`

### 3. Enable Authentication

1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Enable authentication methods:
   - Email/Password
   - Google Sign-In (recommended)
4. Configure authorized domains

### 4. Get Firebase Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Click "Add app" → Web
4. Copy the configuration values

### 5. Configure Environment Variables

Create `.env.local` (for local development) or configure in your hosting platform:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Vercel Deployment (Recommended)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# From project root
vercel

# For production
vercel --prod
```

### 4. Configure Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add all Firebase configuration variables
4. Redeploy to apply changes

## Alternative Deployment Options

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Site Settings

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t ms-automation-frontend .
docker run -p 3000:3000 --env-file .env.local ms-automation-frontend
```

### Self-Hosted

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start npm --name "ms-automation" -- start
pm2 save
pm2 startup
```

## Microsoft Graph OAuth Setup (Production)

For production OAuth with Microsoft Graph:

### 1. Register Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Configure:
   - Name: MS Automation Frontend
   - Supported account types: Choose appropriate option
   - Redirect URI: `https://your-domain.com/api/auth/callback/microsoft`

### 2. Configure API Permissions

Add the following permissions:
- `User.Read`
- `Mail.Read`
- `Mail.ReadWrite`
- `Files.ReadWrite.All` (for OneDrive)

### 3. Create Client Secret

1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Save the value immediately (shown only once)

### 4. Update Environment Variables

```bash
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_MICROSOFT_REDIRECT_URI=https://your-domain.com/api/auth/callback/microsoft
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate_a_random_secret
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Post-Deployment Checklist

### Security
- [ ] Firebase security rules applied
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS configured if needed
- [ ] Rate limiting configured
- [ ] OAuth redirect URIs whitelisted

### Performance
- [ ] Enable Next.js caching
- [ ] Configure CDN for static assets
- [ ] Enable compression
- [ ] Monitor bundle size

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure Firebase Analytics
- [ ] Set up uptime monitoring
- [ ] Enable logging

### Testing
- [ ] Test authentication flow
- [ ] Verify Firebase connection
- [ ] Test node creation and connections
- [ ] Verify save/load functionality
- [ ] Test on mobile devices

## Environment-Specific Configuration

### Development
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=dev_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dev-project
```

### Staging
```bash
# .env.staging
NEXT_PUBLIC_FIREBASE_API_KEY=staging_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=staging-project
```

### Production
```bash
# .env.production (in hosting platform)
NEXT_PUBLIC_FIREBASE_API_KEY=prod_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod-project
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear `.next` folder and rebuild
- Verify all dependencies are installed
- Check for TypeScript errors

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase security rules
- Ensure Firestore is enabled
- Verify API key is valid

### OAuth Not Working
- Check redirect URIs are whitelisted
- Verify client ID and secret
- Check token expiration
- Review OAuth scopes

## Performance Optimization

### Bundle Size
```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer
```

### Caching Strategy
Configure in `next.config.js`:
```javascript
module.exports = {
  headers: async () => [
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

## Support

For deployment issues:
- Check [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- Review [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- Contact support or open an issue on GitHub
