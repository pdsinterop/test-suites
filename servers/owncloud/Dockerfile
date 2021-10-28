FROM apache-php
USER www-data
RUN wget https://download.owncloud.org/community/owncloud-complete-20210721.tar.bz2
RUN tar -xjf ./owncloud-complete-20210721.tar.bz2
WORKDIR /var/www/owncloud

RUN php console.php maintenance:install --admin-user alice --admin-pass alice123
RUN sed -i "8 i\      1 => 'oc1.docker'," /var/www/owncloud/config/config.php
RUN sed -i "9 i\      2 => 'oc2.docker'," /var/www/owncloud/config/config.php
USER root
