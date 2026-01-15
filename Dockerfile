FROM node:18
WORKDIR /app
COPY server/package.json ./
RUN npm install --production
COPY server/ .
EXPOSE 80
CMD ["node", "index.js"]
