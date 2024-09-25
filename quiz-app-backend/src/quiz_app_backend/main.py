from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/create_quiz")
async def create_quiz(
    topic: str = Body(...),
    instructions: str = Body(default=None)
):
    try:
        questions = get_questions_from_llm(topic, instructions)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_questions_from_llm(topic, instructions):
    url = "https://gemma.us.gaianet.network/v1/chat/completions"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/json"
    }

    system_content = "You are a teacher at a top school or university, with deep knowledge in all types of subjects at different levels, like school, university and PhD level. You are proficient at all different types of topics and are an expert at crafting MCQ quizzes. Provide a 10-question quiz with the question, 4 potential options for the answer seperated by commas, the correct answer option, and the explanation for the answer. Give the question in the first line, options in the second line separated by commas, answer option in the third line, and explanation in the fourth line. After this leave a blank line followed by the next question and so on."
    
    user_content = f"This is the topic of the quiz: {topic}. Give me 10 possible questions, with 4 options each, answer and explanation as you should."
    
    if instructions:
        user_content += f" Also, please consider this special note added by the user: {instructions}."
    else:
        user_content += " There are no special instructions to consider."

    data = {
        "messages": [
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_content}
        ],
        "model": "gemma"
    }

    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        print(response.json()["choices"][0]["message"]["content"])
        return response.json()["choices"][0]["message"]["content"]
    else:
        raise Exception(f"Error: Unable to fetch questions from LLM. Status code: {response.status_code}")