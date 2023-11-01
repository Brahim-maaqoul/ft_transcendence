
FROM node:16

RUN apt-get update && \
    apt-get install -y postgresql-client

WORKDIR /app


COPY ./package.json ./
COPY ./package-lock.json ./




COPY . .

RUN chmod +x script.sh

EXPOSE 8000

ENTRYPOINT [ "./script.sh" ]
CMD npm run start:dev 
