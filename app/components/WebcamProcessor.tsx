'use client';

import { useRef, useEffect, useState } from 'react';

// TypeScript declarations for MediaPipe
declare global {
    interface Window {
        Hands: any;
        Camera: any;
    }
}

export default function WebcamProcessor() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [subtitle, setSubtitle] = useState<string>("Loading...");
    const [error, setError] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load MediaPipe scripts
        const loadMediaPipe = async () => {
            if (typeof window === 'undefined') return;

            // Load Hands script
            const handsScript = document.createElement('script');
            handsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
            handsScript.crossOrigin = 'anonymous';
            document.body.appendChild(handsScript);

            // Load Camera Utils script
            const cameraScript = document.createElement('script');
            cameraScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
            cameraScript.crossOrigin = 'anonymous';
            document.body.appendChild(cameraScript);

            // Wait for scripts to load
            await new Promise((resolve) => {
                handsScript.onload = () => {
                    cameraScript.onload = resolve;
                };
            });

            setIsLoaded(true);
        };

        loadMediaPipe().catch((err) => {
            console.error('Failed to load MediaPipe:', err);
            setError('Failed to load gesture detection library');
        });
    }, []);

    useEffect(() => {
        if (!isLoaded || !videoRef.current || !canvasRef.current) return;
        if (!window.Hands || !window.Camera) return;

        const hands = new window.Hands({
            locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
            if (!canvasRef.current) return;

            const canvasCtx = canvasRef.current.getContext('2d');
            if (!canvasCtx) return;

            const canvas = canvasRef.current;
            canvas.width = results.image.width;
            canvas.height = results.image.height;

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0];
                const gesture = recognizeGesture(landmarks);
                setSubtitle(gesture);
            } else {
                setSubtitle("No Hand Detected");
            }

            canvasCtx.restore();
        });

        const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
                if (videoRef.current) {
                    await hands.send({ image: videoRef.current });
                }
            },
            width: 1280,
            height: 720,
        });

        camera.start().catch((err: any) => {
            console.error("Error accessing webcam:", err);
            setError("Could not access webcam. Please allow camera permissions.");
        });

        setSubtitle("Waiting for gesture...");

        return () => {
            camera.stop();
        };
    }, [isLoaded]);

    const recognizeGesture = (landmarks: any) => {
        // Helper to check if finger is extended
        const isExtended = (tipIdx: number, pipIdx: number) => {
            return landmarks[tipIdx].y < landmarks[pipIdx].y;
        };

        const indexExt = isExtended(8, 6);
        const middleExt = isExtended(12, 10);
        const ringExt = isExtended(16, 14);
        const pinkyExt = isExtended(20, 18);

        const thumbTipY = landmarks[4].y;
        const indexMcpY = landmarks[5].y;
        const thumbUp = thumbTipY < indexMcpY && !indexExt && !middleExt && !ringExt && !pinkyExt;

        if (indexExt && middleExt && ringExt && pinkyExt) {
            return "Hello (Open Palm)";
        } else if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
            if (thumbUp) {
                return "Thumbs Up";
            }
            return "Fist / No";
        } else if (indexExt && middleExt && !ringExt && !pinkyExt) {
            return "Peace / V";
        } else if (indexExt && !middleExt && !ringExt && !pinkyExt) {
            return "One / Pointing";
        }

        return "Unknown Gesture";
    };

    return (
        <div className="webcam-container">
            {error && <div className="error-message">{error}</div>}
            <div className="video-wrapper">
                <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline muted />
                <canvas ref={canvasRef} className="webcam-video" />
                <div className="subtitle-overlay">
                    <p className="subtitle-text">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}
