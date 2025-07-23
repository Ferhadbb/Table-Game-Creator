#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
npx sequelize-cli db:migrate

# Start the server
echo "Starting the server..."
npm run dev 