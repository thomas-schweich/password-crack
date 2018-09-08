#!/bin/bash

#################################
#                               #
#    RUN AFTER EXECUTING:       #
#                               #
#    $ python generate_sql.py   #
#                               #
#    in the project directory   #
#                               #
#################################

cat create_db.sql | heroku pg:psql
