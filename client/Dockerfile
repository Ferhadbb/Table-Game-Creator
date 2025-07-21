FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "start"] 