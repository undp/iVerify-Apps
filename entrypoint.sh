#!/bin/sh
mysql --host=$DB_HOST --user=$DB_USER --password=$DB_PASSWORD --port=$DB_PASSWORD $DB_NAME
 << eof
mysql use 
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS order;
DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS user_roles_roles;
DROP TABLE IF EXISTS triage-post-control;
DROP TABLE IF EXISTS roles_users_user;
eof

exec "$@"