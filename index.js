var express = require('express');
var app = express();
var sentence = ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"];

app.get('/', (req, response) => {
    /*var i = 0;
    var regId = setInterval(() => {
        res.write(sentence[i++] + ' ');
        if (i >= sentence.length) {
            res.end();
            clearInterval(regId);
            return;
        }
    }, 5000);*/

    var html =
        '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<title>Chunked transfer encoding test</title>' +
        '</head>' +
        '<body>';

    response.write(html);

    html = '<h1>Chunked transfer encoding test</h1>'

    response.write(html);

    // Now imitate a long request which lasts 5 seconds.
    setTimeout(function() {
        html = '<h5>This is a chunked response after 5 seconds. The server should not close the stream before all chunks are sent to a client.</h5>'

        response.write(html);

        // since this is the last chunk, close the stream.
        html =
            '</body>' +
            '</html';

        response.end(html);

    }, 5000);

    // this is another chunk of data sent to a client after 2 seconds before the
    // 5-second chunk is sent.
    setTimeout(function() {
        html = '<h5>This is a chunked response after 2 seconds. Should be displayed before 5-second chunk arrives.</h5>'

        response.write(html);

    }, 2000);
});

app.listen(3000, () => {
    console.log('Server running on port %s', 3000);
});