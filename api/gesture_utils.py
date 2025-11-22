import mediapipe as mp
import cv2
import numpy as np

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    min_detection_confidence=0.5
)

def process_gesture(image):
    # Convert to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = hands.process(image_rgb)

    if not results.multi_hand_landmarks:
        return "No Hand Detected"

    # Get landmarks for the first hand
    landmarks = results.multi_hand_landmarks[0]
    
    # Heuristic based gesture recognition
    # We'll implement basic counting or specific shapes
    
    # Get coordinates of key points
    # Thumb tip: 4, Index tip: 8, Middle tip: 12, Ring tip: 16, Pinky tip: 20
    # Wrist: 0
    
    h, w, _ = image.shape
    
    # Helper to get point
    def get_point(idx):
        return (landmarks.landmark[idx].x * w, landmarks.landmark[idx].y * h)

    thumb_tip = get_point(4)
    index_tip = get_point(8)
    middle_tip = get_point(12)
    ring_tip = get_point(16)
    pinky_tip = get_point(20)
    wrist = get_point(0)
    
    # Simple logic: Check which fingers are extended
    # Finger is extended if tip is higher (lower y) than PIP joint (knuckle)
    
    def is_extended(tip_idx, pip_idx):
        return landmarks.landmark[tip_idx].y < landmarks.landmark[pip_idx].y

    # Thumb is special (check x distance for left/right hand, but let's simplify to y for now or relative to index)
    # For thumb, we check if tip is to the side of the IP joint
    # Let's assume right hand for simplicity or handle both
    
    # Better: Check distance from wrist?
    
    # Let's use a simple "Open Palm" vs "Fist" vs "Peace" vs "Thumbs Up"
    
    index_ext = is_extended(8, 6)
    middle_ext = is_extended(12, 10)
    ring_ext = is_extended(16, 14)
    pinky_ext = is_extended(20, 18)
    
    # Thumb: Check if tip is above (lower y) than IP joint (3) is not always true for thumbs up
    # Thumbs up: Thumb tip is above index knuckle?
    
    thumb_tip_y = landmarks.landmark[4].y
    index_mcp_y = landmarks.landmark[5].y
    
    thumb_up = thumb_tip_y < index_mcp_y and not index_ext and not middle_ext and not ring_ext and not pinky_ext
    
    if index_ext and middle_ext and ring_ext and pinky_ext:
        return "Hello (Open Palm)"
    elif not index_ext and not middle_ext and not ring_ext and not pinky_ext:
        if thumb_up:
            return "Thumbs Up"
        return "Fist / No"
    elif index_ext and middle_ext and not ring_ext and not pinky_ext:
        return "Peace / V"
    elif index_ext and not middle_ext and not ring_ext and not pinky_ext:
        return "One / Pointing"
    
    return "Unknown Gesture"
