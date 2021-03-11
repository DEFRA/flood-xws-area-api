FROM node:12-alpine

# Need to add git as package.json has some github refs
RUN apk add --no-cache git

# Install wait-on so app start can be delayed until db is initialised
# Install nodemon for restart on file change
RUN npm install -g wait-on nodemon

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY --chown=node:node package.json package-lock.json ./
RUN npm install
# be specific about files to copy to prevent no required and/or risky files from being copied
# e.g. git, github, cloudfoundry files
COPY --chown=node:node server ./server/
COPY --chown=node:node test ./test/
COPY --chown=node:node index.js ./

USER node
CMD [ "npm", "start" ]

