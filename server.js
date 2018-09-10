var http = require('http')
    , fs = require('fs')
    , url = require('url')
    , port = 8080;

const { Client } = require('pg');

const NodeCache = require('node-cache')

const myCache = new NodeCache()

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
        text: 'SELECT seq FROM ' + atom,
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
            myCache.get('passwords.json', function(err, value) {
                if(!err) {
                    res.writeHead(200, { 'Content-type': 'application/json' })
                    res.end(JSON.stringify(value), 'utf-8')
                } else {
                    getAllValues().then(function (result) {
                        myCache.set("passwords.json", result, 10000)
                        res.writeHead(200, { 'Content-type': 'application/json' })
                        res.end(JSON.stringify(result), 'utf-8')
                    })
                }
            })
            break
        default:
            res.end('404 not found')
    }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

// subroutines

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