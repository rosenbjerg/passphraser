"use strict";

var splitters = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '/', '%', '_', '-', '@', '$', '&', '?', '!', '42', '*', '+', '#', '='];
var words = 6;
var cap = false;
var ws = true;
// let wordlist = [];
var languages = {};

function getLangauge(langs, callback) {
    if (typeof langs === "string") langs = [langs];
    var returnList = [];
    var c = 0;

    var _loop = function _loop(l) {
        var lang = langs[l];
        if (languages[lang] !== undefined) {
            returnList = returnList.concat(languages[lang]);
            if (++c === langs.length) callback(returnList);
            return 'continue';
        }
        var file = "words_" + lang + ".txt";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                var w = xmlHttp.responseText.split("\r\n");
                languages[lang] = w;
                returnList = returnList.concat(w);
                if (++c === langs.length) callback(returnList);
            }
        };
        xmlHttp.open("GET", file, true);
        xmlHttp.send(null);
    };

    for (var l in langs) {
        var _ret = _loop(l);

        if (_ret === 'continue') continue;
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

function getRandomNumbers(no) {
    if (window.crypto && window.crypto.getRandomValues) {
        var random_numbers = new Uint32Array(no * 2);
        return window.crypto.getRandomValues(random_numbers);
    } else {
        var arr = [no * 2];
        for (var i = 0; i < no * 2; i++) {
            arr[i] = Math.floor(Math.random() * 10242028);
        }
        return arr;
    }
}

function generatePassword(wordlist) {
    var i = 0;
    var random_numbers = getRandomNumbers(words);

    var str = "";
    for (var j = 0; j < words; j++) {
        var word = wordlist[random_numbers[i++] % wordlist.length];
        if (cap && Math.floor(Math.random() * 1000) % 2 === 0) word = capitalize(word);

        str += word.trim();
        if (j === words - 1) break;
        if (!ws) str += splitters[random_numbers[i++] % splitters.length];else str += " ";
    }
    $("#pw").html(str);
}

document.querySelector("select").addEventListener("change", function () {
    getLangauge(this.value, function (w) {
        generatePassword(w);
    });
});

$(document).on('input', 'input', function () {
    $("button").click();
});

$("input[type=checkbox]").change(function () {
    $("button").click();
});

$("#whitespace").change(function () {
    $("#sep").prop("disabled", !$(this).is(":checked"));
});

$("button").click(function () {
    words = parseInt($("#words").val());
    cap = $("#cap").is(":checked");
    ws = !$("#whitespace").is(":checked");
    splitters = $("#sep").val().split(' ');
    getLangauge($("select").val(), function (w) {
        generatePassword(w);
    });
});

$("#pw").click(function () {
    var copy = $("#copied");
    copy.toggleClass("show");
    setTimeout(function () {
        copy.toggleClass("show");
    }, 25);
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).text()).select();
    document.execCommand("copy");
    $temp.remove();
});
getLangauge("english", function (words) {
    getLangauge($("select").val(), function (w) {
        generatePassword(w);
    });
});
//# sourceMappingURL=main.js.map