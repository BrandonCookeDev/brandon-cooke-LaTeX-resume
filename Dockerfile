FROM docker.pkg.github.com/brandoncookedev/docker-node-imagemagik/node-imagemagik:latest

WORKDIR /app
COPY . .
RUN npm install

# ENTRYPOINT npm run generate
CMD ["npm", "run", "generate"]