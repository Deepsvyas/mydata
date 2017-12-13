$(function () {

    getajaxlist();

    var buyer_id = "";

    $('body').on('click', '.addBuyer', function (e) {
        e.preventDefault();
        formReset();
        buyer_id = "";
        $('#buyerModal').modal('show');
    });

    $('body').on('click', '.editBuyer', function (e) {
        e.preventDefault();
        formReset();
        buyer_id = $(this).data('id');
        getContent();
        $('#buyerModal').modal('show');
    });


    $('#buyerFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "buyers/addnew",
            type: 'post',
            data: dataS + '&buyer_id=' + buyer_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    $('#buyerModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deleteBuyer', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        buyer_id = $(this).data('id');
        var confrm = confirm("Are you sure?");
        if (confrm) {
            $.ajax({
                url: ADMIN_HTTP_PATH + "buyers/deleteBuyer",
                type: 'post',
                data: 'buyer_id=' + buyer_id,
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
            url: ADMIN_HTTP_PATH + "buyers/getContent",
            type: 'post',
            data: 'buyer_id=' + buyer_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#buyername').val(data.result.buyername);

                }
            }
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();

    });
function refreshTable() {
        var table = $('#buyerTable').DataTable();
        table.ajax.reload();
    }

    function getajaxlist() {
        $('#buyerTable').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": { search: "",searchPlaceholder: "Search..." },
            "ajax": {
                "url": ADMIN_HTTP_PATH + "buyers/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id",  'sortable' : false},
                {"data": "user_name",  'sortable' : false},
                {"data": "email"},
                {"data": "contact_number"},
                {"data": "address"},
                {"data": "created_at"},
                {"data": "action",  'sortable' : false}
            ]
        });
    }


});