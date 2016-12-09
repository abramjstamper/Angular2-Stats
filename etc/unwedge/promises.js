"use strict";

const Promise = require('bluebird');

// From the Bluebird anti-patterns documentation
function delay(ms, value) {
    var deferred = Promise.pending();
    setTimeout(function () {
        console.log("Resolve with", value);
        deferred.resolve(value);
    }, ms);
    return deferred.promise;
}

function test_join() {
    Promise.join(
        delay(500, 'JOIN ALPHA'),
        delay(1000, 'JOIN BETA'),
        delay(100, 'JOIN GAMMA'),
        delay(1500, 'JOIN DELTA'),
        (a, b, c, d) => console.log("RETURNED", a, b, c, d)
    ).then(() => Promise.join(
        delay(100, 'JOIN ALEPH'),
        delay(1500, 'JOIN BET'),
        delay(500, 'JOIN GIMMEL'),
        delay(1000, 'JOIN DALET'),
        (a, b, c, d) => console.log("RETURNED", a, b, c, d)
    ));
}

function test_all() {
    Promise.all([
        delay(500, 'ALL ALPHA'),
        delay(1000, 'ALL BETA'),
        delay(100, 'ALL GAMMA'),
        delay(1500, 'ALL DELTA')
    ]).then(() => Promise.all([
        delay(100, 'ALL ALEPH'),
        delay(1500, 'ALL BET'),
        delay(500, 'ALL GIMMEL'),
        delay(1000, 'ALL DALET')
    ]));
}

console.log("START");
test_all();
test_join();
console.log("FINISH");
