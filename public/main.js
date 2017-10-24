var splitters = ['1','2','3','4','5','6','7','8','9','0','/','%','_','-','@','$','&','?','!','42','*','+','#', '='];
var words = 5;
var cap = false;
var ws = false;
var wordlist = [];

$.get("/word_list", function (data) {
    wordlist = data.split("\n");
    generatePassword();
});

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

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
$(document).on('input', 'input', function () {
    $("button").click();
});
$("input[type=checkbox]").change(function () {
    $("button").click();
});
$("button").click(function () {
    words = parseInt($("#words").val());
    cap = $("#cap").is(":checked");
    ws = $("#whitespace").is(":checked");
    splitters = $("#sep").val().split(' ');
    generatePassword();
});

$("#pw").click(function () {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).text()).select();
    document.execCommand("copy");
    $temp.remove();
});
