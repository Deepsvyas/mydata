$(function () {
    $('body').on('click', '.back_to_history', function (e) {
        e.preventDefault();
        window.history.back();
    });
})

function formReset() {
    errors_remove();
    $("input[type='text'],input[type='password'], input[type='email'], textarea").val('');
}

function errors_display(errors) {
    for (var i in errors) {
        $('label[for="' + errors[i].param + '"]').append('<span class="error-dis-deft" style="color:red">(' + errors[i].msg + ') *</span>');
    }
}
function errors_remove() {
    $('.error-dis-deft').remove();
}

function display_date(date) {
    var dis_date = new Date(date);
    return dis_date;
}

function checkActivePage() {
    return true;
}

