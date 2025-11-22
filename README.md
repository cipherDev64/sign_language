# Sign Language Detection Web App

## Overview
This project provides a web application that detects basic sign language gestures using a webcam and displays live subtitles.

- **Backend**: Python Flask serverless function on Vercel using Mediapipe, OpenCV, and TensorFlow (lightweight heuristic model).
- **Frontend**: Next.js (TypeScript) with a webcam component that streams frames to the backend and shows subtitles.

## Local Development
```bash
# Clone the repository (if not already)
git clone <repo-url>
cd sign_language

# Install frontend dependencies
npm install

# Install backend dependencies (inside the same repo)
pip install -r requirements.txt

# Run the backend locally (Flask)
export FLASK_APP=api/index.py
flask run --port 5001

# In another terminal, run the Next.js dev server
npm run dev
```
Open `http://localhost:3000` in a browser, allow camera access, and you should see live subtitles.

## Deployment to Vercel (Free Tier)
1. **Create a Vercel account** and install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. **Deploy the project**:
   ```bash
   vercel
   ```
   - Choose the existing project or create a new one.
   - When prompted for the framework, select **Next.js**.
   - Vercel will automatically detect the `api/` folder and deploy it as a Python serverless function.
3. **Configure rewrites** (already provided in `vercel.json`):
   ```json
   {
     "rewrites": [{ "source": "/api/(.*)", "destination": "/api/index.py" }]
   }
   ```
   This proxies frontend `/api/*` calls to the Flask function.
4. **Environment Variables** (if any): none required for the basic demo.
5. **Visit the deployed URL** provided by Vercel, grant camera permissions, and test the live subtitle feature.

## Production Tips
- The free tier limits serverless function execution time to 10 seconds. Keep the frame processing rate low (e.g., 1 FPS) to stay within limits.
- For better performance, consider moving the gesture model to TensorFlow Lite and loading it once per function instance.
- Enable Vercel's **Edge Functions** for lower latency if needed.

## License
This project uses only open‑source libraries and is released under the MIT License.
