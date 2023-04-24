FROM node:16.15.1-alpine
WORKDIR /hnbll-token-validator
EXPOSE 5000
ENV DATABASE_URL=${DATABASE_URL}
COPY . ./
RUN npm install
CMD [ "node", "app.js"]