#!/bin/bash

# Repository URL
REPO="https://github.com/TwigaDEVs/kazikrypto.git" 

# Branch name
BRANCH="master"

# Install command
INSTALL="npm install" 

# dev command 
DEV="npm run dev"

# Clone repo
git clone  $REPO 
cd  kazikrypto/

if [ -d "web-frontend" ]; then

  # Change directory
  cd web-frontend
  
  # Install npm packages
  npm install

  # Run dev server
  npm run dev
  
else
  echo "web-frontend folder not found"
  exit 1
fi

# Install dependencies
# $INSTALL

# # run web
# $DEV
