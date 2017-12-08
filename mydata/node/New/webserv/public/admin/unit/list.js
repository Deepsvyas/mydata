$(function () {

    getajaxlist();

    var unit_id = "";

    $('body').on('click', '.addUnit', function (e) {
        e.preventDefault();
        formReset();
        unit_id = "";
        $('#unitModal').modal('show');
    });

    $('body').on('click', '.editUnit', function (e) {
        e.preventDefault();
        formReset();
        unit_id = $(this).data('id');
        getContent();
        $('#unitModal').modal('show');
    });


    $('#unitFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "units/addnew",
            type: 'post',
            data: dataS + '&unit_id=' + unit_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    swal("Good job!", data.success_mess, "success");
                    $('#unitModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deleteUnit', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        unit_id = $(this).data('id');
        swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: ADMIN_HTTP_PATH + "units/deleteUnit",
                    type: 'post',
                    data: 'unit_id=' + unit_id,
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
            url: ADMIN_HTTP_PATH + "units/getContent",
            type: 'post',
            data: 'unit_id=' + unit_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#unitname').val(data.result.unitname);
                    $('#unitcode').val(data.result.unitcode);

                }
            }
        });
    }
    function getajaxlist() {
        $('#unitTable').DataTable({
            "processing": true,
            "serverSide": true,
            "language": {search: "", searchPlaceholder: "Search..."},
            "ajax": {
                "url": ADMIN_HTTP_PATH + "units/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id", 'sortable': false},
                {"data": "unitname"},
                {"data": "unitcode"},
                {"data": "status"},
                {"data": "action", 'sortable': false}
            ]
        })
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

    function refreshTable() {
        var table = $('#unitTable').DataTable();
        table.ajax.reload();
    }

});