# Financial Calculators with AI Integration

A financial calculators web application with AI-powered insights using Google's Gemini API.

## Features

- Financial calculators for various purposes
- AI-powered insights and recommendations
- Modern, responsive design
- Dark mode support

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- Google Cloud account with Gemini API access
- Vercel account

## Environment Variables

Create a `.env` file with the following variables:

```env
# Google Gemini API
GOOGLE_API_KEY=your-gemini-api-key-here

# Environment
NODE_ENV=development
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables in Vercel:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add your GOOGLE_API_KEY

5. Deploy to production:
   ```bash
   vercel --prod
   ```

## Best Practices

1. Always use HTTPS in production
2. Regularly update dependencies
3. Monitor API usage and costs
4. Enable 2FA for Vercel account
5. Regular security audits

## License

MIT