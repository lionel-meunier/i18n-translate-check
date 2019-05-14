#!/usr/bin/env node

import glob = require('glob');
import fs = require('fs');
import nodeHtmlParser = require('node-html-parser');

const parse = nodeHtmlParser.parse;


glob('src/**/*.html', (err, files) => {
    if (err) {
        throw err;
    }
    let allLignes: any[] = [];
    files.forEach(filePath => {
        const contents = fs.readFileSync(filePath, 'utf8');
        const root = parse(contents);

        // console.log(filePath, root.text);
        const lignes = root.text.split('\n')
            .map(text => text.trim())
            .filter(text => text !== '');

        const lignesFilter = lignes.filter(text => {
            const regAngularExp = new RegExp('\{\{(.*)\}\}', 'g');
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

    console.log(`Il y a ${allLignes.length} fichier html contenant des text non traduit`);
    allLignes.forEach((fileDesc) => {
        console.log(`Dans le fichier ${fileDesc.path}, il y a ${fileDesc.lignes.length} ligne non traduite`);
        console.log(fileDesc.lignes);
    });
});
