FROM node
RUN git clone https://github.com/michielbdejong/solid-app-kit
WORKDIR solid-app-kit
RUN npm install
RUN npm run build
EXPOSE 8080/tcp
COPY config.json .
ENV DEBUG *
ENV PORT 8443
ENV HTTPS true
ENV DOMAIN server
ENV AUD http://server:8080
RUN apt-get update && apt-get install -yq \
  redis-server \
  vim \
  && apt-get clean
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
RUN openssl req -new -x509 -days 365 -nodes \
  -out ./server.cert \
  -keyout ./server.key \
  -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=www.example.ro"
CMD /etc/init.d/redis-server start && npm start
