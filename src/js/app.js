$(function(){

    $('.accordion-header').click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).next('.accordion-content').slideUp();
        } else {
            $('.accordion-header.active').removeClass('active').next('.accordion-content').slideUp();
            $(this).addClass('active');
            $(this).next('.accordion-content').slideDown();
        }
    });

    $('#openMenu').click(function () {
        $(this).toggleClass('open');
        $('.overlay').toggleClass('open');
    });

    $('body').on('click', '.dropdown-menu', function () {
        $(this).toggleClass('active');
        $(this).find('ul').slideToggle();
    });

});
