const express = require('express');
const app = express();
const bodyParser = require("body-parser");
//const db = require("./db.js");
let fs = require('fs');

//cleanup nonlex str and convert to an array

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// const sentence = "Kim loves going to the cinema";
// const paragraph = "Optional. The value of this provided for the call to func. Note that this may not be the actual value seen by the method."

//nonlex.txt to string
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};


const nonlexStr = require("./nonlex.txt");
let nonlex = nonlexStr.split("\n").map(el => el.slice(0,-1));

// let sent = paragraph.match(/\S.*?\."?(?=\s|$)/g).map(el=> { return getLexDensity(el) })
// console.log(sent);

//Use the following url query http://localhost:8080/complexity?mode=verbose&q=Some text. Any chars.
app.get("/complexity", async (req, res) => {
    let input = req.query.q;
    let result = {};

    if(req.query.mode == "verbose"){
        //cleaning up and converting to an array
        let sentences = input.match(/\S.*?\."?(?=\s|$)/g)
                        .map(el=> { return getLexDensity(el) });
        //average could have been done with just calling getLexicalDensity one more time,
        //but assuming this calculation is costly and there's lots of data
        let average = Math.round(sentences.reduce((a,b) =>
                        { return a + b })/sentences.length*100)/100;
        result = {
                data:{
                    sentence_ld: sentences,
                    overall_ld: average
                }
        }
    } else {
        result = {
            data: {
                overall_ld: getLexDensity(input)
            }
        }
    }

    res.status(200).send(result);
});

function getLexDensity(input){
    //make an arr and cleanup spaces
    let total = input.split(' ').filter(n => { return n != '' });
    let lex = total.filter(val => !nonlex.includes(val));

    let lexDensity = Math.round(lex.length/total.length*100)/100;
    console.log(total, lex, "dens", lexDensity);
    return lexDensity;
};

app.listen(process.env.PORT || 8080, () => console.log("listening on 8080"));
