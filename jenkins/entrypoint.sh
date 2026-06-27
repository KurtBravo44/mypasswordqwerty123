#!/bin/bash

if [ -S /var/run/docker.sock ]; then
    # Определяем GID группы docker на хосте через владельца сокета
    DOCKER_GID=$(stat -c '%g' /var/run/docker.sock)

    # Создаём группу docker с таким же GID (если ещё не существует)
    if ! getent group docker > /dev/null; then
        groupadd -g $DOCKER_GID docker
    else
        # Если группа уже есть, но GID не совпадает – пересоздаём
        current_gid=$(getent group docker | cut -d: -f3)
        if [ "$current_gid" != "$DOCKER_GID" ]; then
            groupmod -g $DOCKER_GID docker
        fi
    fi

    usermod -aG docker jenkins
fi
# Возвращаю управление ПИД 1
exec /usr/local/bin/jenkins.sh "$@"
