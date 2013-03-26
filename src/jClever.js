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
                                    selfClass: 'default',
                                    fileUploadText: 'Загрузить',
                                    autoTracking: false,
                                    autoInit: false
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
                                    console.log(placeholder);
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
                                checkbox.attr('checked', 'checked');
                            else
                                checkbox.removeAttr('checked');
                            checkbox.trigger('change');    
                        },
                        radioSetState: function(radio, value) {
                            if (value == 1)
                                radio.attr('checked', 'checked');
                            else
                                radio.removeAttr('checked');
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
                                $(select).find('option[value="'+value+'"]').attr('selected','selected');
                                $(select).trigger('change');
                                selectListWrapper.hide();
                                selectObject.removeClass('opened');
                                return false;
                            });
                            $(select).on('change.jClever', function(){
                                var self = $(this),
                                    value = self.find('option[selected=selected]').text();
                                if (self.attr('disabled'))
                                    return false;
                                selectText.text(value);
                                selectObject.removeClass('focused');
                            });
                            $(select).on('update.jClever',function(){
                                var ul = $(this).parents('.jClever-element-select-wrapper')
                                        .find('.jClever-element-select-list')
                                        .empty();
                                $(this).find('option').each(function(){
                                    ul.append($('<li data-value="'+$(this).val()+'" class="'+($(this).is(':disabled') ? 'disabled' : '') +'"><span><i>'+$(this).text()+'</i></span></li>'));
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
                                    _self.prev('input[type=checkbox]').removeAttr('checked');
                                else
                                    _self.prev('input[type=checkbox]').attr('checked', 'checked');
                                _self.prev('input[type=checkbox]').trigger('change');    
                            });
                            // Hook keydown
                            _checkbox.parent('.jClever-element').on('keydown.jClever', function(e){
                                var _checkbox = $(this).find('input[type=checkbox]');
                                switch(e.keyCode){
                                    case 32: /* Space */
                                        if (_checkbox.is(':checked'))
                                            _checkbox.removeAttr('checked');
                                        else
                                            _checkbox.attr('checked', 'checked');
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
                                    _self.prev('input[type=radio]').attr('checked', 'checked');
                                _self.prev('input[type=radio]').trigger('change');    
                            });

                            // Hook keydown
                            _radio.parent('.jClever-element').on('keydown.jClever', function(e){
                                var _radio = $(this).find('input[type=radio]');
                                switch(e.keyCode){
                                    case 32: /* Space */
                                        if (_radio.is(':checked'))
                                            _radio.removeAttr('checked');
                                        else
                                            _radio.attr('checked', 'checked');
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
                    $('body').find('form').each(function(){
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
