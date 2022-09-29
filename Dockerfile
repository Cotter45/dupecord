FROM node:16 as build-node 
WORKDIR /frontend
COPY frontend/ .
ENV REACT_APP_BASE_URL=
RUN npm install
RUN npm run build

FROM node:16 as build-server
WORKDIR /backend
COPY backend/ .
RUN npm install
RUN npx prisma generate
RUN npx tsc 

FROM node:16
WORKDIR /app
# COPY --from=build-node /frontend/build ./frontend/build
COPY --from=build-server /backend/dist ./backend/dist
COPY --from=build-server /backend/node_modules ./backend/node_modules
COPY --from=build-server /backend/prisma ./backend/prisma
WORKDIR /app/backend
CMD ["node", "dist/index.js"]


# FROM node:16 AS base
# # RUN apk --no-cache add dumb-init
# # RUN apt-get update && \
#   # apt-get -y install sudo
# RUN mkdir -p /app && chown node:node /app
# WORKDIR /app
# USER node
# RUN mkdir tmp

# FROM base AS dependencies
# COPY --chown=node:node ./backend/package.json ./
# RUN npm i
# COPY --chown=node:node ./backend .

# FROM dependencies AS build
# USER root
# RUN npm i -g prisma
# RUN npm run generate
# RUN npx tsc

# FROM base AS production
# ENV NODE_ENV=production
# COPY --chown=node:node ./backend/package*.json ./
# RUN npm ci --omit=dev
# COPY --chown=node:node --from=build /app/dist .
# # RUN npx prisma generate
# # CMD [ "dumb-init", "node", "dist/src/index.js" ]
# CMD [ "node", "src/index.js" ]