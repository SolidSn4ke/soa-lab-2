#!/usr/bin/env bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load application and Jetty configuration
set -a
source "$SCRIPT_DIR/application.env"
source "$SCRIPT_DIR/jetty.env"
set +a

# Java settings
export JAVA_VERSION="21"
export _JAVA_OPTIONS="-XX:MaxHeapSize=2G -XX:MaxMetaspaceSize=512m"

cd "$JETTY_BASE"

exec java \
    -Djetty.sslContext.keyStorePassword="$JETTY_SSL_PASSWORD" \
    -jar "$JETTY_HOME/start.jar"