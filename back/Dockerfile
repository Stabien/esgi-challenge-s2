FROM node:16.13.0-alpine

WORKDIR /home/app

COPY . .

RUN yarn global add nodemon

EXPOSE 4000

CMD [ "sh", "-c", "yarn && yarn dev" ]