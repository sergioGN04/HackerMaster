#!/bin/bash

# Instalación Backend
echo 'Instalando las dependencias necesarias...'
cd sources/backend
npm install

# Nos situamos en el directorio principal
cd ../..

# Iniciamos el despliegue de los contenedores Dockers
echo 'Desplegando la plataforma...'
docker-compose -f despliegueAplicacion.yml up