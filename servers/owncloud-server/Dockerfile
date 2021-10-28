FROM ubuntu
RUN apt update
RUN DEBIAN_FRONTEND="noninteractive" apt install -yq \
  apache2 \
  build-essential \
  curl \
  git \
  libxml2 \
  libxml2-dev \
  php \
  php-curl \
  php-gd \
  php-intl \
  php-json \
  php-mbstring \
  php-opcache \
  php-sqlite3 \
  php-xml \
  php-xdebug \
  php-zip \
  vim \
  wget
# Trust all the certificates:
ADD tls /tls
RUN cp /tls/*.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates

ENV HOST=oc1
RUN ln -s /tls/$HOST.crt /tls/server.cert
RUN ln -s /tls/$HOST.key /tls/server.key
RUN a2enmod ssl
COPY site.conf /etc/apache2/sites-enabled/000-default.conf
WORKDIR /var/www
RUN chown www-data:www-data .
USER www-data
RUN wget https://download.owncloud.org/community/owncloud-complete-20210721.tar.bz2
RUN tar -xjf ./owncloud-complete-20210721.tar.bz2
WORKDIR /var/www/owncloud

RUN php console.php maintenance:install --admin-user alice --admin-pass alice123
RUN sed -i "8 i\      1 => 'oc1.docker'," /var/www/owncloud/config/config.php
RUN sed -i "9 i\      2 => 'oc2.docker'," /var/www/owncloud/config/config.php
USER root
EXPOSE 443
CMD ["/usr/sbin/apache2ctl", "-DFOREGROUND"]
