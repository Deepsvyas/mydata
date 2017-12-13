$(function () {
    
    getajaxlist();
    var shop_id = "";

    $('body').on('click', '.addShop', function (e) {
        e.preventDefault();
        formReset();
        shop_id = "";
        $('#shopModal').modal('show');
    });

    $('body').on('click', '.editShop', function (e) {
        e.preventDefault();
        formReset();
        shop_id = $(this).data('id');
        getContent();
        $('#shopModal').modal('show');
    });


    $('#shopFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "shops/addnew",
            type: 'post',
            data: dataS + '&shop_id=' + shop_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    $('#shopModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deleteShop', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        shop_id = $(this).data('id');
        var confrm = confirm("Are you sure?");
        if (confrm) {
            $.ajax({
                url: ADMIN_HTTP_PATH + "shops/deleteShop",
                type: 'post',
                data: 'shop_id=' + shop_id,
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
            url: ADMIN_HTTP_PATH + "shops/getContent",
            type: 'post',
            data: 'shop_id=' + shop_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#shopname').val(data.result.shopname);

                }
            }
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();

    });
    
     function refreshTable() {
        var table = $('#shopTable').DataTable();
        table.ajax.reload();
    }


    function getajaxlist() {
        $('#shopTable').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": { search: "",searchPlaceholder: "Search..." },
            "ajax": {
                "url": ADMIN_HTTP_PATH + "shops/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id",  'sortable' : false},
                {"data": "shop_name"},
                {"data": "shop_id"},
                {"data": "contact_no"},
                {"data": "category_id"},
                {"data": "action",  'sortable' : false}
            ]
        });
    }


});