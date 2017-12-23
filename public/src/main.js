"use strict";

let languages = { };
let bindings = new JsDataBindings(document.getElementById("container"));
bindings.words = 6;

bindings.generateFunc = generatePassword;
bindings.onchanged(["capitalize", "whitespace", "separators", "words", "languages"], generatePassword);

document.getElementById("cap").addEventListener("checked", function (ev) {
    console.log(this.checked);
});

function getLangauge(callback) {
    let langs = bindings.languages;
    if (typeof langs === "string")
        langs = [ langs ];
    let returnList = [];
    let c = 0;

    for (let l in langs){
        let lang = langs[l];
        if (languages[lang] !== undefined){
            returnList = returnList.concat(languages[lang]);
            if (++c === langs.length)
                callback(returnList);
            continue;
        }
        let file = "words_" + lang + ".txt";
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
                let w = xmlHttp.responseText.split("\r\n");
                languages[lang] = w;
                returnList = returnList.concat(w);
                if (++c === langs.length)
                    callback(returnList);
            }
        };
        xmlHttp.open("GET", file, true);
        xmlHttp.send(null);
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

function getRandomNumbers(no) {
    if (window.crypto && window.crypto.getRandomValues){
        let random_numbers = new Uint32Array(no * 2);
        return window.crypto.getRandomValues(random_numbers);
    }
    else {
        let arr = [no * 2];
        for (let i = 0; i < no * 2; i++){
            arr[i] = Math.floor(Math.random() * 10242028);
        }
        return arr;
    }
}

function generatePassword() {
    getLangauge(wordlist => {
        let i = 0, words = parseInt(bindings.words);
        let random_numbers = getRandomNumbers(words);
        let splitters = bindings.separators.split(" ");

        let str = "";
        for (let j = 0; j < words; j++){
            let word = wordlist[random_numbers[i++] % wordlist.length];
            if (bindings.capitalize && (Math.floor(Math.random()*1000)) % 2 === 0)
                word = capitalize(word);

            str += word.trim();
            if (j === words - 1)
                break;
            str += !bindings.whitespace ? " " : splitters[random_numbers[i++] % splitters.length];
        }
        bindings.phrase = str.trim();
    })
}

bindings.copyPhrase = function (){
    let copy = $("#copied");
    copy.toggleClass("show");
    setTimeout(function () {
        copy.toggleClass("show");
    }, 25);
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).text()).select();
    document.execCommand("copy");
    $temp.remove();
};

generatePassword();