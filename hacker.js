var example_dict = {
    '5c': ['hello', 'yoyoy', 'heloo'],
    '2n': ['56', '27', '29'],
    'PATTERNS': ['5c', '2n', '5c2n']
}

var password = 'hello27'

function atoms(pattern) {
    var l = []
    for(var i = 0; i < pattern.length; i+= 2) {
        l.push(pattern.charAt(i) + pattern.charAt(i + 1))
    }
    return l
} 

/*
Combines the given values and attacks with them.
Reutrns the value if the attack succeeded, null otherwise.
*/
function attackWithValues(values) {
    var pw = values.join()
    if(pw == password) {
        return pw
    }
    return null
}

/* 
Runs a dictionary attack while holding the given values constant.
Values which are not to be held constant should be null.
Returns a string of the correct password if found, or null otherwise.
*/
function attackFixedAtoms(atoms, values) {
    var hasAllValues = true;
    for(var i = 0; i < atoms.length; i++) {
        if(values[i] == null) {
            hasAllValues = false;
            for(var t in example_dict[atoms[i]]) {
                values[i] = t;
                var outcome = attackFixedAtoms(atoms, values)
                if(outcome) {
                    return outcome
                }
            }
        }
    }
    if(hasAllValues) {
        return attackWithValues(values)
    }
    return null
}

/*
Attempts to crack using the given pattern
*/
function attemptCrack(pattern) {
    return attackFixedAtoms(atoms(pattern), new Array(pattern.length / 2).fill(null))
}

/*
Attempts to hack the password. Ruturns the password, or null if it isn't found
*/
function dictHack() {
    for(var p in example_dict['PATTERNS']) {
        var result = attemptCrack(p)
        if (result) {
            return result
        }
    }
    return null
}
