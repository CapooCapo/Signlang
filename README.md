# SignLang (Angular + Django + MySQL + Docker)
- Dev compose: db + api + web
- Init Django/Angular bên trong container (không cần cài trên host)

## Quick start
1) Build images: `docker compose build`
2) Start DB: `docker compose up -d db`
3) Init Django: `docker compose run --rm api bash` -> `django-admin startproject backend .`
4) Run API: `docker compose up -d api`  (http://localhost:8000)
5) Init Angular: `docker compose run --rm web bash` -> `ng new sl-web --directory . --routing --style=scss --skip-git`
6) Run FE: `docker compose up -d web`   (http://localhost:4200)
