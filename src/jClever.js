/**
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
                                    autoinitSelector: '',
                                    cacheXHRTime: 1000,
                                    cacheXHRLength: 5
                                },
                                options
                                );
        var selects = {};                        
        var jScrollApi = [];
        var formState = {},
            $errors = {
                validation: 'validation'
            };  
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
                            var _element = $(element);
                            
                            //validate form
                            if (options.validate.state === true) {
                                
                                _element.submit(function(){
                                    var _form = $(this).get(0);
                                    var errorsForm = {};
                                    $(_form).find('.error').removeClass('error');
                                    for (var validateItem in options.validate.items) {
                                        if (!(_form[validateItem] === undefined)) {
                                            for (var validateType in options.validate.items[validateItem]) {
                                                switch(validateType) {
                                                    case "custom": 
                                                        if (typeof options.validate.items[validateItem].fn == 'function' && options.validate.items[validateItem].fn(_form[validateItem].value) != true) {
                                                            errorsForm[validateItem] = options.validate.items[validateItem][validateType];
                                                        }
                                                        break;
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
                                    var isError = 0,
                                        errorResponse = [];
                                    for(var key in errorsForm) {
                                        if (_form[key] != undefined) {
                                            var labelText = errorsForm[key];
                                            var formElement = $(_form[key]);
                                            var wrapper = formElement.parents('.jClever-element');
                                            var error = wrapper.find('.'+options.errorClassTemplate);
                                            var _id = formElement.attr('id');
                                            var _label = $('label[for='+_id+']').addClass('error');
                                            wrapper.addClass('error');
                                            error.text(labelText);
                                            errorResponse.push({type: $errors.validation,element: formElement, text: labelText});
                                            isError++;
                                        }
                                    }
                                    if (isError) {
                                        $(_form).trigger('error.jClever', [errorResponse]);
                                        return false;
                                    } else    
                                        return true;
                                });
                            }
                            
                            
                            //placeholder INPUT[type=text], textarea init
                            _element.find('input[type=text], input[type=password], textarea').each(function(){
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
                            var formElements = _element.get(0).elements;
                            var formHash = '';
                            if (typeof formElements != 'undefined')
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
                                                    if (options.applyTo.input && (self.attr('type') == 'text' || self.attr('type') == 'password') && typeof self.data('autocomplete') == 'undefined') {
                                                        methods.inputActivate(formElements[key], tabindex);
                                                        self.data('jclevered',true);
                                                        tabindex++;
                                                    }
                                                    //Input [type=autocomplete]
                                                    if (options.applyTo.input && (self.attr('type') == 'text') && typeof self.data('autocomplete') != 'undefined') {
                                                        methods.autocompleteActivate(formElements[key],innerCounter, tabindex);
                                                        self.data('jclevered',true);
                                                        tabindex++;
                                                        innerCounter++;
                                                    }        
                                                    break;                                                          
                                    }
                                }
                            _element.find('input[type=password]').each(function(){
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

                            _element.data('jCleverHash', md5(formHash));
                            //Hook reset event
                            _element.find('button[type=reset]').click(function(){
                                methods.reset(_element);
                            });

                        },
                        refresh: function(form) {
                            var formElements = $(form).get(0).elements;
                            if (typeof formElements == 'undefined')
                                return false;
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
                                                        self.trigger('updates.jClever');
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
                                    data.innerContent += this.innerText+this.value;
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
                            select.trigger('update');
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
                        updateFromHTML: function(select, data){
                            select.html(data).trigger('update');
                        },
                        fileSetState: function(file, value) {
                            file.parents('.jClever-element-file').find('.jClever-element-file-name').text(value);
                        },
                        selectCollectionExtend: function(collection, element) {
                            collection[element.attr('name')] = {
                                object: element,
                                updateFromHTML: function(data){
                                    $('select[name="'+this.object[0].name+'"]').html(data).trigger('update');
                                    return false;
                                },
                                updateFromJsonObject: function(data){
                                    var _data = '';
                                    for(var key in data) {
                                        _data += '<option value="'+key+'">'+data[key]+'</option>';
                                    }
                                    $('select[name="'+this.object[0].name+'"]').html(_data).trigger('update');
                                    return false;
                                }
                            };
                            return collection;
                        },
                        multiSelectActivate: function(select, innerCounter, tabindex) {
                            if ($(select).hasClass('jc-ignore'))
                                    return;
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
                            var selectLabel = $(select).attr('id')?$('label[for='+$(select).attr('id')+']'):$('labels');

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
                                    _text += "<span class='multiple-item' data-value='"+$(this).val()+"'><span class='multiple-item-text'>"+$(this).text()+"</span><a href='#' class='multiple-item-remove'></a></span>";
                                });
                                if (_text.length == 0)
                                    selectText.html('&nbsp;');
                                else
                                    selectText.html(_text);//selectText.html(_text.substring(0,_text.length-2));
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

                            selectObject.on('click.jClever', '.multiple-item-remove', function(){
                                var self = $(this),
                                    element = self.closest('span');
                                $(select).find('option[value="'+element.data('value')+'"]').removeAttr('selected');
                                $(select).trigger('change');
                                $(select).trigger('update.jClever');
                                return false;
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
                                    //_text += $(this).text()+', ';
                                    _text += "<span class='multiple-item' data-value='"+$(this).val()+"'><span class='multiple-item-text'>"+$(this).text()+"</span><a href='#' class='multiple-item-remove'></a></span>";
                                });
                                selectText.html(_text);//selectText.text(_text.substring(0,_text.length-2));


                            });
                            $(select).on('update.jClever',function(){
                                var ul = $(this).parents('.jClever-element-select-wrapper')
                                        .find('.jClever-element-select-list')
                                        .empty(),

                                        self = $(this);
                                self.find('option').each(function(){
                                    var _option = $(this);
                                    ul.append($('<li class="'+(_option.attr('selected')=='selected'?"active":"")+'" data-value="'+_option.val()+'"><span><i>'+_option.text()+'</i></span></li>'));
                                });
                                
                                self.find('option:selected').each(function(){
                                    //_text += $(this).text()+', ';
                                    _text += "<span class='multiple-item' data-value='"+$(this).val()+"'><span class='multiple-item-text'>"+$(this).text()+"</span><a href='#' class='multiple-item-remove'></a></span>";
                                });
                                self.trigger('change.jClever');
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
                                var self = $(this),
                                    selectedIndex = !isNaN(self.data('current'))?self.data('current'):0,
                                    isSelect = false;
                                

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
                                        isSelect = true;  
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
                                        isSelect = true;     
                                        break;
                                    case 9: /* Tab */
                                            selectListWrapper.hide();
                                            isSelect = true;
                                            return true;
                                           
                                    default: /* Key select */
                                        
                                            
                                        break;
                                        return false;
                                }
                                //$(select)[0].selectedIndex = selectedIndex;
                                self.data('current', selectedIndex);
                                selectObject.find('li.selected').removeClass('selected');
                                selectObject.find('li:eq('+selectedIndex+')').addClass('selected');
                                if (isSelect) {
                                    var _current = $(select).find('option:eq('+selectedIndex+')');
                                    if (_current.attr('selected') == 'selected') {
                                        _current.removeAttr('selected');
                                    } else {
                                        _current.attr('selected', 'selected');
                                    }
                                    
                                    
                                    $(select).trigger('change');
                                    $(select).trigger('update');
                                }
                                if (selectListWrapper.is(':visible'))
                                    jScrollApi[$(select).attr('name')].scrollToElement(selectObject.find('li:eq('+selectedIndex+')'));
                                return false;
                            });
                        },
                        selectActivate: function(select, innerCounter, tabindex) {
                            if ($(select).hasClass('jc-ignore'))
                                    return;
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
                            var selectLabel = $(select).attr('id')?$('label[for='+$(select).attr('id')+']'):$('labels');

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
                                var value = $(this).attr('data-value'),
                                    _select = $(select);
                                selectList.find('li.active').removeClass('active');
                                $(this).addClass('active');
                                _select.find('option[selected=selected]').removeAttr('selected');
                                _select.find('option[selected=selected]').prop('selected', false);
                                _select.find('option[value="'+value+'"]').prop('selected',true);
                                _select.find('option[value="'+value+'"]').attr('selected','selected');
                                _select.trigger('change');
                                
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
                                //selectObject.removeClass('focused');
                                //selectObject.removeClass('opened');
                            });
                            $(select).on('update.jClever',function(){
                                select = this;
                                var ul = $(this).parents('.jClever-element-select-wrapper')
                                        .find('.jClever-element-select-list')
                                        .empty();
                                $(this).find('option').each(function(){
                                    ul.append($('<li data-value="'+$(this).val()+'" class="'+($(this).prop('selected')?"active":"")+'  '+($(this).is(':disabled') ? 'disabled' : '') +'"><span><i>'+$(this).text()+'</i></span></li>'));
                                });
                                $(this).parents('.jClever-element-select-wrapper').find('.jClever-element-select-center').text($(select).find('option:selected')?$(select).find('option:selected').text():$(select).find('option:not(:disabled):first').text());    
                            });
                            //selectObject.on('focus.jClever', function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused'); $(this).removeClass('opened');});
                            selectObject.on('focus.jClever', function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused'); $(this).removeClass('opened');$(select).trigger('blur');});
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
                            if ($(checkbox).hasClass('jc-ignore'))
                                    return;
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
                            if ($(radio).hasClass('jc-ignore'))
                                    return;
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
                                
                            _radio.on('change.jClever, updates.jClever', function(e){
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
                                if (e.type != 'updates') { 
                                    $('input:radio[name="'+ $(radio).attr('name') +'"]').not($(this)).each(function(){
                                        var _self = $(this);

                                        _self.removeAttr('checked').prop('checked', false).next('.jClever-element-radio-twins').removeClass('checked');
                                        $('label[for='+$(this).attr('id')+']').removeClass('active');
                                    });    
                                }
                            });
                            _radio.next('.jClever-element-radio-twins').on('click', function(){
                                var _self = $(this);
                                if (_self.prev('input[type=radio]').is(':checked'))
                                    _self.prev('input[type=radio]').attr('checked','checked').prop('checked', true);
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
                            if ($(button).hasClass('jc-ignore'))
                                    return;
                            var value = $(button).attr('value');
                            var newButton = $(button).replaceWith('<button type="'+ button.type +'" name="'+ button.name +'" id="'+ button.id +'"  class="styled '+ button.className +'" value="'+ value +'"><span><span><span>'+ value +'</span></span></span>');
                            elementHash = md5(methods.elementToString(newButton));
                            newButton.data('jCleverHash',elementHash);
                        },
                        fileActivate: function(file, tabindex) {
                            if ($(file).hasClass('jc-ignore'))
                                    return;
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
                        autocompleteActivate: function(input, innerCounter, tabindex) {
                            var $self = $(input);
                            /**
                             * data for autocomplete
                             * @type Array
                             */
                            var data = [];

                            var dataSourceName = $self.data('source');
                            var dataRequestType = (typeof $self.data('request-type') != 'undefined'?$self.data('request-type'):null);
                            if (dataRequestType == null) {
                                dataSourceName = window[dataSourceName];
                            } else {
                                switch(dataRequestType) {
                                    case 'POST':
                                        dataRequestType = 'POST';
                                        break; 
                                    case 'post':
                                        dataRequestType = 'POST';
                                        break;     
                                    case 'GET':
                                        dataRequestType = 'GET';
                                        break;         
                                    case 'get':
                                        dataRequestType = 'GET';
                                        break;
                                    default:
                                        dataRequestType = 'GET';                 
                                }
                            }
                            var customRenderFunction = $self.data('render');
                            var jScrollAPI;
                            var resultIndexes = [];
                            var selectedIndex = 0;
                            var searchPhrase;
                            //var searchDelay = 0;
                            var searchDelay = (typeof $self.data('search-delay') != 'undefined'?$self.data('search-delay'):800);
                            var minLength = (typeof $self.data('min-length') != 'undefined'?$self.data('min-length'):3);
                            var ajaxBusy = false;
                            var searchTimer;
                            var tmpData;
                            var cacheStorage = [];
                            if ($self.hasClass('jc-ignore'))
                                    return;
                            jScrollApi[$self.attr('name')] = {};

                            var self_width = $self.width();
                            $self.wrap('<div class="jClever-element" style="z-index:'+innerCounter+';"><div class="jClever-element-autocomplete-wrapper" style="width:'+self_width+'px; z-index:'+innerCounter+';"><div class="jClever-element-autocomplete-wrapper-design"><div class="jClever-element-autocomplete-wrapper-design">')
                            .after('<span class="jClever-element-input-center">&nbsp;</span><span class="jClever-element-input-right"><span>v</span></span><div class="jClever-element-input-list-wrapper" style="z-index:'+innerCounter+';"><div class="jClever-element-input-list-wrapper-"><div class="jClever-element-input-list-wrapper--"><ul class="jClever-element-input-list"></ul></div></div></div>');




                            var autocompleteObject = $self.parents('.jClever-element').attr('tabindex',tabindex);
                            var autocompleteText = autocompleteObject.find('.jClever-element-input-center');
                            var autocompleteRight = autocompleteObject.find('.jClever-element-input-right');
                            var autocompleteList = autocompleteObject.find('.jClever-element-input-list');
                            var autocompleteListWrapper = autocompleteObject.find('.jClever-element-input-list-wrapper');
                            var autocompleteListWrapperToScroll = autocompleteObject.find('.jClever-element-input-list-wrapper--');
                            var autocompleteLabel = $self.attr('id')?$('label[for='+$self.attr('id')+']'):$('labels');

                            if ($(input).attr('disabled'))
                                autocompleteObject.addClass('disabled');
                            //Add error label
                            autocompleteObject.append(options.errorTemplate);
                            $self.on('keydown.jClever', function(e){
                                switch(e.keyCode){
                                    case 13:
                                        return false;
                                }
                                
                            });
                            autocompleteRight.on('click.jClever', function(){
                                if (autocompleteListWrapper.is(':visible')) {
                                    autocompleteListWrapper.hide();
                                    autocompleteListWrapper.removeClass('opened');
                                } else {
                                    if ($self.attr('disabled') || resultIndexes.length == 0)
                                        return false;
                                    autocompleteListWrapper.show();
                                    autocompleteObject.addClass('opened');
                                    jScrollAPI = autocompleteListWrapperToScroll.jScrollPane().data('jsp');
                                } 
                            });
                            $self.on('keyup.jClever',function(e) {
                                var preSelectedInex = resultIndexes;
                                if (typeof searchTimer != 'undefined')
                                    clearTimeout(searchTimer);
                                switch(e.keyCode){
                                    case 40: /* Down */
                                        if (selectedIndex < resultIndexes.length-1){ selectedIndex++; }
                                        break;
                                    case 38: /* Up */
                                        if (selectedIndex > 0){ selectedIndex--; }
                                        break; 
                                    case 13: /* Enter */
                                        if (autocompleteListWrapper.is(':visible')) {
                                            autocompleteListWrapper.hide();
                                            autocompleteListWrapper.removeClass('opened');
                                            $self.val(tmpData[resultIndexes[selectedIndex]].value);
                                            $self.trigger('selected.jclever', [tmpData, selectedIndex, resultIndexes]);
                                        } else {
                                            if ($self.attr('disabled'))
                                                return false;
                                            autocompleteListWrapper.show();
                                            autocompleteObject.addClass('opened');
                                            $self.val(tmpData[resultIndexes[selectedIndex]].value);
                                            jScrollAPI = autocompleteListWrapperToScroll.jScrollPane().data('jsp');
                                        } 
                                        break;    
                                    default: 
                                       searchPhrase = $self.val();  
                                       if ($self.val() != '' && $self.val().length >= minLength && !ajaxBusy)
                                            searchTimer = setTimeout(function(){$self.trigger('searchstart.jClever')}, searchDelay);      

                                }
                                if (preSelectedInex != selectedIndex)
                                    $self.trigger('navigate.jClever');

                                return false;
                            });
                            $self.on('searchstart.jClever',function(e) {
                                resultIndexes = [];
                                tmpData = [];
                                //заполняем автокомплит локальными данными
                                if (dataRequestType == null && dataSourceName.length) {
                                    var needl = $self.val().toLowerCase();
                                    for(var i = 0; i < dataSourceName.length; i++) {
                                        var str = dataSourceName[i].value.toLowerCase();
                                        if(str.indexOf(needl) + 1) {
                                            resultIndexes.push(i);
                                        }
                                    }
                                    tmpData = dataSourceName;
                                    cacheStorage.push({
                                        data: tmpData,
                                        time: new Date()
                                    });
                                    //console.log(cacheStorage);
                                    if (resultIndexes.length == 0)
                                        autocompleteListWrapper.hide();
                                    $self.trigger('searchend.jClever');
                                }
                                //Заполняем автокомплит данными по сетевому запросу
                                if (dataRequestType != null && typeof dataRequestType != 'undefined') {
                                    var q = $self.val().toLowerCase();
                                    for (var i = 0; i < cacheStorage.length; i++) {
                                        if (cacheStorage[i].request == q) {
                                            tmpData = cacheStorage[i]['data'];
                                            for(var i = 0; i < tmpData.length; i++) {
                                                var str = tmpData[i].value.toLowerCase();
                                                if(str.indexOf(q) + 1) {
                                                    resultIndexes.push(i);
                                                }
                                            }
                                            if (resultIndexes.length == 0)
                                                autocompleteListWrapper.hide();
                                            $self.trigger('searchend.jClever');   
                                            break;
                                        }
                                    }
                                    
                                    if (tmpData.length < 1) {
                                        ajaxBusy = true;
                                        $.ajax({
                                            url: dataSourceName, 
                                            data: {search:q},
                                            dataType: 'json',
                                            type: dataRequestType
                                            }).done(function(response){

                                                for(var i = 0; i < response.length; i++) {
                                                    var str = response[i].value.toLowerCase();
                                                    if(str.indexOf(q) + 1) {
                                                        resultIndexes.push(i);
                                                    }
                                                }
                                                tmpData = response;
                                                var timeStamp = new Date();
                                                cacheStorage.push({
                                                    request: q, 
                                                    data: tmpData,
                                                    time: timeStamp.getTime()
                                                });
                                                if (resultIndexes.length == 0)
                                                    autocompleteListWrapper.hide();
                                                $self.trigger('searchend.jClever');   
                                                methods.memoization(q, cacheStorage);        
                                            }).fail(function(){

                                            }).always(function(){
                                                ajaxBusy = false;
                                            });
                                    }   

                                }
                            });
                            $self.on('navigate.jClever', function(e){
                                autocompleteList.find('li.active').removeClass('active'); 
                                var el = autocompleteList.find('li:eq('+selectedIndex+')').addClass('active');
                                jScrollAPI.scrollToElement(el);
                            });

                            $self.on('searchend.jClever',function(e) {
                                if (resultIndexes.length == 0)
                                    return false;
                                var template = '';
                                if (typeof customRenderFunction != 'undefined' && typeof jQuery.fn.jClever[customRenderFunction] == 'function') {
                                    template = jQuery.fn.jClever[customRenderFunction].call($self, resultIndexes, tmpData);
                                } else {
                                    for(var i = 0; i < resultIndexes.length; i++) {
                                        template += '<li>'+tmpData[resultIndexes[i]]['value']+'</li>';
                                    }    
                                }
                                
                                
                                autocompleteList.html(template);

                                autocompleteListWrapper.show();
                                jScrollAPI = autocompleteListWrapperToScroll.jScrollPane().data('jsp');
                                $self.trigger('autocompletedraw.jClever');
                            });

                            autocompleteListWrapper.on('blur.jClever', function(){
                                $(this).hide();
                                autocompleteObject.removeClass('opened');
                            });
                            
                            autocompleteListWrapper.on('click','li' ,function(event){
                                var value = $(this).attr('data-value'),
                                    _input = $(input);
                                autocompleteList.find('li.active').removeClass('active');
                                $(this).addClass('active');
                                
                                _input.trigger('change');
                                
                                autocompleteListWrapper.hide();
                                autocompleteObject.removeClass('opened');
                                selectedIndex = $(this).index();
                                $self.val(tmpData[resultIndexes[selectedIndex]].value);
                                $self.trigger('selected.jclever', [tmpData, selectedIndex, resultIndexes]);
                                return false;
                            });

                            $self.on('selected.jclever', function(e,data, selected, selectedIndex){
                                
                            });



                            

                            
                        },
                        memoization: function(needl, stack) {
                            if (stack.length > options.cacheXHRLength)
                                stack.shift();
                        },
                        inputActivate: function(input, tabindex) {
                            if ($(input).hasClass('jc-ignore'))
                                    return;
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
                            if ($(textarea).hasClass('jc-ignore'))
                                    return;
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
                            if (typeof selfAPIObject == 'undefined')
                                return false;
                            switch(type) {
                                case "text":
                                case "password":
                                            if (!options.applyTo.input)
                                                break;
                                            if (typeof selector != 'string')
                                                selector.each(function(){
                                                    if (typeof selector.data('autocomplete') != 'undefined') { //Автокомплит
                                                        methods.autocompleteActivate($(this),innerCounter, tabindex);
                                                        tabindex++;
                                                        innerCounter++;    
                                                    } else {
                                                        methods.inputActivate($(this), tabindex);    
                                                    }
                                                    $(this).data('jclevered',true);
                                                });
                                            else {
                                                if (typeof selector.data('autocomplete') != 'undefined') { //Автокомплит
                                                    methods.autocompleteActivate($(this),innerCounter, tabindex);
                                                    tabindex++;
                                                    innerCounter++;    
                                                } else {
                                                    methods.inputActivate(selector, tabindex);
                                                }
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
                        },
                        themeSet: function(name) {
                            $(this).removeClass(options.selfClass).addClass(name);
                            options.selfClass = name;
                        }
        };
        
        var publicApi = {};
        var that = this;

        var delayTime = 10,
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
                                updateFromHTML: function(select, value){if ($(select).length) methods.updateFromHTML($(select), value); else return false;},
                                //scrollingAPI: jScrollApi,
                                elementAdd: function(selector, type, selfAPIObject) {return methods.elementAdd(selector, type, selfAPIObject)},
                                elementDisable: function(selector) {return methods.elementDisable(selector)},
                                elementEnable: function(selector) {return methods.elementEnable(selector)},
                                themeSet: function(name) {return methods.themeSet.call($(this), name);}
                                
                            };
                    selects = {};        
                    $.data($(this).get(0), 'publicApi', publicApi);
                    
                    return true;
                }
            };

        /**
        *   Add onDomChange custom event. Temporary limit for 100ms refresh frequency 
        */
            
        if (options.autoInit) {
            $(document).on('onDomChange.jClever', function(e){
                if (typeof timeLinkInit != 'undefied' && timeLinkInit != null)
                    clearTimeout(timeLinkInit); 
                timeLinkInit = setTimeout(function(){
                    var selector = 'form';
                    if (options.autoinitSelector != '')
                        selector = options.autoinitSelector;
                    $('body').find(selector).each(function(){
                        startFunction.call(this);
                        if ($.inArray(this,that) == -1)
                            that.push(this);
                    });     
                }, delayTime);
            });
        }
        if (options.autoTracking) {
            $(document).on('onDomChange.jClever', function(e){
                if (typeof timeLinkTraking != 'undefied' && timeLinkTraking != null)
                    clearTimeout(timeLinkTraking);
                timeLinkTraking = setTimeout(function(){
                    that.each(function(){
                        methods.refresh(this);
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

            //var newAPI = publicApi[methodName].apply(arguments.callee, params);
            var newAPI = publicApi[methodName].apply($(this), params);
            
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
            if ($(event.target).closest('.jClever-element-input-list-wrapper').length === 0) { $('.jClever-element-input-list-wrapper:visible').hide(); }
    });
})(jQuery);    
