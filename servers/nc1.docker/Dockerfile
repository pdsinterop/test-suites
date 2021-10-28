FROM nextcloud:latest
COPY site.conf /etc/apache2/sites-enabled/000-default.conf
RUN a2enmod ssl
# RUN mkdir /tls
# RUN openssl req -new -x509 -days 365 -nodes \
#   -out /tls/server.cert \
#   -keyout /tls/server.key \
#   -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=www.example.ro"

# Trust all the certificates:
ADD tls /tls
RUN cp /tls/*.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates

RUN apt-get update && apt-get install -yq \
  certbot \
  git \
  python3-certbot-apache \
  vim
WORKDIR /var/www/html
ADD init.sh /
EXPOSE 443
