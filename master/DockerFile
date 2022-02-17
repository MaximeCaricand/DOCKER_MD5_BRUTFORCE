FROM node:14 as builder
COPY ./ master
WORKDIR /master
RUN npm install && npm run build 

FROM node:14-alpine
COPY --from=builder /master /master
WORKDIR /master
RUN rm -rf ./src
EXPOSE 3100
EXPOSE 3200
CMD npm run start