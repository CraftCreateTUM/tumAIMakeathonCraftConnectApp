import openai
import os

from prompt import get_bulletlist_prompt, get_description_sentence_prompt
from dotenv import load_dotenv

EXAMPLE_PROMT = """I followed these steps to exchange the applicator and metering rolls of the AF P and clean the adhesive dam assemblies. Before stopping the machine production, I checked the parts assembly as much as possible. Then I removed the A Flute cassette from the transportation dolly assembly and disassembled the AF P. I installed new applicator and metering rolls using replacement hardware, seals, bearings, retainers, housings and other parts as needed. I reused some parts that were still in good condition. I packed the bearings with grease and pumped more grease into them before restarting the machine production. I also removed and disassembled the drive mechanisms for the adhesive dam assemblies. I cleaned the parts and reassembled them with new bearings, seals, linear bearings and other parts as needed. I lubricated the linear bearings with Krytox lubricant. I calibrated and set up the metering roll gap assembly, including the roll paralleling, gap indication setting, minimum and maximum setting. I cleaned and recalibrated the light grid assembly. I tried to set up the adhesive dam drive assembly, but I found that the operator side proximity switches were unwired from the terminal connector blocks. The operator side outside extent of travel proximity needed to be replaced, but I did not have the exact part. The replacement part did not fit well and required extensive modification to the mounting bracket. The customer ordered a replacement OEM part. The adhesive dam assembly could not complete the calibration routine because of the malfunctioning proximity. It had to be run in manual mode until the proximity was replaced. I checked and adjusted the position of the adhesive dam."""

# Load environment variables from .env file
load_dotenv()


# Set up the OpenAI API client
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_bulletlist(text):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=get_bulletlist_prompt(text),
        temperature=0.9,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6,
        # tell gpt where to stop with the answer
        stop=[" Human:", " AI:"]
    )
    return response.choices[0].text

def get_description_sentence(text):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=get_description_sentence_prompt(text),
        temperature=0.9,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6,
        # tell gpt where to stop with the answer
        stop=[" Human:", " AI:"]
    )
    return response.choices[0].text

if __name__ == "__main__":
    print(get_bulletlist(EXAMPLE_PROMT))
    print(get_description_sentence(EXAMPLE_PROMT))
