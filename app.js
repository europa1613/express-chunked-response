var express = require('express');
var request = require('request');

var app = express();

app.use(express.static('public'));

app.get('/ping', function(req, res) {
    res.end('pong');
});

app.post('/jokes/chunked', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    prepareChunkedResponse(req, res);
});

app.get('/jokes/chunked', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    prepareChunkedResponse(req, res);
});

function prepareChunkedResponse(req, res) {
    return getJokes(100).then(function(response) {
        
        var jokesResponse = JSON.parse(response);
        var jokes = jokesResponse.value;

        //console.log(jokesResponse.type);

        for (var i = 0; i <= jokes.length; i++) {

            (function(numberOfJokes) {

                setTimeout(function() {

                    //res.write(JSON.stringify(jokes));

                    //console.log(numberOfJokes + '|' + JSON.stringify(jokes[numberOfJokes]));

                    if (jokes[numberOfJokes]) {
                        res.write(JSON.stringify(jokes[numberOfJokes]));
                        res.flushHeaders();
                    }

                    if (numberOfJokes === jokes.length) {
                        res.end();
                    }

                }, numberOfJokes * 1000);

            })(i)
        }
    }).catch(function(error) {
        console.log('Error Occurred in getting jokes', error);
    });
}

function getJokes(numberOfJokes) {
    return new Promise((resolve, reject) => {
        
        request.get({ url: 'http://api.icndb.com/jokes/random/' + numberOfJokes }, function(error, response, body) {
            
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }

        });
        
    });
}

app.listen(3001, () => {
    console.log('Server running on port %s', 3001);
});