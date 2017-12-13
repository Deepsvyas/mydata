$(function () {

    getajaxlist();

    var gst_id = "";

    $('body').on('click', '.addGST', function (e) {
        e.preventDefault();
        formReset();
        gst_id = "";
        $('#gstModal').modal('show');
    });

    $('body').on('click', '.editGST', function (e) {
        e.preventDefault();
        formReset();
        gst_id = $(this).data('id');
        getContent();
        $('#gstModal').modal('show');
    });


    $('#gstFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "g-s-t/addnew",
            type: 'post',
            data: dataS + '&gst_id=' + gst_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    $('#gstModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deleteGST', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        gst_id = $(this).data('id');
        var confrm = confirm("Are you sure?");
        if (confrm) {
            $.ajax({
                url: ADMIN_HTTP_PATH + "g-s-t/deleteGST",
                type: 'post',
                data: 'gst_id=' + gst_id,
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
            url: ADMIN_HTTP_PATH + "g-s-t/getContent",
            type: 'post',
            data: 'gst_id=' + gst_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#gst_slabs').val(data.result.gst_slabs);
                    $('#gst_rate').val(data.result.gst_rate);

                }
            }
        });
    }

    function getajaxlist() {
        $('#gstTable').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": { search: "",searchPlaceholder: "Search..." },
            "ajax": {
                "url": ADMIN_HTTP_PATH + "g-s-t/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id",  'sortable' : false},
                {"data": "gst_slabs"},
                {"data": "gst_rate"},
                {"data": "action",  'sortable' : false}
            ]
        });
    }
function refreshTable() {
        var table = $('#gstTable').DataTable();
        table.ajax.reload();
    }
    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});