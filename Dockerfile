FROM bcooke91/node-imagemagik:12

WORKDIR /app/current
COPY . .
RUN npm install

# ENTRYPOINT npm run generate
CMD ["npm", "run", "generate"]