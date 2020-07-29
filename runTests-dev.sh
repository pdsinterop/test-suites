#!/usr/bin/env bash

set -euo pipefail

runTests() {

  local aTests bRunning sAppDirectory sContainerName sServerName sReportDirectory

  readonly sContainerName='server'

  bRunning=false

  dockerStop() {
    if [[ "${bRunning:-}" == true ]];then
      echo ' -----> Stopping server...'
      docker stop "${sContainerName}" > /dev/null || echo 'Could not stop server'
      bRunning=false
    fi
  }

  declare -a aTests=('webid-provider' 'solid-crud')

  readonly sServerName="${1?Two parameter required: <name> <project-path> [report-directory]}"
  readonly sAppDirectory="${2?Two parameter required: <name> <project-path> [report-directory]}"
  readonly sReportDirectory="${3:-$PWD}/reports"

  trap dockerStop EXIT INT TERM

  echo " =====> Running test for ${sServerName} from ${sAppDirectory}"

  echo ' -----> Starting server...'
  docker run \
    -d \
    --name=${sContainerName} \
    --network=testnet \
    --rm \
    --volume "${sAppDirectory}:/app" \
    "${sServerName}"

  bRunning=true

  if [[ "${sServerName}" == 'nextcloud-server' ]]; then
      echo ' -----> Waiting for Nextcloud server to start ...'
      sleep 10
      docker logs "${sContainerName}"
      echo ' -----> Running init script for Nextcloud server ...'
      docker exec -it --user 'www-data' "${sContainerName}" sh /init.sh
  fi

  for sTest in "${aTests[@]}"; do
    echo " -----> Running ${sTest} tester..."
    {
      docker run \
        --env-file "servers/${sServerName}/env.list" \
        --network=testnet \
        "${sTest}" \
      2> "${sReportDirectory}/${sServerName}-${sTest}.txt"
    } || true
  done

  dockerStop

  echo -e "\n =====> Test results\n"
  grep 'Tests' "${sReportDirectory}/${sServerName}"-*.txt \
    | cut -d ':' -f1,3- | rev | cut -d '/' -f1 | rev
}

if [ "${BASH_SOURCE[0]}" != "$0" ]; then
    export -f runTests
else
    runTests "${@}"
    exit $?
fi
