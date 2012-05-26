(function($){
    $.fn.jClever = function(options) {
        var options = $.extend(
                                {
                                    text: ''
                                },
                                options
                                );
        var selects = [];                        
        var methods = {
                        init: function(element) {
                            //Инициализируем селекты
                            var innerCounter = 9999;
                            var tabindex = 1;
                            $(element).find('select').each(function(){
                                methods.selectActivate(this,innerCounter, tabindex);
                                innerCounter--;
                                tabindex++;
                            });
                        },
                        destroy: function() {
                            //Раздеваем селекты
                            $('form.clevered').find('select').each(function(){
                                console.log($(this));
                                var tmp = $(this).clone();
                                $(this).parents('.jClever-element').empty().after(tmp);
                            });
                            $('.jClever-element').remove();
                            $('form.clevered').removeClass('clevered');
                        },
                        selectActivate: function(select, innerCounter, tabindex) {

                            selects[$(select).attr('name')] = {
                                                                    object: $(select),
                                                                    updateFromHTML: function(data){
                                                                                            $('select[name='+this.object[0].name+']').html(data).trigger('update');
                                                                                            
                                                                                            return false;
                                                                                        }
                                                                };

                            $(select).wrap('<div class="jClever-element"><div class="jClever-element-select-wrapper"><div class="jClever-element-select-wrapper-design"><div class="jClever-element-select-wrapper-design">').after('<span class="jClever-element-select-center"></span><span class="jClever-element-select-right"></span><ul class="jClever-element-select-list" style="z-index:'+innerCounter+';"></ul>');
                            var selectObject = $(select).parents('.jClever-element').attr('tabindex',tabindex);
                            var selectText = selectObject.find('.jClever-element-select-center');
                            var selectRight = selectObject.find('.jClever-element-select-right');
                            var selectList = selectObject.find('.jClever-element-select-list');
                            $(select).find('option').each(function(){
                                selectObject.find('.jClever-element-select-list')
                                            .append($('<li data-value="'+$(this).val()+'"><span><i>'+$(this).text()+'</i></span></li>'));
                            });
                            selectText.text($(select).find('option:eq(0)').text());
                            selectObject.on('click', '.jClever-element-select-center',function(){
                                selectList.show();
                            });
                            selectObject.on('click', '.jClever-element-select-right' ,function(){
                                selectList.show();
                            });
                            selectList.blur(function(){
                                $(this).hide();
                            });
                            selectObject.on('click','li' ,function(event){
                                var value = $(this).data('value');
                                $(select).find('option').removeAttr('selected');
                                $(select).find('option[value='+value+']').attr('selected','selected');
                                $(select).trigger('change');
                                selectList.hide();
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
                            // Отслеживаем нажатие клавиш для управления клавиатурой
                            selectObject.keydown(function(e){
                                var selectedIndex = $(select)[0].selectedIndex;
                                switch(e.keyCode){
                                    case 40: /* Down */
                                        if (selectedIndex < $(select).find('option').length-1){ selectedIndex++; }
                                        break;
                                    case 38: /* Up */
                                        if (selectedIndex > 0){ selectedIndex--; }
                                        break;
                                    default:
                                        return;
                                        break;
                                }
                                $(select)[0].selectedIndex = selectedIndex;
                                console.log(selectedIndex);
                                selectObject.find('li.selected').removeClass('selected');
                                selectObject.find('li:eq('+selectedIndex+')').addClass('selected');
                                selectObject.find('option').removeAttr('selected');
                                selectObject.find('option:eq('+selectedIndex+')').attr('selected','selected');
                                $(select).trigger('change');
                                return false;
                            });    
                        },
        };
        var publicApi = {
                            selectCollection: selects,
                            destroy: function() {methods.destroy()}
                        };
        this.jClever = publicApi;    
        return this.each(function(){
            $(this).addClass('clevered');
            methods.init(this);
        });
    };
    /**************************Вспомогательная секция********************/
    //Спасибо jNiсe за идею
        $(document).mousedown(function(event){
            if ($(event.target).parents('.jClever-element-select-wrapper').length === 0) { $('.jClever-element-select-list:visible').hide(); }
    });
})(jQuery);    
