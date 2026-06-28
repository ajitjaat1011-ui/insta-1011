#!/bin/bash
# Run this after setting DATABASE_URL to push schema to Neon
# Usage: DATABASE_URL="postgresql://..." npx drizzle-kit push
echo "Pushing schema to database..."
npx drizzle-kit push
echo "Done!"
