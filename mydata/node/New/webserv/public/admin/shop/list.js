$(function () {

    getajaxlist();
    var shopid = "";

    $('body').on('click', '.addShop', function (e) {
        e.preventDefault();
        formReset();
        shopid = "";
        $('#shopModal').modal('show');
    });

    $('body').on('click', '.editShop', function (e) {
        e.preventDefault();
        formReset();
        shopid = $(this).data('id');
        getContent();
        $('#shopModal').modal('show');
    });


    $('#shopFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "shops/addnew",
            type: 'post',
            data: dataS + '&shopid=' + shopid,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                    $('#shopModal').modal('hide');
                    refreshTable();
                } else if (data.error == 1) {
                    errors_display(data.error_mess);
                } else if (data.error == 2) {
                    swal("Oops!", data.success_mess, "error");
                }
            }
        });
    });

    $('body').on('click', '.deleteShop', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        shopid = $(this).data('id');
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: ADMIN_HTTP_PATH + "shops/deleteShop",
                    type: 'post',
                    data: 'shopid=' + shopid,
                    dataType: 'json',
                    success: function (data, status) {
                        if (data.success) {
                            refreshTable();
                        }
                    }
                });
            }
        });
    });



    function getContent() {
        $.ajax({
            url: ADMIN_HTTP_PATH + "shops/getContent",
            type: 'post',
            data: 'shopid=' + shopid,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#shop_name').val(data.result.shop_name);
                    $('#shop_id').val(data.result.shop_id);
                    $('#email').val(data.result.email);
                    $('#contact_no').val(data.result.contact_no);
                    $('#category').val(data.result.category_id);
                    $('#account_name').val(data.result.account_name);
                    $('#account_number').val(data.result.account_number);
                    $('#bank_name').val(data.result.bank_name);
                    $('#branch_name').val(data.result.branch_name);
                    $('#ifcs_code').val(data.result.ifcs_code);
                    $('#gst_no').val(data.result.gst_no);

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
            "language": {search: "", searchPlaceholder: "Search..."},
            "ajax": {
                "url": ADMIN_HTTP_PATH + "shops/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "shop_name"},
                {"data": "shop_id"},
                {"data": "email"},
                {"data": "contact_no"},
                {"data": "category_id"},
                {"data": "bankdetails"},
                {"data": "action", 'sortable': false}
            ]
        });
    }


});