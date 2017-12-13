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
                console.log(data);
                errors_remove();
                if (data.success==1) {
                    //alert(data.success_mess);
                    $('#buyerModal').modal('hide');
                    swal("Good job!", data.success_mess, "success");
                    refreshTable();
                }else if(data.success==0){
                    swal("Oops!", data.success_mess, "error");
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
                url: ADMIN_HTTP_PATH + "buyers/deleteBuyer",
                type: 'post',
                data: 'buyer_id=' + buyer_id,
                dataType: 'json',
                success: function (data, status) {
                    if (data.success) {
                       refreshTable();
                       swal("Deleted!", "Your record has been deleted.", "success");
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
            url: ADMIN_HTTP_PATH + "buyers/getContent",
            type: 'post',
            data: 'buyer_id=' + buyer_id,
            dataType: 'json',
            success: function (data, status) {
                if (data.success) {
                    $('#first_name').val(data.result.first_name);
                    $('#last_name').val(data.result.last_name);
                    $('#email').val(data.result.email);
                    $('#contact_no').val(data.result.contact_number);
                    $('#address').val(data.result.address);

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