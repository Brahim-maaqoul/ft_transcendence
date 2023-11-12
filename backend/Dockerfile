
FROM node:16

RUN apt-get update && \
    apt-get install -y postgresql-client

RUN mkdir -p app 

WORKDIR /app

COPY . .


RUN chmod +x script.sh

ENTRYPOINT [ "./script.sh" ]
CMD npm run start:dev 
