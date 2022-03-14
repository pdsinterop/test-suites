FROM apache-php
RUN rm -rf /var/www/html
USER www-data
RUN wget https://download.owncloud.org/community/owncloud-complete-20210721.tar.bz2
RUN tar -xjf ./owncloud-complete-20210721.tar.bz2
RUN mv owncloud html
WORKDIR /var/www/html

RUN php console.php maintenance:install --admin-user alice --admin-pass alice123
RUN php console.php app:disable firstrunwizard
RUN sed -i "8 i\      1 => 'oc1.docker'," /var/www/html/config/config.php
RUN sed -i "9 i\      2 => 'oc2.docker'," /var/www/html/config/config.php
USER root
