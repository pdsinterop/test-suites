#!/bin/bash
php console.php maintenance:install --admin-user alice --admin-pass alice123
php console.php status
php console.php app:enable solid

