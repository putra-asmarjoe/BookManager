FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the React application
RUN npm run build

# Use the official Nginx image as the base image
FROM nginx:alpine

COPY --from=0 /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
# Expose port 80 to access the application
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]