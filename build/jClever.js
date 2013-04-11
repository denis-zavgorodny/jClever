/**
*   MD5 hash by webtoolkit.info
*
*/
(function() {
    var md5 = function (string) {
        function RotateLeft(lValue, iShiftBits) {
            return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        }

        function AddUnsigned(lX,lY) {
            var lX4,lY4,lX8,lY8,lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x,y,z) { return (x & y) | ((~x) & z); }
        function G(x,y,z) { return (x & z) | (y & (~z)); }
        function H(x,y,z) { return (x ^ y ^ z); }
        function I(x,y,z) { return (y ^ (x | (~z))); }

        function FF(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a,b,c,d,x,s,ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
            d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
            c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k+0], S41,0xF4292244);
            d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA);
            b=AddUnsigned(b,BB);
            c=AddUnsigned(c,CC);
            d=AddUnsigned(d,DD);
        }

        var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

        return temp.toLowerCase();
    }
    window.md5 = md5;
})(window);
//
//  ON DOCUMENT CHANGE
//  Makes it possible to execute code when the DOM changes.
//
//  Licensed under the terms of the MIT license.
//  (c) 2010 Balázs Galambosi
//
//  Modify by Denis Zavgorodny 
//  2013
//

(function( window ) {

var last  = +new Date();
var delay = 100; // default delay

// Manage event queue
var stack = [];

function callback(ev) {
  var now = +new Date();
  if ( now - last > delay ) {
    for ( var i = 0; i < stack.length; i++ ) {
       stack[i]();
    }
    last = now;
  }
  //Add jQuery event 
  if (typeof jQuery != 'undefined') {
    jQuery(document).trigger('onDomChange');
  }
}

// Public interface
var onDomChange = function( fn, newdelay ) {
  if ( newdelay ) 
    delay = newdelay;
  stack.push( fn );
};

// Naive approach for compatibility
function naive() {
  var last  = document.getElementsByTagName('*');
  var lastlen = last.length;
  var timer = setTimeout( function check() {

    // get current state of the document
    var current = document.getElementsByTagName('*');
    var len = current.length;

    // if the length is different
    // it's fairly obvious
    if ( len != lastlen ) {
      // just make sure the loop finishes early
      last = [];
    }

    // go check every element in order
    for ( var i = 0; i < len; i++ ) {
      if ( current[i] !== last[i] ) {
        callback();
        last = current;
        lastlen = len;
        break;
      }
    }

    // over, and over, and over again
    setTimeout( check, delay );

  }, delay );
}

//
//  Check for mutation events support
//

var support = {};

var el = document.documentElement;
var remain = 3;

// callback for the tests
function decide() {
  if ( support.DOMNodeInserted ) {
    window.addEventListener( "DOMContentLoaded", function(event) {
      if ( support.DOMSubtreeModified ) { // for FF 3+, Chrome
         el.addEventListener( 'DOMSubtreeModified', callback, false );
      } else { // for FF 2, Safari, Opera 9.6+
        el.addEventListener( 'DOMNodeInserted', callback, false );
        el.addEventListener( 'DOMNodeRemoved',  callback, false );
      }
    }, false );
  } else if ( document.onpropertychange ) { // for IE 5.5+
    document.onpropertychange = callback;
  } else { // fallback
    naive();
  }
}

// checks a particular event
function test( event ) {
  el.addEventListener( event, function fn() {
    support[event] = true;
    el.removeEventListener( event, fn, false );
    if( --remain === 0 ) decide();
  }, false);
}

// attach test events
if ( window.addEventListener ) {
  test( 'DOMSubtreeModified');
  test( 'DOMNodeInserted' );
  test( 'DOMNodeRemoved' );
  decide();
} else {
  decide();
}

// do the dummy test
var dummy = document.createElement("div");
el.appendChild( dummy );
el.removeChild( dummy );

// expose
window.onDomChange = onDomChange;

})( window );
/*
    *   jClever HEAD:v 1.2.1 :)
*
*   by Denis Zavgorodny
*   zavgorodny@alterego.biz.ua
*
*   
*
*
*/ 
(function($){
    $.fn.jClever = function(options) {
        var options = $.extend(
                                {
                                    applyTo: {
                                        select: true,
                                        checkbox: true,
                                        radio: true,
                                        button: true,
                                        file: true,
                                        input: true,
                                        textarea: true
                                    },
                                    validate: {
                                        state: false,
                                        items: {
                                            
                                        }
                                    },
                                    errorTemplate: '<span class="jClever-error-label"></span>',
                                    errorClassTemplate: 'jClever-error-label',
                                    selfClass: 'alice',
                                    fileUploadText: 'Загрузить',
                                    autoTracking: false,
                                    autoInit: false,
                                    autoinitClass: ''
                                },
                                options
                                );
        var selects = {};                        
        var jScrollApi = [];
        var formState = {};

        var validateMethod = {
            isNumeric: function(data) {
                var pattern = /^\d+$/;
                return pattern.test(data);
            },
            isString: function(data) {
                var pattern = /^[a-zA-ZА-Яа-я]+$/;
                return pattern.test(data);
            },
            isAnyText: function(data) {
                var pattern = /^[a-zA-ZА-Яа-я0-9]+$/;
                return pattern.test(data);
            },            
            isEmail: function(data) {
                var pattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,4}$/;
                return pattern.test(data);
            },
            isSiteURL: function(data) {
                var pattern = /^((https?|ftp)\:\/\/)?([a-z0-9]{1,})([a-z0-9-.]*)\.([a-z]{2,4})$/;
                return pattern.test(data);
            }
            
        };
        var innerCounter = 999;
        var tabindex = 1;
        var methods = {
                        init: function(element) {
                            //validate form
                            if (options.validate.state === true) {
                                
                                $(element).submit(function(){
                                    var _form = $(element).get(0);
                                    var errorsForm = {};
                                    $(_form).find('.error').removeClass('error');
                                    for (var validateItem in options.validate.items) {
                                        if (!(_form[validateItem] === undefined)) {
                                            for (var validateType in options.validate.items[validateItem]) {
                                                switch(validateType) {
                                                    case "required":
                                                        if (_form[validateItem].value == '' || _form[validateItem].value == $(_form[validateItem]).data('placeholder'))
                                                            errorsForm[validateItem] = options.validate.items[validateItem][validateType];
                                                        break;
                                                    case "numeric":
                                                        if (validateMethod.isNumeric(_form[validateItem].value) != true) {
                                                            errorsForm[validateItem] = options.validate.items[validateItem][validateType];
                                                        }    
                                                        break;
                                                    case "str":
                                                        if (validateMethod.isString(_form[validateItem].value) != true) {
                                                            errorsForm[validateItem] = options.validate.items[validateItem][validateType];
                                                        }    
                                                        break;
                                                    case "stringAndNumeric":
                                                        if (validateMethod.isAnyText(_form[validateItem].value) != true) {
                                                            errorsForm[validateItem] = options.validate.items[validateItem][validateType];
                                                        }    
                                                        break;        
                                                    case "mail":
                                                        if (validateMethod.isEmail(_form[validateItem].value) != true) {
                                                            errorsForm[validateItem] = options.validate.items[validateItem][validateType];
                                                        }    
                                                        break;
                                                    case "siteURL":
                                                        if (validateMethod.isSiteURL(_form[validateItem].value) != true) {
                                                            errorsForm[validateItem] = options.validate.items[validateItem][validateType];
                                                        }    
                                                        break;        
                                                }
                                            }
                                            
                                        }    
                                    }
                                    var isError = 0;
                                    for(var key in errorsForm) {
                                        if (_form[key] != undefined) {
                                            var labelText = errorsForm[key];
                                            var formElement = $(_form[key]);
                                            var wrapper = formElement.parents('.jClever-element');
                                            var error = wrapper.find('.'+options.errorClassTemplate);
                                            wrapper.addClass('error');
                                            error.text(labelText);
                                            isError++;
                                        }
                                    }
                                    if (isError)
                                        return false;
                                    else    
                                        return true;
                                });
                            }
                            
                            
                            //placeholder INPUT[type=text], textarea init
                            $(element).find('input[type=text], input[type=password], textarea').each(function(){
                                var _this = $(this);
                                var holderText = $(this).data('placeholder');
                                if (typeof holderText === 'string') {
                                    if(_this.val() == '')
                                         _this.val(holderText).addClass('placeholdered');
                                         
                                    _this.focusin(function(){
                                        if(_this.val() == holderText)
                                         _this.val('').removeClass('placeholdered');
                                    });
                                    _this.focusout(function(){
                                        if(_this.val() == '')
                                         _this.val(holderText).addClass('placeholdered');
                                    });
                                }
                            });
                            //
                            var formElements = $(element).get(0).elements;
                            var formHash = '';
                            for (key = 0; key < formElements.length; key++) {
                                var self = $(formElements[key]),
                                    elementHash = md5(methods.elementToString(self));
                                formHash += elementHash;
                                self.data('jCleverHash',elementHash);
                                if (typeof formElements[key].nodeName == 'undefined')
                                    continue;
                                switch (formElements[key].nodeName) {
                                    case "SELECT":  
                                                //Select init
                                                if (options.applyTo.select) {
                                                    if (typeof self.attr('multiple') == 'undefined') {
                                                        methods.selectActivate(formElements[key],innerCounter, tabindex);
                                                    } else {
                                                        methods.multiSelectActivate(formElements[key],innerCounter, tabindex);
                                                    }
                                                    formState[self.attr('name')] = {
                                                        type: "select",
                                                        value: self.attr('value')
                                                    };
                                                    self.data('jclevered',true);
                                                    
                                                    innerCounter--;
                                                    tabindex++;
                                                }    
                                                break;    
                                    case "TEXTAREA":
                                                //Textarea
                                                if (options.applyTo.textarea) {
                                                    methods.textareaActivate(formElements[key], tabindex);
                                                    self.data('jclevered',true);
                                                    tabindex++;
                                                }        
                                                break;     
                                    case "INPUT":
                                                //Checkbox init
                                                if (options.applyTo.checkbox && self.attr('type') == 'checkbox') {
                                                    formState[self.attr('name')] = {
                                                        type: "checkbox",
                                                        value: (self.is(':checked')?1:0)
                                                    };
                                                    methods.checkboxActivate(formElements[key], tabindex);
                                                    self.data('jclevered',true);
                                                    tabindex++;
                                                }    
                                                //Radio Button init
                                                if (options.applyTo.radio && self.attr('type') == 'radio') {
                                                    formState[self.attr('name')] = {
                                                        type: "radio",
                                                        value: (self.is(':checked')?1:0)
                                                    };
                                                    methods.radioActivate(formElements[key], tabindex);
                                                    self.data('jclevered',true);
                                                    tabindex++;
                                                }                                                       
                                                //Input File                                                
                                                if (options.applyTo.file && self.attr('type') == 'file') {
                                                    formState[self.attr('name')] = {
                                                        type: "file",
                                                        value: ''
                                                    };
                                                    methods.fileActivate(formElements[key], tabindex);
                                                    self.data('jclevered',true);
                                                    tabindex++;
                                                }
                                                //Input [type=submit, reset, button] (input)
                                                if (options.applyTo.button && (self.attr('type') == 'submit' || self.attr('type') == 'reset' || self.attr('type') == 'button')) {
                                                    methods.submitActivate(formElements[key], tabindex);
                                                    self.data('jclevered',true);
                                                    tabindex++;
                                                }
                                                //Input [type=text]
                                                if (options.applyTo.input && (self.attr('type') == 'text' || self.attr('type') == 'password')) {
                                                    methods.inputActivate(formElements[key], tabindex);
                                                    self.data('jclevered',true);
                                                    tabindex++;
                                                }        
                                                break;                                                          
                                }
                            }
                            $(element).find('input[type=password]').each(function(){
                                var _this = $(this);
                                var holderText = $(this).data('placeholder-pass');
                                var placeholder;
                                if (typeof holderText === 'string') {
                                    $('<span class="jClever-element-input-placeholder">'+holderText+'</span>').insertAfter(_this);
                                    placeholder = _this.next('.jClever-element-input-placeholder');
                                    if(_this.val() == '') {
                                         _this.addClass('placeholdered');
                                         placeholder.show();
                                    } else {
                                        placeholder.hide();
                                    }
                                         
                                    _this.focusin(function(){
                                        if(_this.val() == '') {
                                            _this.removeClass('placeholdered');
                                            placeholder.hide();
                                        }
                                    });
                                    _this.focusout(function(){
                                        if(_this.val() == '') {
                                            _this.addClass('placeholdered');
                                            placeholder.show();
                                        }    
                                    });
                                    placeholder.click(function(){
                                        _this.focus();
                                    });
                                }
                            });

                            $(element).data('jCleverHash', md5(formHash));
                            //Hook reset event
                            $(element).find('button[type=reset]').click(function(){
                                methods.reset($(element));
                            });
                        },
                        refresh: function(form) {
                            var formElements = $(form).get(0).elements;
                            for (key = 0; key < formElements.length; key++) {
                                var self = $(formElements[key]),
                                    jclevered = self.data('jclevered');
                                if (self.data('jCleverHash') != md5(methods.elementToString(self))) {
                                    elementHash = md5(methods.elementToString(self));
                                    self.data('jCleverHash',elementHash);
                                    if (typeof formElements[key].nodeName == 'undefined')
                                        continue;
                                    if (typeof jclevered != 'undefined') {

                                        switch (formElements[key].nodeName) {
                                            case "SELECT":
                                                        self.trigger('update');
                                                        break;
                                            case "INPUT":
                                                        self.trigger('change');
                                                        break;            
   
                                        }
                                    } else {
                                        var _elementName = formElements[key].nodeName.toLowerCase();
                                        if (_elementName == 'input')
                                            _elementName = self.attr('type');
                                        
                                        var res = methods.elementAdd(self, _elementName ,$(form).data('publicApi'));

                                        $(form).data('publicApi', res);
                                    }
                                }
                            }
                        },

                        destroy: function(form) {
                            //select strip
                            form.find('select').each(function(){
                                var tmp = $(this).clone();
                                $(this).parents('.jClever-element').empty().after(tmp);
                            });
                            //checkbox strip
                            form.find('input[type=checkbox]').each(function(){
                                var tmp = $(this).removeClass('hidden').clone();
                                $(this).parents('.jClever-element').empty().after(tmp);
                            });
                            //radio strip
                            form.find('input[type=radio]').each(function(){
                                var tmp = $(this).removeClass('hidden').clone();
                                $(this).parents('.jClever-element').empty().after(tmp);
                            });
                            
                            form.find('.jClever-element').remove();
                            form.removeClass('clevered');
                        },
                        reset: function(form) {
                            form.find('input[type=radio], input[type=checkbox], select, input[type=file]').each(function(){
                                if (formState[$(this).attr('name')])
                                    switch(formState[$(this).attr('name')].type) {
                                        case "select":
                                                        methods.selectSetPosition($(this), formState[$(this).attr('name')].value);
                                                        break;
                                        case "checkbox":
                                                        methods.checkboxSetState($(this), formState[$(this).attr('name')].value);
                                                        break;
                                        case "radio":
                                                        methods.radioSetState($(this), formState[$(this).attr('name')].value);
                                                        break;
                                                               
                                        case "file":
                                                        methods.fileSetState($(this), formState[$(this).attr('name')].value);
                                                        break;
                                                               
                                        default:
                                                        return;
                                                        break;                
                                    }
                            });
                        },
                        elementToString: function(jObject) {
                            var data = {},
                                dataString = '';
                            data.innerContent = '';
                            if (typeof jObject == 'undefined' && typeof jObject.get(0).nodeName == 'undefined')
                                return false;
                            if (jObject.get(0).nodeName == 'SELECT')
                                jObject.find('option').each(function(){
                                    data.innerContent += $(this).attr('value').toString()+$(this).text();
                                });

                            data.className = jObject.attr('class');
                            data.name = jObject.attr('name');
                            data.checked = jObject.attr('checked');
                            data.selected = jObject.attr('selected');
                            data.multiple = jObject.attr('multiple');
                            data.readonly = jObject.attr('readonly');
                            data.disabled = jObject.attr('disabled');
                            data.id = jObject.attr('id');
                            data.alt = jObject.attr('alt');
                            data.title = jObject.attr('title');

                            //data.value = jObject.attr('value');
                            data.style = jObject.attr('style');
                            for(var node in data) {
                                if (!data.hasOwnProperty(node))
                                    continue;
                                dataString += node + ':' + data[node] + ';';    
                            }
                            //return JSON.stringify(data);
                            return dataString;
                        },
                        selectSetPosition: function(select, value) {
                            select.find('option').removeAttr('selected');
                            select.find('option[value="'+value+'"]').attr('selected','selected');
                            select.trigger('change');
                        },
                        selectAdd: function(selector) {
                                $(element).find(selector).each(function(){
                                    formState[$(this).attr('name')] = {
                                                                            type: "select",
                                                                            value: $(this).attr('value')
                                                                        };
                                    methods.selectActivate(this,innerCounter, tabindex);
                                    self.data('jclevered',true);
                                    innerCounter--;
                                    tabindex++;
                                });    
                        },
                        checkboxSetState: function(checkbox, value) {
                            if (value == 1)
                                checkbox.attr('checked', 'checked').prop('checked', true);
                            else
                                checkbox.removeAttr('checked').prop('checked', false);
                            checkbox.trigger('change');    
                        },
                        radioSetState: function(radio, value) {
                            if (value == 1)
                                radio.attr('checked', 'checked').prop('checked', true);
                            else
                                radio.removeAttr('checked').prop('checked', false);
                            radio.trigger('change');    
                        },
                        fileSetState: function(file, value) {
                            file.parents('.jClever-element-file').find('.jClever-element-file-name').text(value);
                        },
                        selectCollectionExtend: function(collection, element) {
                            collection[element.attr('name')] = {
                                object: element,
                                updateFromHTML: function(data){
                                    $('select[name='+this.object[0].name+']').html(data).trigger('update');
                                    return false;
                                },
                                updateFromJsonObject: function(data){
                                    var _data = '';
                                    for(var key in data) {
                                        _data += '<option value="'+key+'">'+data[key]+'</option>';
                                    }
                                    $('select[name='+this.object[0].name+']').html(_data).trigger('update');
                                    return false;
                                }
                            };
                            return collection;
                        },
                        multiSelectActivate: function(select, innerCounter, tabindex) {
                            jScrollApi[$(select).attr('name')] = {};
                            selects = methods.selectCollectionExtend(selects, $(select));
                            var self_width = $(select).width();
                            $(select).wrap('<div class="jClever-element" style="z-index:'+innerCounter+';"><div class="jClever-element-select-wrapper multiselect" style="width:'+self_width+'px; z-index:'+innerCounter+';"><div class="jClever-element-select-wrapper-design"><div class="jClever-element-select-wrapper-design">').after('<span class="jClever-element-select-center">&nbsp;</span><span class="jClever-element-select-right"><span>v</span></span><div class="jClever-element-select-list-wrapper" style="z-index:'+innerCounter+';"><div class="jClever-element-select-list-wrapper-"><div class="jClever-element-select-list-wrapper--"><ul class="jClever-element-select-list"></ul></div></div></div>');
                            var selectObject = $(select).parents('.jClever-element').attr('tabindex',tabindex);
                            var selectText = selectObject.find('.jClever-element-select-center');
                            var selectRight = selectObject.find('.jClever-element-select-right');
                            var selectList = selectObject.find('.jClever-element-select-list');
                            var selectListWrapper = selectObject.find('.jClever-element-select-list-wrapper');
                            var selectListWrapperToScroll = selectObject.find('.jClever-element-select-list-wrapper--');
                            var selectLabel = $('label[for='+$(select).attr('id')+']');

                            if ($(select).attr('disabled'))
                                selectObject.addClass('disabled');

                            //Add error label
                            selectObject.append(options.errorTemplate);
                            $(select).find('option').each(function(){
                                if ($(this).is(':selected'))
                                    selectObject.find('.jClever-element-select-list')
                                                .append($('<li class="active '+($(this).is(':disabled') ? ' disabled' : '') +'" data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                else
                                    selectObject.find('.jClever-element-select-list')
                                                .append($('<li class="'+($(this).is(':disabled') ? ' disabled' : '') +'" data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                
                            });
                            if ($(select).find(':selected')) {
                                var _text = '';
                                $(select).find('option:selected').each(function(){
                                    _text += $(this).text()+', ';
                                });
                                if (_text.length == 0)
                                    selectText.html('&nbsp;');
                                else
                                    selectText.text(_text.substring(0,_text.length-2));
                            } else {
                                //selectText.text($(select).find('option:eq(0)').text());
                                selectText.text('&nbsp;');
                            }    
                            selectObject.on('click.jClever', '.jClever-element-select-center, .jClever-element-select-right',function(){
                                if ($(select).attr('disabled'))
                                    return false;
                                if (selectListWrapper.is(':visible')) {
                                    $('.jClever-element-select-list-wrapper').hide();
                                } else {
                                    $('.jClever-element-select-list-wrapper').hide();
                                    selectListWrapper.show();
                                    selectObject.trigger('focus');
                                    jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                                }
                            });

                            selectListWrapper.on('blur.jClever', function(){
                                $(this).hide();
                            });
                            selectObject.on('click.jClever','li' ,function(event){
                                if ($(this).hasClass('disabled'))
                                    return;
                                var value = $(this).attr('data-value');
                                $(this).toggleClass('active');
                                if ($(this).is('.active'))
                                    $(select).find('option[value="'+value+'"]').attr('selected','selected');
                                else
                                    $(select).find('option[value="'+value+'"]').removeAttr('selected');
                                $(select).trigger('change');
                                return false;
                            });
                            $(select).on('change.jClever', function(){
                                if ($(this).attr('disabled'))
                                    return false;
                                var _text = '';
                                $(select).find('option:selected').each(function(){
                                    _text += $(this).text()+', ';
                                });
                                selectText.text(_text.substring(0,_text.length-2));
                            });
                            $(select).on('update.jClever',function(){
                                var ul = $(this).parents('.jClever-element-select-wrapper')
                                        .find('.jClever-element-select-list')
                                        .empty();
                                $(this).find('option').each(function(){
                                    ul.append($('<li data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                });
                                $(this).parents('.jClever-element-select-wrapper').find('.jClever-element-select-center').text($(select).find('option:eq(0)').text());    
                            });
                            selectObject.on('focus.jClever', function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused')});
                            selectLabel.on('click.jClever', function(){
                                selectObject.trigger('focus');
                                selectListWrapper.show();
                                jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                            });
                            // Hook keydown
                            var charText = '';
                            var queTime = null;
                            selectObject.on('keydown.jClever', function(e){
                                var selectedIndex = $(select)[0].selectedIndex;
                                switch(e.keyCode){
                                    case 40: /* Down */
                                        if ($(select).attr('disabled'))
                                            return false;
                                        if (selectedIndex < $(select).find('option').length-1){ selectedIndex++; }
                                        break;
                                    case 38: /* Up */
                                        if ($(select).attr('disabled'))
                                            return false;
                                        if (selectedIndex > 0){ selectedIndex--; }
                                        break;
                                    case 13: /* Enter */
                                        if (selectListWrapper.is(':visible'))
                                            selectListWrapper.hide();
                                        else {
                                            if ($(select).attr('disabled'))
                                                return false;
                                            selectListWrapper.show();
                                            jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                                        }    
                                        break;
                                    case 32: /* Space */
                                        if (selectListWrapper.is(':visible'))
                                            selectListWrapper.hide();
                                        else {
                                            if ($(select).attr('disabled'))
                                                return false;
                                            selectListWrapper.show();
                                            jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                                        }    
                                        break;
                                    case 9: /* Tab */
                                            selectListWrapper.hide();
                                            return true;
                                           
                                    default: /* Key select */
                                        //$(select).focus();
                                        charText += String.fromCharCode(e.keyCode);
                                        clearTimeout(queTime);
                                        queTime = setTimeout(function(){
                                            var tmpIndex = 0;
                                            var count = $(select)[0].options.length;
                                            for (var key  = 0; key < count; key ++) {
                                                if (typeof $(select)[0].options[key].text == 'string') {
                                                    var localString = $(select)[0].options[key].text.toUpperCase();
                                                    var reg = new RegExp("^"+charText, "i")
                                                    if (reg.test(localString)) {
                                                        selectedIndex = tmpIndex;

                                                        $(select)[0].selectedIndex = selectedIndex;
                                                        selectObject.find('li.selected').removeClass('selected');
                                                        selectObject.find('li:eq('+selectedIndex+')').addClass('selected');
                                                        selectObject.find('option').removeAttr('selected');
                                                        selectObject.find('option:eq('+selectedIndex+')').attr('selected','selected');
                                                        $(select).trigger('change');
                                                        if (selectListWrapper.is(':visible'))
                                                            jScrollApi[$(select).attr('name')].scrollToElement(selectObject.find('li:eq('+selectedIndex+')'));

                                                        break;    
                                                    }
                                                    tmpIndex++;
                                                }
                                            }
                                            charText = '';
                                        }, 500);
                                            
                                        break;
                                        return false;
                                }
                                $(select)[0].selectedIndex = selectedIndex;
                                selectObject.find('li.selected').removeClass('selected');
                                selectObject.find('li:eq('+selectedIndex+')').addClass('selected');
                                selectObject.find('option').removeAttr('selected');
                                selectObject.find('option:eq('+selectedIndex+')').attr('selected','selected');
                                $(select).trigger('change');
                                if (selectListWrapper.is(':visible'))
                                    jScrollApi[$(select).attr('name')].scrollToElement(selectObject.find('li:eq('+selectedIndex+')'));
                                return false;
                            });
                        },
                        selectActivate: function(select, innerCounter, tabindex) {
                            jScrollApi[$(select).attr('name')] = {};
                            selects = methods.selectCollectionExtend(selects, $(select));
                            var self_width = $(select).width();
                            $(select).wrap('<div class="jClever-element" style="z-index:'+innerCounter+';"><div class="jClever-element-select-wrapper" style="width:'+self_width+'px; z-index:'+innerCounter+';"><div class="jClever-element-select-wrapper-design"><div class="jClever-element-select-wrapper-design">').after('<span class="jClever-element-select-center">&nbsp;</span><span class="jClever-element-select-right"><span>v</span></span><div class="jClever-element-select-list-wrapper" style="z-index:'+innerCounter+';"><div class="jClever-element-select-list-wrapper-"><div class="jClever-element-select-list-wrapper--"><ul class="jClever-element-select-list"></ul></div></div></div>');
                            var selectObject = $(select).parents('.jClever-element').attr('tabindex',tabindex);
                            var selectText = selectObject.find('.jClever-element-select-center');
                            var selectRight = selectObject.find('.jClever-element-select-right');
                            var selectList = selectObject.find('.jClever-element-select-list');
                            var selectListWrapper = selectObject.find('.jClever-element-select-list-wrapper');
                            var selectListWrapperToScroll = selectObject.find('.jClever-element-select-list-wrapper--');
                            var selectLabel = $('label[for='+$(select).attr('id')+']');

                            if ($(select).attr('disabled'))
                                selectObject.addClass('disabled');

                            //Add error label
                            selectObject.append(options.errorTemplate);
                            $(select).find('option').each(function(){
                                if ($(this).is(':selected'))
                                    selectObject.find('.jClever-element-select-list')
                                                .append($('<li class="active '+($(this).is(':disabled') ? ' disabled' : '') +'" data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                else
                                    selectObject.find('.jClever-element-select-list')
                                                .append($('<li class=" '+($(this).is(':disabled') ? ' disabled' : '') +'" data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                
                            });
                            if ($(select).find(':selected'))
                                selectText.text($(select).find('option:selected').text());
                            else
                                selectText.text($(select).find('option:eq(0)').text());
                            selectObject.on('click.jClever', '.jClever-element-select-center, .jClever-element-select-right',function(){
                                if ($(select).attr('disabled'))
                                    return false;
                                if (selectListWrapper.is(':visible')) {
                                    $('.jClever-element-select-list-wrapper').hide();
                                    selectObject.removeClass('opened');
                                } else {
                                    $('.jClever-element-select-list-wrapper').hide();
                                    $('.jClever-element').removeClass('opened');
                                    selectListWrapper.show();
                                    selectObject.addClass('opened');
                                    selectObject.trigger('focus');
                                    jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                                }
                            });

                            selectListWrapper.on('blur.jClever', function(){
                                $(this).hide();
                                selectObject.removeClass('opened');
                            });
                            selectObject.on('click.jClever','li' ,function(event){
                                var value = $(this).attr('data-value');
                                selectList.find('li.active').removeClass('active');
                                $(this).addClass('active');
                                $(select).find('option').removeAttr('selected');
                                $(select).find('option').prop('selected', false);
                                $(select).find('option[value="'+value+'"]').attr('selected','selected');
                                $(select).find('option[value="'+value+'"]').prop('selected',true);
                                $(select).trigger('change');
                                selectListWrapper.hide();
                                selectObject.removeClass('opened');
                                return false;
                            });
                            $(select).on('change.jClever', function(){
                                var self = $(this),
                                    selectedElement = self.find('option[selected=selected]')    
                                if (self.find('option[selected=selected]').length > 1)
                                    selectedElement = self.find('option:selected');
                                
                                var value = selectedElement.text();
                                if (self.attr('disabled'))
                                    return false;
                                selectText.text(value);
                                self.get(0).selectedIndex = selectedElement.index();
                                selectObject.removeClass('focused');
                            });
                            $(select).on('update.jClever',function(){
                                var ul = $(this).parents('.jClever-element-select-wrapper')
                                        .find('.jClever-element-select-list')
                                        .empty();
                                $(this).find('option').each(function(){
                                    ul.append($('<li data-value="'+$(this).val()+'" class="'+($(this).prop('selected')?"active":"")+'  '+($(this).is(':disabled') ? 'disabled' : '') +'"><span><i>'+$(this).text()+'</i></span></li>'));
                                });
                                $(this).parents('.jClever-element-select-wrapper').find('.jClever-element-select-center').text($(select).find('option:eq(0)').text());    
                                $(this).parents('.jClever-element-select-wrapper').find('.jClever-element-select-center').text($(select).find('option:not(:disabled):first').text());    
                            });
                            selectObject.on('focus.jClever', function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused'); $(this).removeClass('opened');});
                            selectLabel.on('click.jClever', function(){
                                selectObject.trigger('focus.jClever').addClass('focused');
                                selectListWrapper.show();
                                selectObject.addClass('opened');
                                jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                            });
                            // Hook keydown
                            var charText = '';
                            var queTime = null;
                            selectObject.on('keydown.jClever', function(e){
                                var selectedIndex = $(select)[0].selectedIndex;
                                switch(e.keyCode){
                                    case 40: /* Down */
                                        if ($(select).attr('disabled'))
                                            return false;
                                        if (selectedIndex < $(select).find('option').length-1){ selectedIndex++; }
                                        break;
                                    case 38: /* Up */
                                        if ($(select).attr('disabled'))
                                            return false;
                                        if (selectedIndex > 0){ selectedIndex--; }
                                        break;
                                    case 13: /* Enter */
                                        if (selectListWrapper.is(':visible')) {
                                            selectListWrapper.hide();
                                            selectObject.removeClass('opened');
                                        }
                                            
                                        else {
                                            if ($(select).attr('disabled'))
                                                return false;
                                            selectListWrapper.show();
                                            selectObject.addClass('opened');
                                            jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                                        }    
                                        break;
                                    case 32: /* Space */
                                        if (selectListWrapper.is(':visible')) {
                                            selectListWrapper.hide();
                                            selectObject.removeClass('opened');
                                        }    
                                        else {
                                            if ($(select).attr('disabled'))
                                                return false;
                                            selectListWrapper.show();
                                            selectObject.addClass('opened');
                                            jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                                        }    
                                        break;
                                    case 9: /* Tab */
                                            selectListWrapper.hide();
                                            return true;
                                           
                                    default: /* Key select */
                                        //$(select).focus();
                                        charText += String.fromCharCode(e.keyCode);
                                        clearTimeout(queTime);
                                        queTime = setTimeout(function(){
                                            var tmpIndex = 0;
                                            var count = $(select)[0].options.length;
                                            for (var key  = 0; key < count; key ++) {
                                                if (typeof $(select)[0].options[key].text == 'string') {
                                                    var localString = $(select)[0].options[key].text.toUpperCase();
                                                    var reg = new RegExp("^"+charText, "i")
                                                    if (reg.test(localString)) {
                                                        selectedIndex = tmpIndex;

                                                        $(select)[0].selectedIndex = selectedIndex;
                                                        selectObject.find('li.selected').removeClass('selected');
                                                        selectObject.find('li:eq('+selectedIndex+')').addClass('selected');
                                                        selectObject.find('option').removeAttr('selected');
                                                        selectObject.find('option:eq('+selectedIndex+')').attr('selected','selected');
                                                        $(select).trigger('change');
                                                        if (selectListWrapper.is(':visible'))
                                                            jScrollApi[$(select).attr('name')].scrollToElement(selectObject.find('li:eq('+selectedIndex+')'));

                                                        break;    
                                                    }
                                                    tmpIndex++;
                                                }
                                            }
                                            charText = '';
                                        }, 500);
                                            
                                        break;
                                        return false;
                                }
                                $(select)[0].selectedIndex = selectedIndex;
                                selectObject.find('li.selected').removeClass('selected');
                                selectObject.find('li:eq('+selectedIndex+')').addClass('selected');
                                selectObject.find('option').removeAttr('selected');
                                selectObject.find('option:eq('+selectedIndex+')').attr('selected','selected');
                                $(select).trigger('change');
                                if (selectListWrapper.is(':visible'))
                                    jScrollApi[$(select).attr('name')].scrollToElement(selectObject.find('li:eq('+selectedIndex+')'));
                                return false;
                            });
                        },
                        selectOpen: function(select){
                            if (typeof select == 'string')
                                select = $(select);
                            var wrapper = select.closest('.jClever-element'),
                                selectListWrapper = wrapper.find('.jClever-element-select-list-wrapper'),
                                selectListWrapperToScroll = wrapper.find('.jClever-element-select-list-wrapper--')

                            select.addClass('focused');
                            selectListWrapper.show();
                            wrapper.addClass('opened');
                            jScrollApi[$(select).attr('name')] = selectListWrapperToScroll.jScrollPane().data('jsp');
                        },
                        selectClose: function(select){
                            if (typeof select == 'string')
                                select = $(select);
                            var wrapper = select.closest('.jClever-element'),
                                selectListWrapper = wrapper.find('.jClever-element-select-list-wrapper'),
                                selectListWrapperToScroll = wrapper.find('.jClever-element-select-list-wrapper--')

                            select.removeClass('focused');
                            selectListWrapper.hide();
                            wrapper.removeClass('opened');
                        },
                        checkboxActivate: function(checkbox, tabindex) {
                            var _checkbox = $(checkbox).wrap('<div class="jClever-element" tabindex="'+tabindex+'">').addClass('hidden').after('<span class="jClever-element-checkbox-twins"><span class="jClever-element-checkbox-twins-element"></span><span class="jClever-element-checkbox-twins-color"></span></span>');
                            var checkboxId = _checkbox.attr('id');
                            _checkbox.parents('.jClever-element').append(options.errorTemplate);
                            if (_checkbox.is(':checked')) {
                                _checkbox.next('.jClever-element-checkbox-twins').addClass('checked');
                                $('label[for='+checkboxId+']').addClass('active');
                            }    
                            if ($(checkbox).attr('disabled'))
                                _checkbox.parents('.jClever-element').addClass('disabled')
                                
                            _checkbox.on('change.jClever', function(){
                                if ($(this).attr('disabled'))
                                    return false;

                                if ($(this).is(':checked')) {
                                    _checkbox.next('.jClever-element-checkbox-twins').addClass('checked');
                                    $('label[for='+checkboxId+']').addClass('active');
                                } else {
                                    _checkbox.next('.jClever-element-checkbox-twins').removeClass('checked');
                                    $('label[for='+checkboxId+']').removeClass('active');
                                }    
                            });
                            _checkbox.next('.jClever-element-checkbox-twins').on('click', function(){
                                var _self = $(this);
                                if (_self.prev('input[type=checkbox]').is(':checked'))
                                    _self.prev('input[type=checkbox]').removeAttr('checked').prop('checked', false);
                                else {
                                    _self.prev('input[type=checkbox]').attr('checked', 'checked').prop('checked', true);
                                }    
                                _self.prev('input[type=checkbox]').trigger('change');    
                            });
                            // Hook keydown
                            _checkbox.parent('.jClever-element').on('keydown.jClever', function(e){
                                var _checkbox = $(this).find('input[type=checkbox]');
                                switch(e.keyCode){
                                    case 32: /* Space */
                                        if (_checkbox.is(':checked'))
                                            _checkbox.removeAttr('checked').prop('checked', false);
                                        else
                                            _checkbox.attr('checked', 'checked').prop('checked', true);
                                        _checkbox.trigger('change');    
                                        break;
                                    default:
                                        return;
                                        break;
                                }
                                return false;
                            });
                            _checkbox.parent('.jClever-element').focus(function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused')});
                        },
                        radioActivate: function(radio, tabindex) {
                            var _radio = $(radio).wrap('<div class="jClever-element" tabindex="'+tabindex+'">').addClass('hidden').after('<span class="jClever-element-radio-twins"><span class="jClever-element-radio-twins-element"></span><span class="jClever-element-radio-twins-color"></span></span>');
                            var radioId = _radio.attr('id');
                            _radio.parents('.jClever-element').append(options.errorTemplate);
                            if (_radio.is(':checked')) {
                                _radio.next('.jClever-element-radio-twins').addClass('checked');
                                $('label[for='+radioId+']').addClass('active');
                            }    
                            if ($(radio).attr('disabled')) {
                                _radio.parents('.jClever-element').addClass('disabled')
                                return;
                            }
                                
                            _radio.on('change.jClever', function(){
                                if ($(this).attr('disabled'))
                                    return false;
                                var _self = $(this);
                                if (_self.is(':checked')) {
                                    _self.next('.jClever-element-radio-twins').addClass('checked');
                                    $('label[for='+radioId+']').addClass('active');
                                } else {
                                    _self.next('.jClever-element-radio-twins').removeClass('checked');
                                    $('label[for='+radioId+']').removeClass('active');
                                }    
                                $('input:radio[name="'+ $(radio).attr('name') +'"]').not($(radio)).each(function(){
                                    var _self = $(this);
                                    _self.attr('checked',false).next('.jClever-element-radio-twins').removeClass('checked');
                                    $('label[for='+$(this).attr('id')+']').removeClass('active');
                                });    
                            });
                            _radio.next('.jClever-element-radio-twins').on('click', function(){
                                var _self = $(this);
                                if (_self.prev('input[type=radio]').is(':checked'))
                                    _self.prev('input[type=radio]').attr('checked');
                                else
                                    _self.prev('input[type=radio]').attr('checked', 'checked').prop('checked', true);
                                _self.prev('input[type=radio]').trigger('change');    
                            });

                            // Hook keydown
                            _radio.parent('.jClever-element').on('keydown.jClever', function(e){
                                var _radio = $(this).find('input[type=radio]');
                                switch(e.keyCode){
                                    case 32: /* Space */
                                        if (_radio.is(':checked'))
                                            _radio.removeAttr('checked').prop('checked', false);
                                        else
                                            _radio.attr('checked', 'checked').prop('checked', true);
                                        _radio.trigger('change');    
                                        break;
                                    default:
                                        return;
                                        break;
                                }
                                return false;
                            });

                            
                            _radio.parent('.jClever-element').focus(function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused')});
                        },
                        submitActivate: function(button, tabindex) {
                            var value = $(button).attr('value');
                            var newButton = $(button).replaceWith('<button type="'+ button.type +'" name="'+ button.name +'" id="'+ button.id +'"  class="styled '+ button.className +'" value="'+ value +'"><span><span><span>'+ value +'</span></span></span>');
                            elementHash = md5(methods.elementToString(newButton));
                            newButton.data('jCleverHash',elementHash);
                        },
                        fileActivate: function(file, tabindex) {
                            $(file).wrap('<div class="jClever-element" tabindex="'+tabindex+'"><div class="jClever-element-file">').addClass('hidden-file').after('<span class="jClever-element-file-name"><span><span></span></span></span><span class="jClever-element-file-button"><span><span>'+options.fileUploadText+'</span></span></span>').wrap('<div class="input-file-helper">');
                            $(file).parents('.jClever-element').append(options.errorTemplate);
                            
                            var jCleverElementFileName = $(file).parents('.jClever-element').find('.jClever-element-file-name>span>span');
                            $(file).on('change.jClever', function(){
                                var _name = $(this).val();
                                _name = _name.split("\\");
                                _name = _name[_name.length-1];
                                jCleverElementFileName.text(_name);
                            });

                            // Hook keydown
                            $(file).parents('.jClever-element').on('keydown.jClever', function(e){
                                switch(e.keyCode){
                                    case 32: /* Space */
                                        $(file).trigger('click');
                                        break;
                                    default:
                                        return;
                                        break;
                                }
                                return false;
                            });
                            
                            $(file).parents('.jClever-element').focus(function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused')});
                        },
                        inputActivate: function(input, tabindex) {
                            $(input).wrap('<div class="jClever-element"><div class="jClever-element-input"><div class="jClever-element-input"><div class="jClever-element-input">');
                            $(input).parents('.jClever-element').append(options.errorTemplate);
                            $(input).on('focusin.jClever', function(){
                                $(this).parents('.jClever-element').addClass('focused');
                            });
                            $(input).on('focusout.jClever', function(){
                                $(this).parents('.jClever-element').removeClass('focused');
                            });
                        },
                        textareaActivate: function(textarea, tabindex) {
                            $(textarea).wrap('<div class="jClever-element"><div class="jClever-element-textarea"><div class="jClever-element-textarea"><div class="jClever-element-textarea">');
                            $(textarea).parents('.jClever-element').append(options.errorTemplate);
                            $(textarea).on('focusin.jClever', function(){
                                $(this).parents('.jClever-element').addClass('focused');
                            });
                            $(textarea).on('focusout.jClever', function(){
                                $(this).parents('.jClever-element').removeClass('focused');
                            });
                        },
                        elementAdd: function(selector, type, selfAPIObject) {
                            switch(type) {
                                case "text":
                                case "password":
                                            if (!options.applyTo.input)
                                                break;
                                            if (typeof selector != 'string')
                                                selector.each(function(){
                                                    methods.inputActivate($(this), tabindex);    
                                                    $(this).data('jclevered',true);
                                                });
                                            else {
                                                methods.inputActivate(selector, tabindex);
                                                $(selector).data('jclevered',true);
                                            }        
                                            break;
                                case "file":
                                            if (!options.applyTo.file)
                                                break;
                                            if (typeof selector != 'string')
                                                selector.each(function(){
                                                    methods.fileActivate($(this), tabindex);    
                                                    $(this).data('jclevered',true);
                                                });
                                            else {
                                                methods.fileActivate(selector, tabindex);
                                                $(selector).data('jclevered',true);
                                            }        
                                            break;
                                case "select":
                                            if (!options.applyTo.select)
                                                break;
                                            methods.selectActivate(selector, selfAPIObject.innerCounter, tabindex);
                                            var result = $.extend(selects, selfAPIObject.selectCollection);
                                            selfAPIObject.selectCollection = result;
                                            selfAPIObject.innerCounter--;
                                            $(selector).data('jclevered',true);
                                            break;
                                case "checkbox":
                                            if (!options.applyTo.checkbox)
                                                break;
                                            if (typeof selector != 'string')
                                                selector.each(function(){
                                                    methods.checkboxActivate($(this), tabindex);    
                                                    $(this).data('jclevered',true);
                                                });
                                            else {
                                                methods.checkboxActivate(selector, tabindex);
                                                $(selector).data('jclevered',true);
                                            }        
                                            break;
                                case "radio":
                                            if (!options.applyTo.radio)
                                                break;
                                            methods.radioActivate(selector, tabindex);
                                            $(selector).data('jclevered',true);
                                            break;
                                case "textarea":
                                            if (!options.applyTo.textarea)
                                                break;
                                            if (typeof selector != 'string')
                                                selector.each(function(){
                                                    methods.textareaActivate($(this), tabindex);    
                                                    $(this).data('jclevered',true);
                                                });
                                            else {
                                                methods.textareaActivate(selector, tabindex);
                                                $(selector).data('jclevered',true);
                                            }        
                                            break;
                                case "submit":
                                case "reset":
                                            if (!options.applyTo.button)
                                                break;
                                            if (typeof selector != 'string')
                                                selector.each(function(){
                                                    methods.submitActivate(this, tabindex);    
                                                    $(this).data('jclevered',true);
                                                });
                                            else {
                                                methods.submitActivate(selector, tabindex);
                                                $(selector).data('jclevered',true);
                                            }      
                                            break;            
                                default:             
                            }
                            return selfAPIObject;
                        },
                        elementDisable: function(selector) {
                            if (typeof selector == 'string')
                                selector = $(selector);
                            selector.attr('disabled','disabled').closest('.jClever-element').addClass('disabled');
                        },
                        elementEnable: function(selector) {
                            if (typeof selector == 'string')
                                selector = $(selector);
                            selector.removeAttr('disabled').closest('.jClever-element').removeClass('disabled');
                        }
        };
        
        var publicApi = {};
        var that = this;

        var delayTime = 100,
            timeLinkTraking = null,
            timeLinkInit = null,
            startFunction = function(){
                if (!$(this).hasClass('clevered')) {
                    $(this).addClass('clevered').addClass(options.selfClass);
                    methods.init(this);
                    publicApi = {
                                selectCollection: selects,
                                innerCounter: innerCounter,
                                refresh: function(form) {methods.refresh(form)},
                                destroy: function(form) {methods.destroy(form)},
                                reset: function(form) {methods.reset(form)},
                                selectOpen: function(select) {methods.selectOpen(select)},
                                selectClose: function(select) {methods.selectClose(select)},
                                selectSetPosition: function(select, value) {if ($(select).length) methods.selectSetPosition($(select), value);},
                                selectAdd: function(select) {methods.selectAdd(select);},
                                checkboxSetState: function(checkbox, value) {if ($(checkbox).length) methods.checkboxSetState($(checkbox), value); else return false},                            
                                radioSetState: function(radio, value) {if ($(radio).length) methods.radioSetState($(radio), value); else return false;},                            
                                //scrollingAPI: jScrollApi,
                                elementAdd: function(selector, type, selfAPIObject) {return methods.elementAdd(selector, type, selfAPIObject)},
                                elementDisable: function(selector) {return methods.elementDisable(selector)},
                                elementEnable: function(selector) {return methods.elementEnable(selector)}
                                
                            };
                    selects = {};        
                    $.data($(this).get(0), 'publicApi', publicApi);
                    
                    return true;
                }
            };

        /**
        *   Add onDomChange custom event. Temporary limit for 100ms refresh frequency 
        */
        if (options.autoTracking) {
            $(document).on('onDomChange.jClever', function(e){
                if (typeof timeLinkTraking != 'undefied' && timeLinkTraking != null)
                    clearTimeout(timeLinkTraking); 
                timeLinkTraking = setTimeout(function(){methods.refresh(that);}, delayTime);
            });
        }    
        if (options.autoInit) {
            $(document).on('onDomChange.jClever', function(e){
                if (typeof timeLinkInit != 'undefied' && timeLinkInit != null)
                    clearTimeout(timeLinkInit); 
                timeLinkInit = setTimeout(function(){
                    var selector = 'form';
                    if (options.autoinitClass != '')
                        selector = options.autoinitClass;
                    $('body').find(selector).each(function(){
                        startFunction.call(this);
                    });    
                }, delayTime);
            });
        }    

        return this.each(function(){
            startFunction.call(this);
        });
    };
    $.fn.jCleverAPI = function(methodName) {
        if (this.length>1) return false;
        var publicApi = $.data($(this).get(0), 'publicApi');
        var params = [];
        for(var i = 1; i< arguments.length; i++) {
            params[i-1] = arguments[i];
        }
        
        if (typeof publicApi[methodName] == 'function') {
            if (arguments.length == 1)
                params = new Array($(this));
            else
                params[arguments.length-1] = publicApi;

            var newAPI = publicApi[methodName].apply(arguments.callee, params);
            
            if (typeof newAPI == 'object')
                $.data($(this).get(0), 'publicApi', newAPI);
            else
                newAPI = publicApi;
            return newAPI;
        } else
            return publicApi[methodName];
    };
    
    /**************************Helpers********************/
    jQuery.jClever = true;
    //Thanks jNiсe for idea
        $(document).mousedown(function(event){
            if ($(event.target).parents('.jClever-element-select-wrapper').length === 0) { $('.jClever-element-select-list-wrapper:visible').hide(); }
    });
})(jQuery);    
