import os

import whisper
from flask import Flask, request

app = Flask(__name__)

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
    print(result["text"])

  else:
    return 'Invalid file format. Please upload a .webm file.'

if __name__ == '__main__':
  app.run(debug=True)