FROM node
RUN apt-get update && apt-get install -yq \
  vim \
  && apt-get clean
RUN git clone https://github.com/solid/storage-tests /app
WORKDIR /app
RUN npm install
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
CMD npm run jest
