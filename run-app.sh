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
git clone  $REPO && cd cd kazikrypto/web-frontend

# Change to main directory


# Change to repo directory 
cd web-frontend

# Install dependencies
$INSTALL

# run web
$DEV
