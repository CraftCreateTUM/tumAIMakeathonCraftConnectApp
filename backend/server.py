from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt.gpt import get_bulletlist, get_description_sentence
from flask import send_file
from pdf.pdfReplace import return_pdf
from translate.translate import translate_text

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'This is the backend for Craft Connect.'

@app.route('/bullet_points', methods=['POST'])
def bullet_points():
    try:
        return jsonify({'message': get_bulletlist(request.json['message'])})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/description_sentence', methods=['POST'])
def description_sentence():
    try:
        return jsonify({'message': get_description_sentence(request.json['message'])})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/pdf', methods=['POST'])
def return_files_tut():
    path = return_pdf(request.get_json())
    try:
        return send_file(path)
    except Exception as e:
        return str(e)

@app.route('/translate', methods=['POST'])
def translate():
    try:
        return jsonify({'message': translate_text(request.json['message'])})
    except Exception as e:
        return jsonify({'error': str(e)})
    
if __name__ == '__main__':
    app.run(debug=True)
