/*
*   jClever HEAD:v 1.0 :)
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
                                    fileUploadText: 'Загрузить'
                                                
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
        var innerCounter = 9999;
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
                            $(element).find('input[type=text], textarea').each(function(){
                                var _this = $(this);
                                var holderText = $(this).data('placeholder');
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
                            });
                            //Select init
                            if (options.applyTo.select)
                                $(element).find('select').each(function(){
                                    formState[$(this).attr('name')] = {
                                                                            type: "select",
                                                                            value: $(this).attr('value')
                                                                        };
                                    methods.selectActivate(this,innerCounter, tabindex);
                                    innerCounter--;
                                    tabindex++;
                                });

                            //Checkbox init
                            if (options.applyTo.checkbox)
                                $(element).find('input[type=checkbox]').each(function(){
                                    formState[$(this).attr('name')] = {
                                                                            type: "checkbox",
                                                                            value: ($(this).is(':checked')?1:0)
                                                                        };
                                    methods.checkboxActivate(this, tabindex);
                                    tabindex++;
                                });
                            //Radio Button init
                            if (options.applyTo.radio)
                                $(element).find('input[type=radio]').each(function(){
                                    formState[$(this).attr('name')] = {
                                                                            type: "radio",
                                                                            value: ($(this).is(':checked')?1:0)
                                                                        };
                                    methods.radioActivate(this, tabindex);
                                    tabindex++;
                                });
                            //Input File
                            if (options.applyTo.file)
                                $(element).find('input[type=file]').each(function(){
                                    formState[$(this).attr('name')] = {
                                                                            type: "file",
                                                                            value: ''
                                                                        };
                                    methods.fileActivate(this, tabindex);
                                    tabindex++;
                                });
                            
                            //Input [type=submit, reset, button] (input)
                            if (options.applyTo.button)
                                $(element).find('input[type=submit], input[type=reset], input[type=button]').each(function(){
                                    methods.submitActivate(this, tabindex);
                                    tabindex++;
                            });
                            //Input [type=text]
                            if (options.applyTo.input)
                                $(element).find('input[type=text], input[type=password]').each(function(){
                                    methods.inputActivate(this, tabindex);
                                    tabindex++;
                            });
                            //Textarea
                            if (options.applyTo.textarea)
                                $(element).find('textarea').each(function(){
                                    methods.textareaActivate(this, tabindex);
                                    tabindex++;
                            });
                            //Hook reset event
                            $('button[type=reset]').click(function(){
                                methods.reset();
                            });
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
                        selectSetPosition: function(select, value) {
                            select.find('option').removeAttr('selected');
                            select.find('option[value='+value+']').attr('selected','selected');
                            select.trigger('change');
                        },
                        selectAdd: function(selector) {
                                $(element).find(selector).each(function(){
                                    formState[$(this).attr('name')] = {
                                                                            type: "select",
                                                                            value: $(this).attr('value')
                                                                        };
                                    methods.selectActivate(this,innerCounter, tabindex);
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
                        selectActivate: function(select, innerCounter, tabindex) {
                            jScrollApi[$(select).attr('name')] = {};
                            selects = methods.selectCollectionExtend(selects, $(select));
                            var self_width = $(select).width();
                            $(select).wrap('<div class="jClever-element" style="z-index:'+innerCounter+';"><div class="jClever-element-select-wrapper" style="width:'+self_width+'px; z-index:'+innerCounter+';"><div class="jClever-element-select-wrapper-design"><div class="jClever-element-select-wrapper-design">').after('<span class="jClever-element-select-center"></span><span class="jClever-element-select-right"><span>v</span></span><div class="jClever-element-select-list-wrapper" style="z-index:'+innerCounter+';"><ul class="jClever-element-select-list"></ul></div>');
                            var selectObject = $(select).parents('.jClever-element').attr('tabindex',tabindex);
                            var selectText = selectObject.find('.jClever-element-select-center');
                            var selectRight = selectObject.find('.jClever-element-select-right');
                            var selectList = selectObject.find('.jClever-element-select-list');
                            var selectListWrapper = selectObject.find('.jClever-element-select-list-wrapper');
                            var selectLabel = $('label[for='+$(select).attr('id')+']');

                            //Add error label
                            selectObject.append(options.errorTemplate);
                            $(select).find('option').each(function(){
                                if ($(this).is(':selected'))
                                    selectObject.find('.jClever-element-select-list')
                                                .append($('<li class="active" data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                else
                                    selectObject.find('.jClever-element-select-list')
                                                .append($('<li data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                
                            });
                            if ($(select).find(':selected'))
                                selectText.text($(select).find('option:selected').text());
                            else
                                selectText.text($(select).find('option:eq(0)').text());
                            selectObject.on('click.jClever', '.jClever-element-select-center, .jClever-element-select-right',function(){
                                if (selectListWrapper.is(':visible')) {
                                    $('.jClever-element-select-list-wrapper').hide();
                                } else {
                                    $('.jClever-element-select-list-wrapper').hide();
                                    selectListWrapper.show();
                                    jScrollApi[$(select).attr('name')] = selectListWrapper.jScrollPane().data('jsp');
                                }
                            });

                            selectListWrapper.on('blur.jClever', function(){
                                $(this).hide();
                            });
                            selectObject.on('click.jClever','li' ,function(event){
                                var value = $(this).attr('data-value');
                                selectList.find('li.active').removeClass('active');
                                $(this).addClass('active');
                                $(select).find('option').removeAttr('selected');
                                $(select).find('option[value='+value+']').attr('selected','selected');
                                $(select).trigger('change');
                                selectListWrapper.hide();
                                return false;
                            });
                            $(select).on('change.jClever', function(){
                                selectText.text($(this).find(':selected').text());
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
                                jScrollApi[$(select).attr('name')] = selectListWrapper.jScrollPane().data('jsp');
                            });
                            // Hook keydown
                            selectObject.on('keydown.jClever', function(e){
                                var selectedIndex = $(select)[0].selectedIndex;
                                switch(e.keyCode){
                                    case 40: /* Down */
                                        if (selectedIndex < $(select).find('option').length-1){ selectedIndex++; }
                                        break;
                                    case 38: /* Up */
                                        if (selectedIndex > 0){ selectedIndex--; }
                                        break;
                                    case 13: /* Enter */
                                        if (selectListWrapper.is(':visible'))
                                            selectListWrapper.hide();
                                        else {
                                            selectListWrapper.show();
                                            jScrollApi[$(select).attr('name')] = selectListWrapper.jScrollPane().data('jsp');
                                        }    
                                        break;
                                    case 32: /* Space */
                                        if (selectListWrapper.is(':visible'))
                                            selectListWrapper.hide();
                                        else {
                                            selectListWrapper.show();
                                            jScrollApi[$(select).attr('name')] = selectListWrapper.jScrollPane().data('jsp');
                                        }    
                                        break;
                                    case 9: /* Tab */
                                            selectListWrapper.hide();
                                            return true;
                                           
                                    default: /* Key select */
                                        var tmpIndex = 0;
                                        var count = $(select)[0].options.length;
                                        for (var key  = 0; key < count; key ++) {
                                            if (typeof $(select)[0].options[key].text == 'string') {
                                                var localString = $(select)[0].options[key].text.toUpperCase();
                                                if (String.fromCharCode(e.keyCode) == localString[0]) {
                                                    selectedIndex = tmpIndex;
                                                }    
                                                tmpIndex++;
                                            }
                                        }
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
                            $(checkbox).parents('.jClever-element').append(options.errorTemplate);
                            if ($(checkbox).is(':checked'))
                                $(checkbox).next('.jClever-element-checkbox-twins').addClass('checked');
                            $(checkbox).on('change.jClever', function(){
                                if ($(this).is(':checked'))
                                    $(checkbox).next('.jClever-element-checkbox-twins').addClass('checked');
                                else
                                    $(checkbox).next('.jClever-element-checkbox-twins').removeClass('checked');
                            });
                            $(checkbox).next('.jClever-element-checkbox-twins').on('click', function(){
                                if ($(this).prev('input[type=checkbox]').is(':checked'))
                                    $(this).prev('input[type=checkbox]').removeAttr('checked');
                                else
                                    $(this).prev('input[type=checkbox]').attr('checked', 'checked');
                                $(this).prev('input[type=checkbox]').trigger('change');    
                            });
                            // Hook keydown
                            $(checkbox).parent('.jClever-element').on('keydown.jClever', function(e){
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
                            $(checkbox).parent('.jClever-element').focus(function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused')});
                        },
                        radioActivate: function(radio, tabindex) {
                            $(radio).wrap('<div class="jClever-element" tabindex="'+tabindex+'">').addClass('hidden').after('<span class="jClever-element-radio-twins"><span class="jClever-element-radio-twins-element"></span><span class="jClever-element-radio-twins-color"></span></span>');
                            $(radio).parents('.jClever-element').append(options.errorTemplate);
                            if ($(radio).is(':checked'))
                                $(radio).next('.jClever-element-radio-twins').addClass('checked');
                            $(radio).on('change.jClever', function(){
                                if ($(this).is(':checked'))
                                    $(radio).next('.jClever-element-radio-twins').addClass('checked');
                                else
                                    $(radio).next('.jClever-element-radio-twins').removeClass('checked');
                                $('input:radio[name="'+ $(radio).attr('name') +'"]').not($(radio)).each(function(){
                                    $(this).attr('checked',false).next('.jClever-element-radio-twins').removeClass('checked');
                                });    
                            });
                            $(radio).next('.jClever-element-radio-twins').on('click', function(){
                                if ($(this).prev('input[type=radio]').is(':checked'))
                                    $(this).prev('input[type=radio]').attr('checked');
                                else
                                    $(this).prev('input[type=radio]').attr('checked', 'checked');
                                $(this).prev('input[type=radio]').trigger('change');    
                            });

                            // Hook keydown
                            $(radio).parent('.jClever-element').on('keydown.jClever', function(e){
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

                            
                            $(radio).parent('.jClever-element').focus(function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused')});
                        },
                        submitActivate: function(button, tabindex) {
                            var value = $(button).attr('value');
                            $(button).replaceWith('<button type="'+ button.type +'" name="'+ button.name +'" id="'+ button.id +'"  class="styled '+ button.className +'" value="'+ value +'"><span><span><span>'+ value +'</span></span></span>');
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
                            $(input).wrap('<div class="jClever-element" tabindex="'+tabindex+'"><div class="jClever-element-input"><div class="jClever-element-input"><div class="jClever-element-input">');
                            $(input).parents('.jClever-element').append(options.errorTemplate);
                            $(input).on('focusin.jClever', function(){
                                $(this).parents('.jClever-element').addClass('focused');
                            });
                            $(input).on('focusout.jClever', function(){
                                $(this).parents('.jClever-element').removeClass('focused');
                            });
                        },
                        textareaActivate: function(textarea, tabindex) {
                            $(textarea).wrap('<div class="jClever-element" tabindex="'+tabindex+'"><div class="jClever-element-textarea"><div class="jClever-element-textarea"><div class="jClever-element-textarea">');
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
                                case "input":
                                            break;
                                case "select":
                                            methods.selectActivate(selector, innerCounter, tabindex);
                                            var result = $.extend(selects, selfAPIObject.selectCollection);
                                            selfAPIObject.selectCollection = result;
                                            break;
                                case "checkbox":
                                            break;
                                case "radio":
                                            break;
                                case "textarea":
                                            break;
                                default:             
                            }
                            return selfAPIObject;
                        }
        };
        
        var publicApi = {};
        this.publicMethods = publicApi;
        
        return this.each(function(){
            if (!$(this).hasClass('clevered')) {
                $(this).addClass('clevered').addClass(options.selfClass);
                methods.init(this);
                publicApi = {
                            selectCollection: selects,
                            destroy: function(form) {methods.destroy(form)},
                            reset: function(form) {methods.reset(form)},
                            selectSetPosition: function(select, value) {methods.selectSetPosition(select, value);},
                            selectAdd: function(select) {methods.selectAdd(select);},
                            checkboxSetState: function(checkbox, value) {if ($(checkbox).length) methods.checkboxSetState($(checkbox), value); else return false},                            
                            radioSetState: function(radio, value) {if ($(radio).length) methods.radioSetState($(radio), value); else return false;},                            
                            scrollingAPI: jScrollApi,
                            elementAdd: function(selector, type, selfAPIObject) {return methods.elementAdd(selector, type, selfAPIObject)}
                            
                        };
                selects = {};        
                $.data($(this).get(0), 'publicApi', publicApi);
            }
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
