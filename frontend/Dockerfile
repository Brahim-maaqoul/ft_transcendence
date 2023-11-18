FROM node:20

RUN apt-get update

RUN mkdir -p client

WORKDIR /client

COPY . .

CMD npm i && npm run dev