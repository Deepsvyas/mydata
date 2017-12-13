$(function () {

    getajaxlist();

    var category_id = "";

    $('body').on('click', '.addCat', function (e) {
        e.preventDefault();
        formReset();
        category_id = "";
        $('#catModal').modal('show');
    });

    $('body').on('click', '.editCat', function (e) {
        e.preventDefault();
        formReset();
        category_id = $(this).data('id');
        getContent();
        $('#catModal').modal('show');
    });


    $('#catFrm').submit(function (e) {
        e.preventDefault();
        var dataS = $(this).serialize();
        $.ajax({
            url: ADMIN_HTTP_PATH + "categories/addnew",
            type: 'post',
            data: dataS + '&category_id=' + category_id,
            dataType: 'json',
            success: function (data, status) {
                errors_remove();
                if (data.success) {
                    alert(data.success_mess);
                    $('#catModal').modal('hide');
                    refreshTable();
                } else {
                    errors_display(data.error_mess);
                }
            }
        });
    });

    $('body').on('click', '.deleteCat', function (e) {
        e.preventDefault();
        formReset();
        var _this = this;
        category_id = $(this).data('id');
        var confrm = confirm("Are you sure?");
        if (confrm) {
            $.ajax({
                url: ADMIN_HTTP_PATH + "categories/deleteCat",
                type: 'post',
                data: 'category_id=' + category_id,
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
            url: ADMIN_HTTP_PATH + "categories/getContent",
            type: 'post',
            data: 'category_id=' + category_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#categoryname').val(data.result.categoryname);

                }
            }
        });
    }

function refreshTable() {
        var table = $('#example').DataTable();
        table.ajax.reload();
    }

    function getajaxlist() {
        $('#example').DataTable({
            "processing": true,
            "serverSide": true,
            "draw": 1,
            "language": { search: "",searchPlaceholder: "Search..." },
            "ajax": {
                "url": ADMIN_HTTP_PATH + "categories/ajaxlist",
                "type": "POST"
            },
            "columns": [
                {"data": "_id",  'sortable' : false},
                {"data": "categoryname"},
                {"data": "action",  'sortable' : false}
            ]
        });
    }

    $('.refreshlist').click(function (e) {
        e.preventDefault();
        refreshTable();
    });

});