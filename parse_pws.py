import os
import sys
from collections import defaultdict

if not os.path.exists('pwlists'):
    os.makedirs('pwlists')

MAX_LEN = 10

def alphaSegment(idx, password):
    """ Returns the chain of alphabetical letters beginning at idx in password """
    string = []
    while idx < len(password):
        c = password[idx]
        if not c.isalpha():
            return ''.join(string)
        string += [c]
        idx += 1
    return ''.join(string)

def numericSegment(idx, password):
    """ Returns the chain of alphabetical letters beginning at idx in password """
    string = []
    while idx < len(password):
        c = password[idx]
        if not c.isdigit():
            return ''.join(string)
        string += [c]
        idx += 1
    return ''.join(string)

def specialSegment(idx, password):
    """ Returns the chain of alphabetical letters beginning at idx in password """
    string = []
    while idx < len(password):
        c = password[idx]
        if c.isalpha() or c.isdigit():
            return ''.join(string)
        string += [c]
        idx += 1
    return ''.join(string)


def decompose(password):
    """ Returns [[atom, str],] where atom indicates the format of an atom, and str is its value, such as:
        [['5c', 'aaaaa'], ['2s', '#$'],...]
    For each atom in password
    """
    i = 0
    result = []
    while i < len(password):
        c = password[i]
        seg = ''
        des = ''
        if c.isalpha():
            seg = alphaSegment(i, password)
            des = 'a'
        elif c.isdigit():
            seg = numericSegment(i, password)
            des = 'n'
        else:
            seg = specialSegment(i, password)
            des = 's'
        i += len(seg)
        if len(seg) <= 10:
            desnum = des + str(len(seg))
            result += [[desnum, seg]]
    return result


def sequence(decomp_pw):
    """ Generates the sequence string for the given list of decomposed password segments """
    return ''.join([s[0] for s in decomp_pw])

if __name__ == '__main__':
    identifiers = ('a', 'n', 's')
    headers = ['%s%d' % (identifier, i) for identifier in identifiers for i in range(1, MAX_LEN + 1)]

    files = {h: open('pwlists/%s.pwl' % h, 'w') for h in headers}

    sequences = defaultdict(int)

    with open('pwList.txt', 'r') as pwList:
        for pw in pwList:
            decomp = decompose(pw.strip())
            sequences[sequence(decomp)] += 1
            for seq in decomp:
                files[seq[0]].write(seq[1] + '\n')
    
    with open('pwlists/sequences', 'w') as seqfile:
        s = sorted(sequences.items(), key=lambda kv: kv[1], reverse=True)
        for line in s:
            seqfile.write(line[0] + '\n')

    for h in files.values():
        h.close()

