#!/bin/bash

echo "Installing dependencies..."
npm install --save react react-dom electron
npm install --save-dev typescript ts-loader webpack webpack-cli html-webpack-plugin concurrently wait-on style-loader css-loader @types/react @types/react-dom @types/electron eslint eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser

echo "Setup complete. You can now run 'npm run dev' to start the development server."