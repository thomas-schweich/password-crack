var example_dict = {
    '5c': ['hello', 'yoyoy', 'heloo'],
    '2n': ['56', '27', '29'],
    'PATTERNS': ['5c', '2n', '5c2n']
}

var password = ''

function atoms(pattern) {
    var l = []
    console.log("First character of pattern: " + pattern.charAt(0))
    for(var i = 0; i < pattern.length; i+= 2) {
        l.push(pattern.charAt(i).toString() + pattern.charAt(i + 1).toString())
    }
    console.log("Got atoms: " + l.toString())
    return l
} 

/*
Combines the given values and attacks with them.
Reutrns the value if the attack succeeded, null otherwise.
*/
async function attackWithValues(values) {
    var pw = values.join('')
    console.log("Attacking with: " + pw)
    await setTimeout(function() {}, 100)
    $("#output").text(pw)
    if(md5(pw) == password) {
        return pw
    }
    return null
}

/* 
Runs a dictionary attack while holding the given values constant.
Values which are not to be held constant should be null.
Returns a string of the correct password if found, or null otherwise.
*/
async function attackFixedAtoms(data, atoms, values) {
    var hasAllValues = true;
    for(var i = 0; i < atoms.length; i++) {
        if(values[i] == null) {
            console.log('Got null entry, looking through ' + atoms[i].toString())
            hasAllValues = false;
            if(data[atoms[i]]) {
                for(let t of data[atoms[i]].rows) {
                    console.log("Component added: " + t)
                    values[i] = t[0];
                    await setTimeout(function() {}, 100)
                    var outcome = attackFixedAtoms(data, atoms, values)
                    if(outcome) {
                        return outcome
                    }
                }
            }
        }
    }
    if(hasAllValues) {
        return await attackWithValues(values)
    }
    return null
}

/*
Attempts to crack using the given pattern
*/
async function attemptCrack(data, pattern) {
    return await attackFixedAtoms(data, atoms(pattern), new Array(Math.ceil(pattern.length / 2)).fill(null))
}

/*
Attempts to hack the password. Ruturns the password, or null if it isn't found
*/
async function dictHack(data) {
    console.log(data['SEQUENCES'].toString())
    for(let p of data['SEQUENCES'].rows) {
        console.log("Using pattern: " + p)
        var result = await attemptCrack(data, p[0])
        if (result) {
            return result
        }
    }
    return null
}


$(document).ready(function () {
    $("#commence").click(function(e) {
        e.preventDefault()
        password = $("#MD5").val()
        if (!password) {
            password = md5($("#plainText").val())
            $("#MD5").val(password)
        }
        $.ajax({
            url: 'https://desolate-citadel-57120.herokuapp.com/passwords.json',
            dataType: 'application/json',
            complete: function(data) {
                console.log("Got the click")
                $("#output").text("PASSWORDS N STUFF")
                dictHack(JSON.parse(data.responseText)).then(function(result) {
                    if (result) {
                        console.log("found password: " + result)
                    } else {
                        console.log("Couldn't find password")
                    }
                })
            }
        })
    })
})
