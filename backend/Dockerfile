FROM node:20.15.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g wait-for-it

EXPOSE 5000

CMD ["sh", "-c", "npm run dev:ts"]