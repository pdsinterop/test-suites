FROM revadbase
ADD . /etc/revad
WORKDIR /etc/revad
RUN openssl req -new -x509 -days 365 -nodes \
  -out ./server.cert \
  -keyout ./server.key \
  -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=www.example.ro"
RUN mkdir -p /var/tmp/reva/
CMD /go/src/github/cs3org/reva/cmd/revad/revad
