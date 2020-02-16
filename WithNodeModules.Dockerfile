FROM docker.pkg.github.com/brandoncookedev/docker-node-imagemagik/node-imagemagik:latest

WORKDIR /app
COPY . .

# ENTRYPOINT npm run generate
CMD ["npm", "run", "generate"]