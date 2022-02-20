FROM node as builder
COPY ./ client
WORKDIR /client
RUN npm install
EXPOSE 3000
CMD npm run dev