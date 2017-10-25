var splitters = ['1','2','3','4','5','6','7','8','9','0','/','%','_','-','@','$','&','?','!','42','*','+','#', '='];
var words = 6;
var cap = false;
var ws = true;
var wordlist = [];

$.get("/words_english.txt", function (data) {
    wordlist = data.split("\n");
    generatePassword();
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

function getRandomNumbers(no) {
    if (window.crypto && window.crypto.getRandomValues){
        var random_numbers = new Uint32Array(no * 2);
        return window.crypto.getRandomValues(random_numbers);
    }
    else {
        var arr = [no * 2];
        for (var i = 0; i < no * 2; i++){
            arr[i] = Math.floor(Math.random() * 10242028);
        }
        return arr;
    }
}

function generatePassword() {
    var i = 0;
    var random_numbers = getRandomNumbers(words);

    var str = "";
    for (var j = 0; j < words; j++){
        var word = wordlist[random_numbers[i++] % wordlist.length];
        if (cap && (Math.floor(Math.random()*1000)) % 2 === 0)
            word = capitalize(word);
        str += word;
        if (j === words - 1)
            break;
        if (!ws)
            str += splitters[random_numbers[i++] % splitters.length];
        else
            str += " ";
    }
    $("#pw").text(str);

}

$("select").change(function () {
    var langs = $(this).val();
    var i = 0, t = langs.length;
    console.log(langs);
    wordlist = [];
    langs.forEach(function (lang) {
        var file = "words_" + lang + ".txt";
        $.get("/" + file, function (data) {
            wordlist = wordlist.concat(data.split("\n"));
            i++;
            if (i === t)
                generatePassword();
        });
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
    generatePassword();
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
