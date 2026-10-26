FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM busybox:1.36
COPY --from=build /app/dist/ /www/
EXPOSE 80
CMD ["httpd", "-f", "-p", "80", "-h", "/www"]
