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
async function attackWithValues(values, password) {
    var pw = values.join('')
    console.log("Attacking with: " + pw)
    setTimeout(function() {
            $("#output").text(pw)
    }, 1)
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
async function attackFixedAtoms(data, password, atoms, values) {
    var hasAllValues = true;
    for(var i = 0; i < atoms.length; i++) {
        if(values[i] == null) {
            console.log('Got null entry, looking through ' + atoms[i].toString())
            hasAllValues = false;
            if(data[atoms[i]]) {
                for(let t of data[atoms[i]].rows) {
                    console.log("Component added: " + t)
                    var newValues = values.slice()
                    newValues[i] = t[0];
                    await new Promise((resolve) => {setTimeout(resolve, 0)})
                    var outcome = await attackFixedAtoms(data, password, atoms, newValues)
                    if(outcome) {
                        return outcome
                    }
                }
            }
        }
    }
    if(hasAllValues) {
        return await attackWithValues(values, password)
    }
    return null
}

/*
Attempts to crack using the given pattern
*/
async function attemptCrack(data, password, pattern) {
    return await attackFixedAtoms(data, password, atoms(pattern), new Array(Math.ceil(pattern.length / 2)).fill(null))
}

/*
Attempts to hack the password. Ruturns the password, or null if it isn't found
*/
async function dictHack(data, password) {
    console.log(data['SEQUENCES'].toString())
    for(let p of data['SEQUENCES'].rows) {
        console.log("Using pattern: " + p)
        var result = await attemptCrack(data, password, p[0])
        if (result) {
            return result
        }
    }
    return null
}


$(document).ready(function () {
    $("#commence").click(function(e) {
        e.preventDefault()
        var password = $("#MD5").val()
        if (!password) {
            password = md5($("#plainText").val())
            $("#MD5").val(password)
        }
        $.getJSON('passwords.json', function(data) {
            console.log("Got the click")
            $("#output").text("PASSWORDS N STUFF")
            setTimeout(function() {
                dictHack(data, password).then(function(result) {
                    if (result) {
                        console.log("found password: " + result)
                    } else {
                        console.log("Couldn't find password")
                    }
                })
            }, 0)
        })
    })
})
