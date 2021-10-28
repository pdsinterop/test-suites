FROM ubuntu
RUN apt update
RUN DEBIAN_FRONTEND="noninteractive" apt install -y apache2 vim
RUN DEBIAN_FRONTEND="noninteractive" apt install -y wget
RUN wget https://download.owncloud.org/community/owncloud-complete-20210721.tar.bz2
WORKDIR /var/www/html
RUN tar -xvjf /owncloud-complete-20210721.tar.bz2
RUN DEBIAN_FRONTEND="noninteractive" apt install -y php git php-curl php-gd php-opcache php-xml php-gd \
  php-curl php-zip php-json libxml2 libxml2-dev php-xml php-mbstring \
  build-essential curl php-sqlite3 php-xdebug php-mbstring php-zip

# Trust all the certificates:
ADD tls /tls
RUN cp /tls/*.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates

RUN ln -s /tls/oc1.crt /tls/server.cert 
RUN ln -s /tls/oc1.key /tls/server.key
RUN a2enmod ssl
COPY site.conf /etc/apache2/sites-enabled/000-default.conf
EXPOSE 443

RUN DEBIAN_FRONTEND="noninteractive" apt install -y php-intl
CMD ["/usr/sbin/apache2ctl", "-DFOREGROUND"]
