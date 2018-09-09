#!bin/bash

#########################################
# This script is run after parse_pws.py #
# It removes duplicate entries from the #
# generated password lists.             #
#########################################

for file in pwlists/*.pwl; do 
    awk '!a[$0]++' "$file" > "pwlists/$file.u"; 
done;
