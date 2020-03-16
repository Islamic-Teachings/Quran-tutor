#!/bin/bash
cd app && npm i && npm run build && cd .. && docker-compose up --build -d
