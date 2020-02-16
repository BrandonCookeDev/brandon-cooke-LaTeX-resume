FROM docker.pkg.github.com/brandoncookedev/docker-node-imagemagik/node-imagemagik:latest

WORKDIR /app
COPY . .
RUN pwd
RUN npm install
RUN ls -R

# ENTRYPOINT npm run generate
CMD ["npm", "run", "generate"]