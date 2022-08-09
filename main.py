from array import array

from fastapi import FastAPI, WebSocket, Request
from pymongo import MongoClient
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
import numpy as np

app = FastAPI()

try:
    mongo_client = MongoClient("mongodb://real-time-poll-mongodb-1:27017")
    # mongo_client = MongoClient("mongodb://localhost:27017")
    database = mongo_client["dogs_cats"]
    collection = database["votes"]
    templates = Jinja2Templates(directory="templates")
    app.mount(
        "/templates", StaticFiles(directory="templates", html=True), name="templates"
    )
except Exception as e:
    print(e)


@app.get("/")
async def get(request: Request):
    votes = [[x["dogs"], x["cats"]] for i, x in enumerate(get_votes())]
    user_votes = np.array(votes)
    response = np.sum(user_votes, 0)
    if response.any():
        votes = list(response)
    else:
        votes = list(np.array([0, 0]))

    return templates.TemplateResponse(
        "dogsVscats.html", {"request": request, "votes": votes}
    )


def add_vote(vote):
    collection.insert_one(vote)


def get_votes():
    x = [vote for vote in collection.find()]
    return x


@app.websocket("/sendVote")
async def user_vote(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive()
            if data["type"] != "websocket.disconnect":
                vote = (
                    {"dogs": 1, "cats": 0}
                    if data["text"] == "cats"
                    else {"dogs": 0, "cats": 1}
                )
                add_vote(vote)
            else:
                data = get_votes()
            await websocket.send_json(data)
    except Exception as ex:
        return ex
