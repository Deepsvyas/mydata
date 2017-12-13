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


    $('#itemFrm').submit(function (e) {
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
                    //alert(data.success_mess);
                    swal("Good job!", data.success_mess, "success");
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

        swal({
          title: "Are you sure?",
          text: "Your will not be able to recover this imaginary file!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
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
          } else {
            swal("Your record is safe!");
          }
        });

    });



    function getContent() {
        $.ajax({
            url: ADMIN_HTTP_PATH + "items/getContent",
            type: 'post',
            data: 'item_id=' + item_id,
            dataType: 'json',
            success: function (data, status) {
                console.log(data.result.shop_id);
                if (data.success) {
                    $('#item_name').val(data.result.item_name);
                    $('#shop_id').val(data.result.shop_id);
                    $('#category_id').val(data.result.category_id);
                    // $('#category_id').prop('selectedIndex', "'"+data.result.category_id+"'");
                    //$('#category_id option[value="'+data.result.category_id+'"]').attr('selected', true)
                    $('#price').val(data.result.price);
                    $('#available_qty').val(data.result.available_qty);
                    $('#unit').val(data.result.unit);
                    $('#gst_slabs').val(data.result.gst_slabs);
                    $('#description').val(data.result.description);

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