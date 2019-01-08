PROJECT_CODEBASE_DIR = "../../"

help:
    @echo "start      - builds and starts services in dev mode"
    @echo "stop       - stop all running containers belonging to the project"
    @echo "clean      - delete project containers, images and volumes"

start:
    docker-compose -f docker-compose.yml up -d

stop:
    docker-compose -f docker-compose.yml down -v

clean: stop
    -docker rm `docker-compose -f docker-compose.yml ps -aq`
    -docker rmi `docker-compose -f docker-compose.yml images -aq`