$(function () {

    getajaxlist();

    var order_id = "";

    $('body').on('click', '.addOrder', function (e) {
        e.preventDefault();
        formReset();
        order_id = "";
        $('#orderModal').modal('show');
    });

    $('body').on('click', '.editOrder', function (e) {
        e.preventDefault();
        formReset();
        order_id = $(this).data('id');
        getContent();
        $('#orderModal').modal('show');
    });


    $('#orderFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "orders/addnew",
            type: 'post',
            data: dataS + '&order_id=' + order_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    $('#orderModal').modal('hide');
                    refreshTable()
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deleteOrder', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        order_id = $(this).data('id');
        var confrm = confirm("Are you sure?");
        if (confrm) {
            $.ajax({
                url: ADMIN_HTTP_PATH + "orders/deleteorder",
                type: 'post',
                data: 'order_id=' + order_id,
                dataType: 'json',
                success: function (data, status) {
                    if (data.success) {
                        refreshTable();

                    }
                }
            });
        }
    });



    function getContent() {
        $.ajax({
            url: ADMIN_HTTP_PATH + "orders/getContent",
            type: 'post',
            data: 'order_id=' + order_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#ordername').val(data.result.ordername);

                }
            }
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();

    });


    function refreshTable() {
        var table = $('#orderTable').DataTable();
        table.ajax.reload();
    }


    function getajaxlist() {
        $('#orderTable').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": {search: "", searchPlaceholder: "Search..."},
            "ajax": {
                "url": ADMIN_HTTP_PATH + "orders/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "shop_name"},
                {"data": "shop_id"},
                {"data": "contact_no"},
                {"data": "category_id"},
                {"data": "action", 'sortable': false}
            ]
        });
    }


});