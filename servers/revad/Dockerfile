FROM ubuntu
# FROM revadbase as base
# COPY --from=base /etc/ssl/certs/ /etc/ssl/certs/
# COPY --from=base /usr/bin/revad /usr/bin/revad
RUN apt update && apt install -y openssl build-essential wget git vim
RUN wget https://golang.org/dl/go1.17.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz
RUN git clone https://github.com/michielbdejong/reva
WORKDIR reva
RUN git checkout pass-ocm-test-suite
RUN PATH=$PATH:/usr/local/go/bin make deps
RUN PATH=$PATH:/usr/local/go/bin make build
# see https://github.com/moby/moby/issues/1996#issuecomment-185872769
ARG CACHEBUST=1
RUN git pull
RUN git checkout 2a6ae9096758b3d89ba
RUN PATH=$PATH:/usr/local/go/bin go mod vendor
RUN PATH=$PATH:/usr/local/go/bin make deps
RUN PATH=$PATH:/usr/local/go/bin make build
# RUN PATH=$PATH:/usr/local/go/bin make test
ADD . /etc/revad
WORKDIR /etc/revad
# RUN openssl req -new -x509 -days 365 -nodes \
#   -out ./server.cert \
#   -keyout ./server.key \
#   -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=www.example.ro" \
#   -addext "subjectAltName = DNS:localhost"

# Trust all the certificates:
RUN cp ./tls/*.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
RUN mkdir -p /var/tmp/reva/
# see https://github.com/golang/go/issues/22846#issuecomment-380809416
RUN echo "hosts: files dns" > /etc/nsswitch.conf
CMD echo "127.0.0.1 $HOST.docker" >> /etc/hosts && /reva/cmd/revad/revad -c /etc/revad/$HOST.toml
