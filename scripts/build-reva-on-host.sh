
docker run -v $REPO_PATH/reva:/reva \
  -e"PATH=/usr/local/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
  --workdir /reva revad bash -c "git config --global --add safe.directory /reva && make build-reva"
