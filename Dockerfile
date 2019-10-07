FROM ubuntu:18.04

# Fetch updates and upgrade
RUN apt-get update && apt-get upgrade -y

# Node prerequisite and installation
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

# Verify node/npm installation and version
RUN node --version
RUN npm --version

# Setup work directory and run npm install with our package.json
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
