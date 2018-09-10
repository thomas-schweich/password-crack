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

function addSequences(seqobj) {
    const client2 = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    console.log("seq 1")
    client2.connect()
    console.log("seq 2")
    client2.query('SELECT pat FROM patterns ORDER BY frq DESC;', (err,res) => {
        // Whats up with this
        console.log("seq 3")
        if (err) throw err;
        console.log("seq 4")
        seqobj.SEQUENCES = res.rows
        console.log("seq 5")
        client.end();
    })
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
            console.log("err 1")
            var response;
            console.log("err 2")
            addSequences(response)
            console.log("err 3")
            res.writeHead(200, { 'Content-type': 'application/json' })
            console.log("err 4")
            res.end(JSON.stringify(response), 'utf-8')
            console.log("err 5")
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