"""
This module generated create_db.sql

Sequence tables are given as e.g. (a3) -> (seq)
An additional table called `patterns` is created as (patterns) -> (pat, frq)
"""

from subprocess import Popen, check_output, PIPE

MAX_LEN = 10
CREATE_FMT = 'CREATE TABLE IF NOT EXISTS {table_name} ( {columns} );\n'
COL_FMT = '{name} {type}{comma}'

seq_col = COL_FMT.format(name='seq', type='TEXT', comma='')
pat_cols = ''.join([
    COL_FMT.format(name='pat', type='TEXT', comma=', '), 
    COL_FMT.format(name='frq', type='TEXT', comma=''),
])

identifiers = ('a', 'n', 's')
table_names = ['%s%d' % (identifier, i) for identifier in identifiers for i in range(1, MAX_LEN + 1)]

with open('create_db.sql', 'w') as outfile:
    for name in table_names:
        outfile.write(CREATE_FMT.format(table_name=name, columns=seq_col))
    outfile.write(CREATE_FMT.format(table_name='patterns', columns=pat_cols))
