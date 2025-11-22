# Sign Language Detection Web App

## Overview
A web application that detects basic sign language gestures using a webcam and displays live subtitles - entirely client-side using MediaPipe Web!

- **Frontend**: Next.js (TypeScript) with MediaPipe Web for real-time gesture recognition
- **No Backend Required**: All processing happens in the browser using MediaPipe Web
- **Deployment**: Vercel (static site)

## Features
- Real-time hand gesture detection using MediaPipe Hands
- Live subtitle overlay showing recognized gestures
- Premium dark mode UI with glassmorphism design
- Fully client-side - no server calls, instant recognition
- Supports gestures: Hello (Open Palm), Fist/No, Thumbs Up, Peace/V, One/Pointing

## Local Development
```bash
# Clone the repository
git clone https://github.com/cipherDev64/sign_language.git
cd sign_language

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open `http://localhost:3000` in a browser, allow camera permissions, and perform hand gestures!

## Deployment to Vercel
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   - Select the existing project or create a new one
   - Vercel will detect Next.js and build automatically

3. **Visit the deployed URL** and grant camera permissions to test gestures

## How It Works
1. MediaPipe Web loads hand detection models from CDN
2. Webcam captures video frames in real-time
3. MediaPipe processes frames to extract hand landmarks
4. Simple heuristics map finger positions to gestures
5. Recognized gesture appears as live subtitle overlay

## Technology Stack
- **Next.js 16** - React framework
- **MediaPipe Web** - Client-side ML for hand tracking
- **TypeScript** - Type safety
- **Vanilla CSS** - Premium styling with glassmorphism

## License
MIT - All libraries used are open source
