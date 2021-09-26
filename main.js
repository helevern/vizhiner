var vizhener = {
    ru: "_1234567890АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя".split(""),
    en: "_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),
    square: [],
    genSqViz: function(lang) {
        var l = this[lang],
            square = [];
        for (var i = 0; i < l.length; i++) {
            this.square[i] = l.slice(i).concat(l.slice(0, i));
        }
    },

    encryption: function(lang, text, key) {if (lang !== "ru" && lang !== "en" || text.length !== key.length) return false;
        this.genSqViz(lang);
        //console.log('this.square ', this.square);
        var s = "";
        for (var i = 0; i < text.length; i++) {
            if ('undefined' !== typeof this[lang].indexOf(text[i]) && 'undefined' !== typeof this[lang].indexOf(key[i])) {
                if ('undefined' !== typeof this.square[this[lang].indexOf(text[i])] &&
                    'undefined' !== typeof this.square[this[lang].indexOf(text[i])][this[lang].indexOf(key[i])]) {
                    s += this.square[this[lang].indexOf(text[i])][this[lang].indexOf(key[i])];
                }
            }
        }
        return s;
    },

    decryption: function(lang, key, cipher) {
        if (lang !== "ru" && lang !== "en" || cipher.length !== key.length) return false;
        this.genSqViz(lang);
        var s = "";
        for (var i = 0; i < cipher.length; i++) {
            if ('undefined' !== typeof this[lang].indexOf(key[i])) {
                var row = this[lang].indexOf(key[i]);
                if ('undefined' !== typeof this.square[row].indexOf(cipher[i])) {
                    var coll = this.square[row].indexOf(cipher[i]);
                    s += this[lang][coll];
                }
            }

        }
        return s;
    }
};

var FillKeyByTextLength = function(params, callback) {
    var key = params.key;
    var text = params.text;
    var mas = Array();
    var str = '';

    i = 0;
    j = 0;
    while (i < text.length) {
        if (j >= key.length) {
            j = 0;
        }
        str = str + '' + key[j];
        j++;
        i++;
    }
    callback(str);
};
$(document).ready(function() {
    var tbl = $('#table1');
    $('#codebutton').on('click', function() {
        var alphabet = $('#alphabet_data') || null;
        var key = $('#key_data') || null;
        var input = $('#input_data') || null;
        if ('undefined' !== typeof alphabet && '' !== alphabet.val() &&
            'undefined' !== typeof key && '' !== key.val() &&
            'undefined' !== typeof input && '' !== input.val()) {
            $('#span1').html('' + alphabet.val());
            var input_mas = Array();
            var is_array = false;
            if (-1 < (input.val()).indexOf(' ')) {
                input_mas = (input.val()).trim().split(' ');
                is_array = true;
            } else {
                input_mas = (input.val()).trim();
            }
            var replaced_input = '';
            if (true === is_array) {
                for (var i = 0; i < input_mas.length; i++) {
                    var params = {
                        'key': key.val(),
                        'text': input_mas[i]
                    };
                    var call = FillKeyByTextLength(params, function(result) {
                        $('#key_data_long').val('' + result);
                        //console.log('result ',result);
                        if (0 < i) {
                            replaced_input = replaced_input + ' ';
                        }
                        replaced_input = replaced_input + vizhener.encryption(alphabet.val(), input_mas[i], result);

                    });
                }
            } else {
                var params = {
                    'key': key.val(),
                    'text': input_mas
                };
                var call = FillKeyByTextLength(params, function(result) {
                    $('#key_data_long').val('' + result);
                    //console.log('result ',result);
                    replaced_input = replaced_input + '' + vizhener.encryption(alphabet.val(), input_mas, result);
                });
            }
            console.log(replaced_input)
            $('#output_data').val(replaced_input);
        }
    });

    $('#decodebutton').on('click', function() {
        var alphabet = $('#alphabet_data') || null;
        var key = $('#key_data') || null;
        var output = $('#output_data') || null;
        if ('undefined' !== typeof alphabet && '' !== alphabet.val() &&
            'undefined' !== typeof key && '' !== key.val() &&
            'undefined' !== typeof output && '' !== output.val()) {
            var output_mas = Array();
            var is_array = false;
            if (-1 < (output.val()).indexOf(' ')) {
                output_mas = (output.val()).trim().split(' ');
                is_array = true;
            } else {
                output_mas = (output.val()).trim();
            }
            var replaced_output = '';
            if (true === is_array) {
                for (var i = 0; i < output_mas.length; i++) {
                    var params = {
                        'key': key.val(),
                        'text': output_mas[i]
                    };
                    var call = FillKeyByTextLength(params, function(result) {
                        $('#key_data_long').val('' + result);
                        //console.log('result ', result);
                        if (0 < i) {
                            replaced_output = replaced_output + ' ';
                        }
                        replaced_output = replaced_output + vizhener.decryption(alphabet.val(), result, output_mas[i]);
                    });
                }
            } else {
                var params = {
                    'key': key.val(),
                    'text': output_mas
                };
                var call = FillKeyByTextLength(params, function(result) {
                    $('#key_data_long').val('' + result);
                    //console.log('result ', result);
                    replaced_output = replaced_output + '' + vizhener.decryption(alphabet.val(), result, output_mas);
                });
            }
            $('#input_data').val('' + replaced_output);
        }
    });

});

