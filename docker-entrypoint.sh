#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "🔄 Waiting for PostgreSQL to be ready..."
until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done
echo "✅ PostgreSQL is ready!"

# Run database migrations if needed
# echo "🔄 Running database migrations..."
# npx sequelize-cli db:migrate

# Run seeders if needed
echo "🌱 Running database seeders..."
npm run seed

# Start the application
echo "🚀 Starting application..."
exec "$@"
