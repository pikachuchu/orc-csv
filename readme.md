# orc-csv

Upload CSVs to Orchestrate. Comes with a simple web server for exploring datasets.

## Install

    npm install -g orc-csv

## Usage

### Upload CSVs

You can use pipes to feed orc-csv data...

    cat path/to/file.csv | orc-csv -u YOUR_API_KEY

... or pass files as an argument:

    orc-csv -u YOUR_API_KEY -f path/to/file.csv

Either will transform the CSV's contents into JSON objects, and upload them to Orchestrate. For example, this...

    name,role,aptitude,aptitude as a cold-blooded killer
    Catherine,technical writer,9,3
    Diana,programmer,6,10

... would insert two documents that look like this:

``` javascript
{
    "name":"Catherine",
    "role":"technical writer",
    "aptitude":9,
    "aptitude as a cold-blooded killer":3
}
{
    "name":"Diana",
    "role":"programmer",
    "aptitude":6,
    "aptitude as a cold-blooded killer":10
}
```

### Explore Data

To explore your data locally, start orc-csv's web server:

    orc-csv server -u YOUR_API_KEY
    # now listening on port 3000

The server proxies all requests to Orchestrate using your API key, so you can explore your data right from your browser.

### Use Programmatically

You can require and use orc-csv from other packages. Install like this:

    npm install orc-csv

Use like this:

``` javascript
var orc_csv = require('orc-csv');

// upload a file
orc_csv.upload.file(PATH_TO_FILE)
.fin(function () {
    console.log('Upload complete');
});

// upload a stream
var stream = fs.createReadStream(PATH_TO_FILE);
orc_csv.upload.stream(stream)
.fin(function () {
    console.log('Upload complete');
});

// start the web server
orc_csv.server({
    port: 5000
})
.then(function (server) {
    console.log('Listening on port 5000');
});
```

Both of orc_csv's `upload` methods return [kew promises](https://github.com/Medium/kew).

## Options

### -u, --api-key <api-key>

The API key used to authenticate requests with Orchestrate. Defaults to the environment variable `ORCHESTRATE_API_KEY`.

### -f, --file <path>

The path to the file to upload to Orchestrate.

### CSV options

orc-csv supports all configuration options that [node-csv-parser](https://github.com/wdavidw/node-csv-parse) accepts. 
[See them all](https://github.com/wdavidw/node-csv-parse#parser-options). 

For example, this sets the CSV delimiter to be ";":

    orc-csv -u $API_KEY -f $CSV_PATH --delimiter ";"    

## Tests

    npm test

## License

[ASLv2](http://www.apache.org/licenses/LICENSE-2.0)
