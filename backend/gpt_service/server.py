from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt import get_bulletlist, get_description_sentence
from flask import send_file
from pdf import create_pdf

app = Flask(__name__)
CORS(app)

@app.route('/bullet_points', methods=['POST'])
def bullet_points():
    try:
        return jsonify({'message': get_bulletlist(request.json['text'])})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/description_sentence', methods=['POST'])
def description_sentence():
    try:
        return jsonify({'message': get_description_sentence(request.json['text'])})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/pdf', methods=['POST'])
def return_files_tut():
    path = create_pdf(request.get_json())
    try:
        return send_file(path, attachment_filename='report.pdf')
    except Exception as e:
        return str(e)
    
if __name__ == '__main__':
    app.run(debug=True)
