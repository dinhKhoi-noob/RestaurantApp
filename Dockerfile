FROM node:alpine

ENV HOME=/home/app

WORKDIR $HOME

RUN apk add --no-cache nodejs && \
    npm install -g nodemon

COPY ./package.json $HOME

RUN cd $HOME && \
    npm install

USER node

EXPOSE 4000/tcp 80/tcp

CMD [ "nodemon", "index.js" ]
