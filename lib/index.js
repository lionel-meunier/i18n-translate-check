#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require("glob");
var fs = require("fs");
var nodeHtmlParser = require("node-html-parser");
var parse = nodeHtmlParser.parse;
glob('src/**/*.html', function (err, files) {
    if (err) {
        throw err;
    }
    var allLignes = [];
    files.forEach(function (filePath) {
        var contents = fs.readFileSync(filePath, 'utf8');
        var root = parse(contents);
        // console.log(filePath, root.text);
        var lignes = root.text.split('\n')
            .map(function (text) { return text.trim(); })
            .filter(function (text) { return text !== ''; });
        var lignesFilter = lignes.filter(function (text) {
            var regAngularExp = new RegExp('\{\{(.*)\}\}', 'g');
            return !regAngularExp.test(text);
        });
        if (lignesFilter.length > 0) {
            allLignes.push({
                path: filePath,
                lignes: lignesFilter
            });
        }
    });
    // console.log('all lignes', allLignes);
    console.log("Il y a " + allLignes.length + " fichier html contenant des text non traduit");
    allLignes.forEach(function (fileDesc) {
        console.log("Dans le fichier " + fileDesc.path + ", il y a " + fileDesc.lignes.length + " ligne non traduite");
        console.log(fileDesc.lignes);
    });
});
