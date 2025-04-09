$(document).ready(function () {
    $('.faq-question').click(function () {
        $(this).next('.faq-answer').toggleClass('active');
        $(this).find('.faq-toggle').toggleClass('active');
    });
});