from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

DOMAIN = os.getenv("DOMAIN_NAME", "localhost")
HOST = os.getenv("HOST_IP", "127.0.0.1")

# Строим список разрешённых источников
origins = [
    f"http://{DOMAIN}:3000",
    f"https://{DOMAIN}:3000",
    f"http://{HOST}:3000",
    "http://localhost:3000",  # для локальной разработки
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # или ["*"] для тестов, но лучше конкретные
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Временное хранилище данных (в памяти)
items = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"},
]

class ItemCreate(BaseModel):
    name: str

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/items", response_model=List[dict])
def get_items():
    return items

@app.post("/items", response_model=dict)
def create_item(item: ItemCreate):
    new_id = max([i["id"] for i in items], default=0) + 1
    new_item = {"id": new_id, "name": item.name}
    items.append(new_item)
    if len(items) > 20:
        items.pop(0)
    return new_item
