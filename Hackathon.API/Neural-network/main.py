from fastapi import FastAPI
from pydantic import BaseModel
from classification import answer

app = FastAPI()

class QueryModel(BaseModel):
    query: str

@app.post("/assist")
def classify(query: QueryModel):
    response = answer(query.query)
    return {"query": response}
