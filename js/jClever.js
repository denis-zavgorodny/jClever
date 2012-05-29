/*
*   jClever HEAD:v 0.2 :)
*
*   by Denis Zavgorodny
*   zavgorodny@alterego.biz.ua
*
*   UPD:    up to v 0.1.1
*           + scroll by scrollPane (https://github.com/vitch/jScrollPane/archives/master)
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
                                                file: true
                                                }
                                },
                                options
                                );
        var selects = [];                        
        var jScrollApi = [];
        var formState = {};                     
        var methods = {
                        init: function(element) {
                            var innerCounter = 9999;
                            var tabindex = 1;
                            
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
                            //Hook reset event
                            $('button[type=reset]').click(function(){
                                methods.reset();
                            });
                        },
                        destroy: function() {
                            //select strip
                            $('form.clevered').find('select').each(function(){
                                var tmp = $(this).clone();
                                $(this).parents('.jClever-element').empty().after(tmp);
                            });
                            //checkbox strip
                            $('form.clevered').find('input[type=checkbox]').each(function(){
                                var tmp = $(this).removeClass('hidden').clone();
                                $(this).parents('.jClever-element').empty().after(tmp);
                            });
                            //radio strip
                            $('form.clevered').find('input[type=radio]').each(function(){
                                var tmp = $(this).removeClass('hidden').clone();
                                $(this).parents('.jClever-element').empty().after(tmp);
                            });
                            
                            $('.jClever-element').remove();
                            $('form.clevered').removeClass('clevered');
                        },
                        reset: function() {
                            $('form.clevered').find('input[type=radio], input[type=checkbox], select, input[type=file]').each(function(){
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
                        selectActivate: function(select, innerCounter, tabindex) {
                            jScrollApi[$(select).attr('name')] = {};
                            selects[$(select).attr('name')] = {
                                object: $(select),
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

                            $(select).wrap('<div class="jClever-element"><div class="jClever-element-select-wrapper"><div class="jClever-element-select-wrapper-design"><div class="jClever-element-select-wrapper-design">').after('<span class="jClever-element-select-center"></span><span class="jClever-element-select-right">v</span><div class="jClever-element-select-list-wrapper" style="z-index:'+innerCounter+';"><ul class="jClever-element-select-list"></ul></div>');
                            var selectObject = $(select).parents('.jClever-element').attr('tabindex',tabindex);
                            var selectText = selectObject.find('.jClever-element-select-center');
                            var selectRight = selectObject.find('.jClever-element-select-right');
                            var selectList = selectObject.find('.jClever-element-select-list');
                            var selectListWrapper = selectObject.find('.jClever-element-select-list-wrapper');
                            var selectLabel = $('label[for='+$(select).attr('id')+']');

                            $(select).find('option').each(function(){
                                selectObject.find('.jClever-element-select-list')
                                            .append($('<li data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                
                            });
                            selectText.text($(select).find('option:eq(0)').text());
                            selectObject.on('click', '.jClever-element-select-center, .jClever-element-select-right',function(){
                                if (selectListWrapper.is(':visible')) {
                                    $('.jClever-element-select-list-wrapper').hide();
                                } else {
                                    $('.jClever-element-select-list-wrapper').hide();
                                    selectListWrapper.show();
                                    jScrollApi[$(select).attr('name')] = selectListWrapper.jScrollPane().data('jsp');
                                }
                            });

                            selectListWrapper.blur(function(){
                                $(this).hide();
                            });
                            selectObject.on('click','li' ,function(event){
                                var value = $(this).data('value');
                                selectList.find('li.active').removeClass('active');
                                $(this).addClass('active');
                                $(select).find('option').removeAttr('selected');
                                $(select).find('option[value='+value+']').attr('selected','selected');
                                $(select).trigger('change');
                                selectListWrapper.hide();
                                return false;
                            });
                            $(select).change(function(){
                                selectText.text($(this).find(':selected').text());
                            });
                            $(select).bind('update',function(){
                                var ul = $(this).parents('.jClever-element-select-wrapper')
                                        .find('.jClever-element-select-list')
                                        .empty();
                                $(this).find('option').each(function(){
                                    ul.append($('<li data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                                });
                                $(this).parents('.jClever-element-select-wrapper').find('.jClever-element-select-center').text($(select).find('option:eq(0)').text());    
                            });
                            selectObject.focus(function(){$(this).addClass('focused')}).blur(function(){$(this).removeClass('focused')});
                            selectLabel.click(function(){
                                selectObject.trigger('focus');
                                selectListWrapper.show();
                                jScrollApi[$(select).attr('name')] = selectListWrapper.jScrollPane().data('jsp');
                            });
                            // Hook keydown
                            selectObject.keydown(function(e){
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
                                    case 9:
                                            selectListWrapper.hide();
                                    default:
                                        return;
                                        break;
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
                            $(checkbox).wrap('<div class="jClever-element" tabindex="'+tabindex+'">').addClass('hidden').after('<span class="jClever-element-checkbox-twins"></span>');
                            if ($(checkbox).is(':checked'))
                                $(checkbox).next('.jClever-element-checkbox-twins').addClass('checked');
                            $(checkbox).on('change', function(){
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
                            $(checkbox).parent('.jClever-element').keydown(function(e){
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
                            $(radio).wrap('<div class="jClever-element" tabindex="'+tabindex+'">').addClass('hidden').after('<span class="jClever-element-radio-twins"></span>');
                            if ($(radio).is(':checked'))
                                $(radio).next('.jClever-element-radio-twins').addClass('checked');
                            $(radio).on('change', function(){
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
                            $(radio).parent('.jClever-element').keydown(function(e){
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
                            $(file).wrap('<div class="jClever-element" tabindex="'+tabindex+'"><div class="jClever-element-file">').addClass('hidden-file').after('<span class="jClever-element-file-name"></span><span class="jClever-element-file-button"></span>').wrap('<div class="input-file-helper">');
                            
                            var jCleverElementFileName = $(file).parents('.jClever-element').find('.jClever-element-file-name');
                            $(file).change(function(){
                                var _name = $(this).val();
                                _name = _name.split("\\");
                                _name = _name[_name.length-1];
                                jCleverElementFileName.text(_name);
                            });

                            // Hook keydown
                            $(file).parents('.jClever-element').keydown(function(e){
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
                        }
        };
        var publicApi = {
                            selectCollection: selects,
                            destroy: function() {methods.destroy()},
                            reset: function() {methods.reset()},
                            selectSetPosition: function(select, value) {methods.selectSetPosition(select, value);},
                            checkboxSetState: function(checkbox, value) {methods.checkboxSetState(checkbox, value);},                            
                            radioSetState: function(radio, value) {methods.radioSetState(radio, value);},                            
                            scrollingAPI: jScrollApi
                            
                        };
        this.publicMethods = publicApi;    
        return this.each(function(){
            $(this).addClass('clevered');
            methods.init(this);
        });
    };
    /**************************Helpers********************/
    //Thanks jNiсe for idea
        $(document).mousedown(function(event){
            if ($(event.target).parents('.jClever-element-select-wrapper').length === 0) { $('.jClever-element-select-list-wrapper:visible').hide(); }
    });
})(jQuery);    
