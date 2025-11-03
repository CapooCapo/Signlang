#!/usr/bin/env bash
set -e
case "${1:-}" in
  up)        docker compose up -d ;;
  down)      docker compose down ;;
  logs)      docker compose logs -f --tail=200 ;;
  api-sh)    docker compose run --rm api bash ;;
  web-sh)    docker compose run --rm web bash ;;
  db-mysql)  docker compose exec db mysql -uroot -prootpass -e "SELECT VERSION();" ;;
  *) echo "Usage: $0 {up|down|logs|api-sh|web-sh|db-mysql}";;
esac
