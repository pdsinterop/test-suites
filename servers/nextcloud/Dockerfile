FROM apache-php
RUN apt install -y zip
RUN rm -rf /var/www/html
USER www-data
RUN wget https://download.nextcloud.com/server/releases/nextcloud-22.2.0.zip
RUN unzip ./nextcloud-22.2.0.zip
RUN mv nextcloud html
WORKDIR /var/www/html

RUN php console.php maintenance:install --admin-user alice --admin-pass alice123
RUN php console.php app:disable firstrunwizard
RUN sed -i "8 i\      1 => 'nc1.docker'," /var/www/html/config/config.php
RUN sed -i "9 i\      2 => 'nc2.docker'," /var/www/html/config/config.php
USER root
