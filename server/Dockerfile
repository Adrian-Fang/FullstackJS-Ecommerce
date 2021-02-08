FROM node:12-alpine

RUN mkdir -p /api
WORKDIR /api
COPY ./ ./
RUN npm install

CMD ["npm", "start"]
EXPOSE 3000