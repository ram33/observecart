FROM mcr.microsoft.com/playwright:v1.14.0-focal

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npx playwright install --with-deps

COPY . .

CMD ["node", "processor.js"]