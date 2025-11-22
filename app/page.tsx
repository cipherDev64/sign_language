import WebcamProcessor from './components/WebcamProcessor';

export default function Home() {
  return (
    <main className="main-container">
      <div className="content-wrapper">
        <header className="header">
          <h1 className="title">Sign Language <span className="highlight">Live</span></h1>
          <p className="subtitle">Real-time AI Gesture Recognition</p>
        </header>

        <div className="webcam-section">
          <WebcamProcessor />
        </div>

        <footer className="footer">
          <p>Powered by Mediapipe & Vercel</p>
        </footer>
      </div>
      <div className="background-gradient"></div>
    </main>
  );
}
