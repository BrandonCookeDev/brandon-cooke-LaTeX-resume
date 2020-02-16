FROM bcooke91/node-imagemagik:12

COPY . .
RUN npm install

# ENTRYPOINT npm run generate
RUN npm run generate

CMD ["ls"]