# Berivan Bakış 16.05.2024
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
EXPOSE 3000
CMD ["sh", "-c", "/wait-for-it.sh db:5432 -- npm start"]
