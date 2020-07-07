#!/bin/bash
cd /usr/src/nextcloud
php console.php maintenance:install --admin-user admin --admin-pass nextcloud123
php console.php status
php console.php app:enable pdsinterop

