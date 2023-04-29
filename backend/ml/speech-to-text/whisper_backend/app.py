import os

import pytesseract
import whisper
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from pyngrok import ngrok

app = Flask(__name__)
cors = CORS(app)

RECORDINGS_PATH = "tmp_recordings"


@app.route('/transcribe', methods=['POST'])
def transcribe_file():
    file = request.files['file']
    if file and file.filename.endswith('.webm'):
        if not os.path.exists(RECORDINGS_PATH):
            os.makedirs(RECORDINGS_PATH)
        file.save(os.path.join(RECORDINGS_PATH, file.filename))

        # Print transcription:
        model = whisper.load_model("small")
        result = model.transcribe(os.path.join(RECORDINGS_PATH, file.filename))
        transcription = result["text"]

        print(transcription)

        response = jsonify({'transcription': transcription})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')

        return response

    else:
        return 'Invalid file format. Please upload a .webm file.'


@app.route('/ocr', methods=['POST'])
def ocr():
    image = request.files['image']
    if image:
        if not os.path.exists(RECORDINGS_PATH):
            os.makedirs(RECORDINGS_PATH)
        image.save(os.path.join(RECORDINGS_PATH, image.filename))
        print("Image saved at: ", os.path.join(
            RECORDINGS_PATH, image.filename))

    image = Image.open(os.path.join(RECORDINGS_PATH, image.filename))
    try:
        text = pytesseract.image_to_string(image)
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run()
