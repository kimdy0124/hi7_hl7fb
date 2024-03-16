from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pytesseract
from pytesseract import Output
from pdf2image import convert_from_path
import cv2
import numpy as np
import re
import os
import tempfile
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={
    r"/upload": {"origins": "http://localhost:3000"},
    r"/login-history": {"origins": "http://localhost:3000"},
    r"/activity-history": {"origins": "http://localhost:3000"}
})


# Configure Tesseract path
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'

def is_checkbox_checked(cnt, thresh):
    x, y, w, h = cv2.boundingRect(cnt)
    aspect_ratio = w / float(h)
    if 0.8 < aspect_ratio < 1.2 and 20.5 < w < 26 and 20.5 < h < 26:
        roi = thresh[y:y+h, x:x+w]
        non_zero_pixels = cv2.countNonZero(roi)
        total_pixels = w * h
        fill_ratio = non_zero_pixels / total_pixels
        return fill_ratio > 0.573
    return False

def extract_text_near_checkbox(checked_checkboxes, data, margin=50):
    text_near_checkboxes = []
    for (x, y, w, h) in checked_checkboxes:
        x_start = x + w
        y_start = y - margin
        x_end = x_start + 200  # Adjust as necessary
        y_end = y + h + margin

        for i in range(len(data['text'])):
            if int(data['conf'][i]) > 60:  # Confidence threshold
                x_text = int(data['left'][i])
                y_text = int(data['top'][i])
                w_text = int(data['width'][i])
                h_text = int(data['height'][i])

                if (x_start < x_text < x_end) and (y_start < y_text < y_end or y_start < y_text + h_text < y_end):
                    text_near_checkboxes.append(data['text'][i])
    return text_near_checkboxes

def extract_info_from_text(text):
    patterns = {
        'Name': r"Name:\s*(.*)",
        'AHC/WCB#': r"AHC/WCB\s*#:\s*(.*)",
        'Address': r"Address:\s*(.*)",
        'Date of Birth': r"Date of Birth:\s*(.*)",
        'Phone Number': r"Phone:\s*(.*)",
        'Referring Physician': r"Referring Physician:\s*(.*)"
    }
    info = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, text)
        if match:
            info[key] = match.group(1).strip()
        else:
            info[key] = 'Not found'
    return info

def create_hl7_message(info):
    # Simplified HL7 message creation based on extracted info
    hl7_message = "MSH|^~\\&|EXA|PUREFORM|MIKATA|PUREFORM|{timestamp}||ORM^O01^ORM_O01|{control_id}||2.3|||AL||||\n".format(
        timestamp=info.get('Date of Birth', '20240311090037'),
        control_id=info.get('AHC/WCB#', '12586231')
    )
    hl7_message += "PID|1|^^^AB|{patient_id}^^^PDI|^^^AB|{name}^^^^||{dob}|{gender}|||{address}^^{city}^AB^T2H 0L8^CANADA||{phone}|||\n".format(
        patient_id=info.get('AHC/WCB#', ''),
        name=info.get('Name', ''),
        dob=info.get('Date of Birth', ''),
        gender='F',  # Assuming gender; adjust as necessary
        address=info.get('Address', ''),
        city=info.get('City', ''), 
        phone=info.get('Phone Number', '')
    )
    hl7_message += f"PV1||O|^^^{info.get('Referring Physician', '')}\n"
    # Add other segments as needed
    return hl7_message

@app.route('/upload', methods=['POST'])
def upload_and_convert():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename(file.filename)
    temp_dir = tempfile.mkdtemp()
    pdf_path = os.path.join(temp_dir, filename)
    file.save(pdf_path)
    
    # PDF converting
    images = convert_from_path(pdf_path)
    combined_text = ''
    for image in images:
        text = pytesseract.image_to_string(image)
        combined_text += text + "\n"
        
    info = extract_info_from_text(combined_text)
    hl7_message = create_hl7_message(info)
    hl7_path = os.path.join(temp_dir, 'output.hl7')
    with open(hl7_path, 'w') as f:
        f.write(hl7_message)
    
    return send_file(hl7_path, as_attachment=True, download_name='output.hl7')



# Function to generate dummy login history data dynamically
def generate_login_history():
    login_history_data = [
        {"id": 1, "user": "user1", "timestamp": "2024-03-10T10:00:00", "status": "Success"},
        {"id": 2, "user": "user2", "timestamp": "2024-03-10T11:00:00", "status": "Failed"},
        {"id": 3, "user": "user3", "timestamp": "2024-03-10T12:00:00", "status": "Success"}
    ]
    return login_history_data

# Function to generate dummy activity history data dynamically
def generate_activity_history():
    activity_history_data = [
        {"id": 1, "user": "user1", "action": "Viewed Dashboard", "timestamp": "2024-03-10T10:00:00"},
        {"id": 2, "user": "user2", "action": "Downloaded File", "timestamp": "2024-03-10T11:00:00"},
        {"id": 3, "user": "user3", "action": "Updated Profile", "timestamp": "2024-03-10T12:00:00"}
    ]
    return activity_history_data

# Route for login history
@app.route('/login-history')
def get_login_history():
    login_history_data = generate_login_history()
    return jsonify(login_history_data)

# Route for activity history
@app.route('/activity-history')
def get_activity_history():
    activity_history_data = generate_activity_history()
    return jsonify(activity_history_data)

if __name__ == '__main__':
    app.run(debug=True)
