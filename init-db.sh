#!/bin/bash

set -e
set -u

function create_database() {
    local database=$1
    echo "Creating database '$database'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE DATABASE $database;
EOSQL
}

# Create userdatabase if it doesn't exist
create_database "userdatabase"

# Create logdatabase if it doesn't exist
create_database "logdatabase"