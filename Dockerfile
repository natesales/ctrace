FROM node:12-alpine

# Set up working directory
RUN mkdir -p /usr/share/ctrace
WORKDIR /usr/share/ctrace

# Copy source
COPY . /usr/share/ctrace

# Install dependencies
RUN npm install

# Run build
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
