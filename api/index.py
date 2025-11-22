from flask import Flask, request, jsonify
import gesture_utils
import base64
import numpy as np
import cv2

app = Flask(__name__)

@app.route('/api/recognize', methods=['POST'])
def recognize():
    try:
        data = request.json
        image_data = data.get('image')
        if not image_data:
            return jsonify({"error": "No image data provided"}), 400

        # Decode base64 image
        # Expected format: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Failed to decode image"}), 400

        gesture = gesture_utils.process_gesture(img)
        return jsonify({"gesture": gesture})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})
