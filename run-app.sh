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
git clone  $REPO && cd  kazikrypto/web-frontend



# Install dependencies
$INSTALL

# run web
$DEV
