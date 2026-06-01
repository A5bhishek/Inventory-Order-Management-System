from fastapi import FastAPI
#check
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Inventory API Running"}