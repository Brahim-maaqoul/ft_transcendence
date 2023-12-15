FROM node:20

RUN apt-get update

WORKDIR /client

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

# RUN npm install -g next

COPY . .

RUN npm run build

CMD ["npm", "start"]
