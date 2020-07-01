FROM php:7.2-apache
RUN apt-get update && \
    apt-get install -y \
        git \
        zlib1g-dev 
WORKDIR /tls
RUN openssl req -new -x509 -days 365 -nodes \
  -out server.cert \
  -keyout server.key \
  -subj "/C=RO/ST=Bucharest/L=Bucharest/O=IT/CN=www.example.ro"
RUN docker-php-ext-install mysqli pdo pdo_mysql zip mbstring
RUN a2enmod rewrite
RUN a2enmod ssl
WORKDIR /install
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('sha384', 'composer-setup.php') === 'e0012edf3e80b6978849f5eff0d4b4e4c79ff1609dd1e613307e16318854d24ae64f26d17af3ef0bf7cfb710ca74755a') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN git clone https://github.com/potherca-contrib/solid-php /app
WORKDIR /app
RUN git checkout feature/first-draft
RUN php /install/composer.phar install --no-dev --prefer-dist
COPY site.conf /etc/apache2/sites-enabled/site.conf
EXPOSE 443
