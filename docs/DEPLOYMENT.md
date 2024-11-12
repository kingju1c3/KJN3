# Deployment Guide

## Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Access to deployment platform (e.g., Netlify)

## Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

The build output will be in the `dist` directory.

## Deployment Options

### Netlify

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting provider

## Environment Variables

Required environment variables:
```env
NODE_ENV=production
API_URL=https://your-api-url
ENCRYPTION_KEY=your-secret-key
```

## Post-Deployment Checklist

1. Verify all environment variables are set
2. Test all major features
3. Check security headers
4. Monitor error logs