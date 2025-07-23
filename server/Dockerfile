FROM node:18

WORKDIR /app

# Install netcat
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

# Make start script executable
RUN chmod +x start.sh

EXPOSE 5000

CMD ["./start.sh"] 