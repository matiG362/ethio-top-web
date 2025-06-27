// $(document).ready(function () {
//     $('.menu-button').click(function () {
//         $('nav.header-links').toggleClass('active');
//     });
// });



$(document).ready(function () {
    $('.menu-button').click(function () {
        $('nav.header-links').toggleClass('open'); // Changed 'active' to 'open' to match CSS
    });

    // Optional: Basic jQuery for dropdowns on mobile
    $('.nav-item.dropdown > a').click(function (e) {
        if ($(window).width() <= 768) { // Apply only on mobile/tablet
            e.preventDefault(); // Prevent link navigation
            $(this).next('.dropdown-content').slideToggle();
            $(this).find('.dropdown-arrow').toggleClass('open'); // You might need CSS for .open on arrow
        }
    });
});