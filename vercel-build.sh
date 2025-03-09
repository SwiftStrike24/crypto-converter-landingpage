#!/bin/bash

# Log the build start
echo "Starting Vercel build process..."

# Check if R2 credentials are set
if [ -z "$R2_ACCESS_KEY_ID" ] || [ -z "$R2_SECRET_ACCESS_KEY" ] || [ -z "$R2_ENDPOINT" ]; then
  echo "Warning: R2 credentials not found. Downloads may not work correctly."
fi

# Run the Next.js build
echo "Running Next.js build..."
next build 