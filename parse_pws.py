import os

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
        print('c: %s, i: %d' % (c, i))
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
            print('Designation: %s\nSegment: %s' % (desnum, seg))
            result += [[desnum, seg]]
    print(result)
    return result

if __name__ == '__main__':
    identifiers = ('a', 'n', 's')
    headers = ['%s%d' % (identifier, i) for identifier in identifiers for i in range(1, MAX_LEN + 1)]

    files = {h: open('pwlists/%s.pwl' % h, 'w') for h in headers}

    with open('pwList.txt', 'r') as pwList:
        for pw in pwList:
            print(pw)
            decomp = decompose(pw.strip())
            for seq in decomp:
                files[seq[0]].write(seq[1] + '\n')

    for h in files.items():
        h.close()

