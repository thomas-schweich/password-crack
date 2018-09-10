var http = require('http')
    , fs = require('fs')
    , url = require('url')
    , port = 8080;

const { Client } = require('pg');

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
    const result = await client2.query('SELECT pat FROM patterns ORDER BY frq DESC;')
    await client2.end()
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
            var seqs = getSequences().then(function () {
                res.writeHead(200, { 'Content-type': 'application/json' })
                console.log("--SEQUENCES--\n" + seqs.toString())
                res.end(JSON.stringify(seqs), 'utf-8')
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