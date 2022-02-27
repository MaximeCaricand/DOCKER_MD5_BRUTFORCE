FROM alpine
COPY ./ master
WORKDIR /master
RUN apk add --update nodejs
RUN apk add --update npm
RUN apk add --update docker
RUN npm install && npm run build 
RUN rm -rf ./src
EXPOSE 3100
EXPOSE 3200
CMD npm run start