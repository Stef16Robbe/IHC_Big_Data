### Build Phase
FROM node:lts as build-deps

WORKDIR /usr/src/app

# install node_modules (this is done before the rest of the app is copied to allow caching of the node_modules (at least when you run docker locally))
COPY package.json .
COPY yarn.lock .

RUN yarn install --network-timeout 100000

# install the rest of the app
COPY . .

# Build the production-ready application
RUN yarn build

FROM nginx:1.18-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]