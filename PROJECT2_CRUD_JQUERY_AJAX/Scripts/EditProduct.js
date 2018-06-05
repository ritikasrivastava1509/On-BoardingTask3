
function SaveProduct() {

    $.ajax({
        type: "POST",
        url: "/Products/EditProductRecord",
        data: {
            ID: $("#EditProductID").val(),
            Name: $("#EditProductName").val(),
            Price: $("#EditProductPrice").val()
        },
        success: function () {
            $("#MyProductEdit").modal('hide');
            // for redirecting to landing page after data submission is completed
            window.location.href = "/Products/Index";
        },
        error: function (data) {
            alert(data.responseText)
        }
    });
}