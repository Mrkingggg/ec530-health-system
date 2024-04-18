# Dockerfile for React
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN npm run build

# Install serve to serve your app on port 3000
RUN npm install -g serve
EXPOSE 3000

# Serve your app using serve
CMD ["serve", "-s", "build"]
