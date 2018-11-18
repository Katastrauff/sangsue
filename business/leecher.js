
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xpath = require('xpath');
var dom = require('xmldom').DOMParser

module.exports = function (url) {
    return new leecher().leech(url);
}


class leecher {
    constructor() {

    }

    leech(url) {
        var response, leech = [];
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        
        xhr.send();
        response = xhr.responseText;
        var doc = new dom().parseFromString(response);
        var nodes = xpath.select("//td[@class='column-2']/parent::tr", doc);
        nodes.forEach(function (node) {
            leech.push({
                da: xpath.select1("td[@class='column-2']/text()[1]", node).textContent.trim(),
                en: xpath.select1("td[@class='column-3']/text()[1]", node).textContent.trim(),
            });
        })

        return leech;
    }
};