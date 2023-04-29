import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

KEY = os.getenv("GCP_API_KEY")

def translate_text(text, target_language="en"):
    url = "https://translation.googleapis.com/language/translate/v2"

    payload = {
        "q": text,
        "target": target_language,
        "key": KEY,
    }

    response = requests.post(url, data=payload)

    if response.status_code == 200:
        translation_data = response.json()
        translated_text = translation_data["data"]["translations"][0]["translatedText"]
        return translated_text
    else:
        print(f"Error: {response.status_code}")
        return None

if __name__ == "__main__":
    text_to_translate = "Hola, ¿cómo estás?"
    translated_text = translate_text(text_to_translate)
    if translated_text:
        print(f"Translated text: {translated_text}")
