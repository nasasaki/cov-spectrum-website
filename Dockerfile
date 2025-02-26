## Build app ##

FROM node:14-buster AS builder
WORKDIR /build
ARG REACT_APP_LAPIS_ACCESS_KEY

COPY package.json .
COPY package-lock.json .
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm --quiet ci

COPY . .
RUN npm set progress=false && \
    npm config set depth 0 && \
    export REACT_APP_WEBSITE_HOST=http://192.168.114.46:8000 && \
    export REACT_APP_SERVER_HOST=http://192.168.114.46:8080/api && \
    export REACT_APP_LAPIS_HOST=http://192.168.114.46:2345/v1 && \
    export REACT_APP_ALTERNATIVE_SEQUENCE_DATA_SOURCE_URL=https://cov-spectrum.org && \
    export REACT_APP_SENTRY_DSN=https://c5039b027c664cda80c173d6a0023bb5@o1333589.ingest.sentry.io/6599204 && \
    export REACT_APP_SENTRY_ENVIRONMENT=prod-gisaid && \
    npm --quiet run build


## Serve via nginx ##

FROM nginx:stable as server

COPY --from=builder /build/build /app
COPY docker_resources/nginx-cov-spectrum.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
