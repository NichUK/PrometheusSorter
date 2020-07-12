'use strict';
var express = require('express');
var http = require('http');
var _ = require('lodash');
var router = express.Router();

var prometheusUrl = process.argv.length > 2 ? process.argv[2] : '';
if (!prometheusUrl) {
    console.error('Requires prometheus url');
    return;
}

router.get('/query', function (req, res) {
    DoQuery(req, res);
});

router.get('/query_range', function (req, res) {
    DoQuery(req, res);
});

router.get('/series', function (req, res) {
    DoQuery(req, res);
});

router.get('/labels', function (req, res) {
    DoQuery(req, res);
});

router.get('/label/*', function (req, res) {
    DoQuery(req, res);
});

router.get('/targets*', function (req, res) {
    DoQuery(req, res);
});

router.get('/rules', function (req, res) {
    DoQuery(req, res);
});

router.get('/alerts', function (req, res) {
    DoQuery(req, res);
});

router.get('/metadata', function (req, res) {
    DoQuery(req, res);
});

router.get('/alertmanagers', function (req, res) {
    DoQuery(req, res);
});

router.get('/status*', function (req, res) {
    DoQuery(req, res);
});


function DoQuery(req, res) {
    if (req['query']) {
        if (req['query']['query']) {
            const querySplitRegex = /^(.*?)(orderby\((.*)\)|$)/g // group[1]==query, group[2]==orderby, group[3]==orderby columns
            var querySplit = querySplitRegex.exec(req.query.query);
            if (querySplit[2]) {
                var query = querySplit[1];
                var orderBy = querySplit[3];
                var params = GetParamsWithoutQuery(req.query);
                var url = `${prometheusUrl}${req.path}?query=${query}&${params}`;
                PassThru(req, res, url, orderBy);
            } else {
                PassThru(req, res);
            }
        } else {
            PassThru(req, res);
        }
    }
}

function GetParamsWithoutQuery(params) {
    var output = '';
    _.forEach(params, (value, key) => {
        if (key != 'query') {
            if (output.length > 0) {
                output += '&';
            }
            output += `${key}=${value}`;
        }
    });

    return output;
}

function PassThru(req, res, url, orderBy) {
    url = url == null ? `${prometheusUrl}${req.url}` : url;
    console.log('url', url);
    http.get(url, (response) => {
        let data = '';

        // A chunk of data has been recieved.
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on('end', () => {
            var json = JSON.parse(data);
            if (!json.data) {
                res.json(json);
            }

            var jsonResult = json.data.result;
            if (orderBy) {
                const orderBySplitRegex = /([^,]+)/g
                var orderBySplit = orderBySplitRegex.exec(orderBy);
                var orderFuncArray = [];
                var orderSortArray = [];
                for (var i = 1; i < orderBySplit.length; i++) {
                    var value = orderBySplit[i];
                    const orderFieldSplitRegex = /(num)?(\(*)([^,)]+)\)*/ // group[1]==function name, group[2]=='(' or nothing, group[3]==field
                    var orderFieldSplit = orderFieldSplitRegex.exec(value);
                    CreateOrderField(orderFieldSplit[1], orderFieldSplit[2], orderFieldSplit[3], orderFuncArray, orderSortArray);
                }

                jsonResult = _.sortBy(jsonResult, orderFuncArray);
            }

            json.data.result = jsonResult;
            res.json(json);
        });
    });
}

function CreateOrderField(functionName, functionPresentFlag, value, orderFuncArray, orderSortArray) {
    if (functionPresentFlag) {
        switch (functionName) {
            case 'd':
                orderFuncArray.push(o => o.metric[value]);
                orderSortArray.push('desc');
                break;
            case 'num':
                orderFuncArray.push(o => Number(o.metric[value]));
                orderSortArray.push('asc');
                break;
            case 'numd':
                orderFuncArray.push(o => Number(o.metric[value]));
                orderSortArray.push('desc');
                break;
        }
    } else {
        orderFuncArray.push(o => o.metric[value]);
        orderSortArray.push('asc');
    }
}

module.exports = router;
