FROM node
RUN apt-get update && apt-get install -yq \
  redis-server \
  vim \
  && apt-get clean
RUN git clone https://github.com/michielbdejong/solid-app-kit
WORKDIR solid-app-kit
RUN npm install
RUN npm run build
EXPOSE 443
COPY config.json .
COPY data.txt .
ENV DEBUG *
ENV PORT 443
ENV HTTPS true
ENV DOMAIN server
ENV AUD https://server
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
RUN openssl req -new -x509 -days 365 -nodes \
  -out ./server.cert \
  -keyout ./server.key \
  -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=www.example.ro"
CMD /etc/init.d/redis-server start && \
  cat data.txt | head -100 | redis-cli --pipe && \
  npm start
