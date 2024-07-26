# build stage
FROM node:lts-alpine as build-stage

ARG IO_STAGE
ARG IO_VERSION
ARG SENTRY_DSN
ARG MATOMO_ID

ENV VITE_STAGE $IO_STAGE
ENV VITE_VERSION $IO_VERSION
ENV VITE_SENTRY_DSN $SENTRY_DSN
ENV VITE_MATOMO_ID $MATOMO_ID

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build

# release stage
FROM nginx:stable-alpine as release-stage

COPY ./docker/nginx/default.conf /etc/nginx/conf.d/

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
