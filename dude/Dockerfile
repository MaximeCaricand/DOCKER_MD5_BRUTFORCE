FROM node:14 as builder
COPY ./ client
WORKDIR /client
RUN npm install

FROM node:14-alpine
COPY --from=builder /client/ /client
WORKDIR /client
EXPOSE 3000
CMD npm run dev