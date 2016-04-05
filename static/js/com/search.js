define([
    'jquery'
], function($) {
    var $searchButton = $('.search-button'),
        $searchElement = $('.global-search'),
        $searchBox = $('search-box'),
        $searchFormInput,
        $searchFormSubmitButton;



    var onCSELoaded = function(){
        $searchFormInput = $('input.gsc-input');
        $searchFormSubmitButton = $('input.gsc-search-button');
    };

    window.__gcse = {
        callback: onCSELoaded
    };

    //load google cse
    var cx = '004349664068998938688:esrfrrwnp64';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.src = '//cse.google.com/cse.js?cx=' + cx;
    gcse.async = false;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);



    $searchButton.on('click touch', function(e){
        e.stopPropagation();
        //var $searchFormInput = $('input.gsc-input'),
        //    $searchFormSubmitButton = $('input.gsc-search-button');

        if( $searchElement.hasClass('_expanded') && $searchFormInput.val() != ''){
            $searchFormSubmitButton.click()
        } else {
            if(!$searchElement.hasClass('_expanded')) {
                setTimeout(function(){
                    $searchFormInput.focus();
                }, 10);
            } else {
                $searchBox.blur()
            }
            $searchElement.toggleClass('_expanded');
        }
    });

    $(document).on('click touch', function(e){
        //var $searchFormInput = $('input.gsc-input');
        if ($searchElement.hasClass('_expanded') && e.target != $searchFormInput[0] && $searchFormInput.val() == '') {
            $searchElement.removeClass('_expanded');
        }
    });
});