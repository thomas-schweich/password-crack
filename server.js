var http = require('http')
<<<<<<< HEAD
    , fs = require('fs')
    , url = require('url')
    , port = 8080;

const { Client } = require('pg');

var cachedJson = null

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    client.end();
});

function isLetter(char) {
    return char.match(/[a-zA-Z]/i)
}

function isNumber(char) {
    return char.match(/[0-9]/i)
}

function decompose(pass, idx) {
    const originalIdx = idx;
    while(isLetter(pass.charAt(idx))) {
        idx++
    }
    if(idx > originalIdx) return pass.substring(originalIdx, idx)
    while(isNumber(pass.charAt(idx))) {
        idx++
    }
    if(idx > originalIdx) return pass.substring(originalIdx, idx)
    while(!isLetter(pass.charAt(idx)) && !isNumber(pass.charAt(idx))) {
        idx++
    }
    if(idx > originalIdx) return pass.substring(originalIdx, idx)
    return null
}

async function insertLetters(s) {
    const letterClient = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    await letterClient.connect()
    const query = {
        text: 'INSERT INTO a' + s.length.toString() + ' VALUES($1)',
        values: [s]
    }
    await letterClient.query(query)
    await letterClient.end()
}

async function insertNumbers(s) {
    const numberClient = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    await numberClient.connect()
    const query = {
        text: 'INSERT INTO n' + s.length.toString() + ' VALUES($1)',
        values: [s]
    }
    await numberClient.query(query)
    await numberClient.end()
}

async function insertSpecials(s) {
    const specialClient = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    await specialClient.connect()
    const query = {
        text: 'INSERT INTO a' + s.length.toString() + ' VALUES($1)',
        values: [s]
    }
    await specialClient.query(query)
    await specialClient.end()
}

async function insertPW(pass) {
    var substrs = []
    for(var i = 0; i < pass.length;) {
        var sub = decompose(pass, i)
        substrs.push(sub)
        i += sub.length
    }
    console.log('Substrs: ' + substrs.toString())
    for (let s of substrs) {
        if (isLetter(s.charAt(0))) {
            insertLetters(s)
        } else if (isNumber(s.charAt(0))) {
            insertNumbers(s)
        } else {
            insertSpecials(s)
        }
    }
}

async function getSequences() {
    const client2 = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    await client2.connect()
    const query = {
        text: 'SELECT pat FROM patterns ORDER BY frq DESC;',
        rowMode: 'array'
    } 
    const result = await client2.query(query)
    await client2.end()
    return result
}

async function getValuesFrom(atom) {
    const client3 = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    await client3.connect()
    const query = {
        text: 'SELECT seq FROM ' + atom + ';',
        rowMode: 'array'
    } 
    const result = await client3.query(query)
    await client3.end()
    return result
}


async function getAllValues() {
    result = {}
    result['SEQUENCES'] = await getSequences()
    for (let a of ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'n1', 'n2', 'n3', 'n4', 'n5','n6','n7', 'n8','n9','n10','s1','s2','s3','s4','s5','s6','s7','s8','s9','s10']) {
        result[a] = await getValuesFrom(a)
    }
    return result
}

async function getRecents() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    await client.connect()
    const query = {
        text: 'SELECT seq FROM a6 LIMIT 10;',
        rowMode: 'array'
    } 
    const result = await client.query(query)
    await client.end()
    return result
}


var server = http.createServer(function (req, res) {
    var uri = url.parse(req.url)

    switch (uri.pathname) {
        case '/':
            sendFile(res, 'index.html')
            break
        case '/index.html':
            sendFile(res, 'index.html')
            break
        case '/mydata.json':
            sendJson(res, './mydata.json')
            break
        case '/hacker.js':
            sendFile(res, 'hacker.js')
            break
        case '/passwords.json':
            if(cachedJson) {
                console.log('Sending cached value')
                res.writeHead(200, { 'Content-type': 'application/json' })
                res.end(JSON.stringify(cachedJson), 'utf-8')
            } else {
                getAllValues().then(function (result) {
                    console.log('Got from database')
                    cachedJson = result
                    console.log('Writing to res')
                    res.writeHead(200, { 'Content-type': 'application/json' })
                    res.end(JSON.stringify(result), 'utf-8')
                    console.log('Sent data: ' + result.toString())
                })
            }
            break
        case '/recents':
            getRecents().then(function(result) {
                res.writeHead(200, { 'Content-type': 'text/html' })
                res.end(JSON.stringify(result), 'utf-8')
            })
            break
        default:
            if(uri.pathname.startsWith('/insertPass/')) {
                if(uri.pathname.length > 12 && uri.pathname.length < 22) {
                    var password = uri.pathname.substring(12)
                    insertPW(password).then(function () {
                        console.log('Added password ' + password)
                    })
                    res.end('Added password ' + password)
                } else {
                    res.end('Invalid password')
                }
            } else {
                res.end('404 not found')
            }
    }
=======
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080;


// NOTE: your dataset can be as simple as the following, you need only implement functions for addition, deletion, and modification that are triggered by outside (i.e. client) actions, and made available to the front-end
var data = [
  {'model': 'toyota', 'year': 1999, 'mpg': 23},
  {'model': 'honda', 'year': 2004, 'mpg': 30},
  {'model': 'ford', 'year': 1987, 'mpg': 14}
]

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'public/index.html')
      break
    case '/index.html':
      sendFile(res, 'public/index.html')
      break
    case '/css/style.css':
      sendFile(res, 'public/css/style.css', 'text/css')
      break
    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js', 'text/javascript')
      break
    default:
      res.end('404 not found')
  }
>>>>>>> d571ac0cf81965487244c0df13604a14885da6a7
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

// subroutines
<<<<<<< HEAD

function sendFile(res, filename) {

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, { 'Content-type': 'text/html' })
        res.end(content, 'utf-8')
    })

}

function sendJson(res, filename) {

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(content, 'utf-8')
    })

}
=======
// NOTE: this is an ideal place to add your data functionality

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}
>>>>>>> d571ac0cf81965487244c0df13604a14885da6a7
