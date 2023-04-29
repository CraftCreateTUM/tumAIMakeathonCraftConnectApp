import os

import whisper
from flask import Flask, request, jsonify
from flask_cors import CORS

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
        model = whisper.load_model("base")
        result = model.transcribe(os.path.join(RECORDINGS_PATH, file.filename))
        transcription = result["text"]

        response = jsonify({'transcription': transcription})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')

        return response

    else:
        return 'Invalid file format. Please upload a .webm file.'


if __name__ == '__main__':
    app.run(debug=True)
