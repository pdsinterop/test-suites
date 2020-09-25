FROM nextcloud-base:latest
RUN git clone https://github.com/pdsinterop/solid-nextcloud /solid-nextcloud
RUN cd /solid-nextcloud && git checkout dev
RUN mv /solid-nextcloud/solid /usr/src/nextcloud/apps/solid
# Run composer:
WORKDIR /usr/src/nextcloud/apps/solid
RUN ls
RUN php /install/composer.phar install --no-dev --prefer-dist
WORKDIR /var/www/html
ADD init.sh /
EXPOSE 443
