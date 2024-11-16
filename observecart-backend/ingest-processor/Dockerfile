FROM mcr.microsoft.com/playwright:v1.48.1-noble

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npx playwright install --with-deps

COPY . .

CMD ["npm", "start"]