$(function () {
    getajaxlist();

    var item_id = "";

    $('body').on('click', '.addItem', function (e) {
        e.preventDefault();
        formReset();
        item_id = "";
        $('#itemModal').modal('show');
    });

    $('body').on('click', '.editItem', function (e) {
        e.preventDefault();
        formReset();
        item_id = $(this).data('id');
        getContent();
        $('#itemModal').modal('show');
    });


    $('#catFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "items/addnew",
            type: 'post',
            data: dataS + '&item_id=' + item_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    $('#itemModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deleteItem', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        item_id = $(this).data('id');
        var confrm = confirm("Are you sure?");
        if (confrm) {
            $.ajax({
                url: ADMIN_HTTP_PATH + "items/deleteItem",
                type: 'post',
                data: 'item_id=' + item_id,
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
            url: ADMIN_HTTP_PATH + "items/getContent",
            type: 'post',
            data: 'item_id=' + item_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#itemname').val(data.result.itemname);

                }
            }
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();

    });

function refreshTable() {
        var table = $('#itemTable').DataTable();
        table.ajax.reload();
    }
    
    function getajaxlist() {
        $('#itemTable').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": { search: "",searchPlaceholder: "Search..." },
            "ajax": {
                "url": ADMIN_HTTP_PATH + "items/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id",  'sortable' : false},
                {"data": "item_name"},
                {"data": "shop_id"},
                {"data": "category_id"},
                {"data": "price"},
                {"data": "available_qty"},
                {"data": "description"},
                {"data": "action",  'sortable' : false}
            ]
        });
    }


});