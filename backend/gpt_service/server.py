from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt import get_bulletlist, get_description_sentence

app = Flask(__name__)
CORS(app)

@app.route('/bullet_points', methods=['POST'])
def chat_gpt():
    try:
        return jsonify({'message': get_bulletlist(request.json['text'])})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/description_sentence', methods=['POST'])
def chat_gpt():
    try:
        return jsonify({'message': get_description_sentence(request.json['text'])})
    except Exception as e:
        return jsonify({'error': str(e)})
    
if __name__ == '__main__':
    app.run(debug=True)
