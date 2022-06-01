FROM apache-php
RUN rm -rf /var/www/html
USER www-data
RUN wget https://download.owncloud.org/community/owncloud-complete-20210721.tar.bz2
RUN tar -xjf ./owncloud-complete-20210721.tar.bz2
RUN mv owncloud html
WORKDIR /var/www/html
ENV PHP_MEMORY_LIMIT="512M"
ADD init.sh /init.sh
RUN git clone --depth=1 https://github.com/pondersource/OC-Sciencemesh apps/sciencemesh
RUN cd apps/sciencemesh && git pull
RUN cd apps/sciencemesh && make
USER root
