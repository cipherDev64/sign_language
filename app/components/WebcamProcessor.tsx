'use client';

import { useRef, useEffect, useState } from 'react';

export default function WebcamProcessor() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [subtitle, setSubtitle] = useState<string>("Waiting for gesture...");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                setError("Could not access webcam. Please allow camera permissions.");
            }
        };

        startVideo();

        const processFrame = async () => {
            if (!videoRef.current || !canvasRef.current || isProcessing) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = canvas.toDataURL('image/jpeg', 0.5); // Compress to 0.5 quality

                setIsProcessing(true);
                try {
                    const response = await fetch('/api/recognize', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: imageData }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setSubtitle(data.gesture || "Unknown");
                    } else {
                        console.error("API Error:", response.statusText);
                    }
                } catch (err) {
                    console.error("Fetch Error:", err);
                } finally {
                    setIsProcessing(false);
                }
            }
        };

        // Throttle to 1 FPS (1000ms) to respect Vercel limits
        intervalId = setInterval(processFrame, 1000);

        return () => {
            clearInterval(intervalId);
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Empty dependency array to run once on mount

    return (
        <div className="webcam-container">
            {error && <div className="error-message">{error}</div>}
            <div className="video-wrapper">
                <video ref={videoRef} autoPlay playsInline muted className="webcam-video" />
                <canvas ref={canvasRef} className="hidden-canvas" style={{ display: 'none' }} />
                <div className="subtitle-overlay">
                    <p className="subtitle-text">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}
