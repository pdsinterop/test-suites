FROM apache-php
USER www-data
RUN wget https://download.nextcloud.com/server/releases/nextcloud-22.2.0.zip
RUN tar -xzf ./nextcloud-22.2.0.zip
WORKDIR /var/www/nextcloud

RUN php console.php maintenance:install --admin-user alice --admin-pass alice123
RUN sed -i "28 i\      1 => 'nc1.docker'," /var/www/nextcloud/config/config.php
RUN sed -i "29 i\      2 => 'nc2.docker'," /var/www/nextcloud/config/config.php
USER root
