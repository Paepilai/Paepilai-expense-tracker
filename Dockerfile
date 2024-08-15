# Build the application
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Run the application
FROM node:18

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./

RUN npm install --only=production

COPY --from=build /usr/src/app /usr/src/app

EXPOSE 3000

CMD ["npm", "start"]
