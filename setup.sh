#!/bin/bash

echo "Installing dependencies..."
npm install --save react react-dom electron react-markdown remark-gfm @heroicons/react uuid

npm install --save-dev typescript ts-loader webpack webpack-cli html-webpack-plugin concurrently wait-on @types/react @types/react-dom @types/electron eslint eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser tailwindcss postcss postcss-loader autoprefixer @types/uuid

echo "Initializing Tailwind CSS..."
npx tailwindcss init -p

echo "Setup complete. You can now run 'npm run dev' to start the development server."