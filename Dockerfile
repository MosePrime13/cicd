# STAGE 1
FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install --production
COPY --chown=node:node app.js .

EXPOSE 3050
CMD [ "node", "app.js" ]