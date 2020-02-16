FROM bcooke91/node-imagemagik:12

WORKDIR /app
COPY . .
RUN pwd
RUN npm install
RUN ls -R

# ENTRYPOINT npm run generate
CMD ["npm", "run", "generate"]