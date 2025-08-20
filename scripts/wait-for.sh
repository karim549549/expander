#!/usr/bin/env sh
# wait-for.sh -- wait for a host:port to be available
set -e

host="${1:-localhost}"
shift || true
port="${1:-3306}"
shift || true

echo "Waiting for $host:$port..."

retries=0
until nc -z "$host" "$port"; do
  retries=$((retries+1))
  if [ $retries -gt 60 ]; then
    echo "Timeout waiting for $host:$port"
    exit 1
  fi
  sleep 1
done

echo "$host:$port is available"

exec "$@"
