FROM node:16.17.0-bullseye-slim

# Set node env
ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install packages 
RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

EXPOSE 5000
USER node
CMD [ "node", "app.js" ]
