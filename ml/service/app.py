from fastapi import FastAPI
app = FastAPI(title="SignLang ML Service")
@app.get("/healthz")
def health(): return {"ok": True}
