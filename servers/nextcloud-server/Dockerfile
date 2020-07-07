FROM nextcloud:latest
COPY site.conf /etc/apache2/sites-enabled/000-default.conf
RUN a2enmod ssl
RUN mkdir /tls
RUN openssl req -new -x509 -days 365 -nodes \
  -out /tls/server.cert \
  -keyout /tls/server.key \
  -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=www.example.ro"
RUN apt-get update && apt-get install -yq \
  git \
  vim
RUN git clone https://github.com/pdsinterop/solid-nextcloud /solid-nextcloud
RUN mv /solid-nextcloud/pdsinterop /usr/src/nextcloud/apps/pdsinterop
ADD init.sh /
EXPOSE 443
