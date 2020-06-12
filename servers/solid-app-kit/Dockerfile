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
ADD server.key .
ADD server.cert .
CMD /etc/init.d/redis-server start && npm start
