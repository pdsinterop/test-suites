#!/bin/bash
php console.php maintenance:install --admin-user alice --admin-pass nextcloud123
php console.php status
php console.php app:enable pdsinterop

