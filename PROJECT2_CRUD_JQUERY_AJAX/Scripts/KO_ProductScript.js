$(function () {

    ko.validation.init({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        errorClass: 'errorStyle',
        messageTemplate: null

    }, true);

    var model = new modelView();

    model.viewProduct();
   
    ko.applyBindings(model);
});

function productViewModel(data) {
    var that = this;
    that.ID = ko.observable(data.ID);
    that.Name = ko.observable(data.Name).extend({ required: true, minLength: 2, maxLength: 17 });
    that.Price = ko.observable(data.Price).extend({ required: true });
    that.validationErrors = ko.validation.group(that);
    that.CanSave = ko.computed(function () {
        that.validationErrors.showAllMessages();
        return that.errors().length === 0;
    }, this
    );

    
}

var emptyProduct = {
    ID: 0,
    Name: '',
    Price: ''
}

function modelView() {
    var self = this;
    
    self.Products = ko.observableArray([]);
    self.SelectedProduct = ko.observable();
    self.ProductExist = ko.observable();
    self.errors = ko.validation.group(self);
    

    //Create
    self.AddNewProductRecord = function () {
        if (self.errors().length === 0) {
            try {
                var jsondata = ko.toJSON(self);
                $.ajax({
                    url: '/Products/CreateProduct',
                    type: 'POST',
                    dataType: 'json',
                    data: jsondata,
                    contentType: 'application/json',
                    success: function (data) {
                        window.location.href = '/Products/Index';
                        self.Products(data);//Here we are assigning values to KO Observable array  
                    },
                    error: function (err) {
                        alert(err.status + " : " + err.statusText);
                    }
                });
            } catch (e) {
                window.location.href = '/Products/Index';
            }
        }
        else {

            self.errors.showAllMessages();
        }
    };
    //Details
    self.viewProduct = function () {

        var thisObj = this;
        try {
            $.ajax({
                url: '/Products/GetProductList',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    thisObj.Products(data);//Here we are assigning values to KO Observable array  
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        } catch (e) {
            window.location.href = '/Products/Index';
        }
    };
    //Add Function
    self.AddProduct = function (data) {
        self.SelectedProduct(new productViewModel(emptyProduct));
        $("#MyProduct").modal();
    }
    //Update Function
    self.EditProduct = function (data) {
        self.SelectedProduct(new productViewModel(data));
        $("#MyProductEdit").modal();
    }
    //saved edited item
    self.SaveProduct = function () {
        var jsondata = ko.toJSON(self.SelectedProduct());
        $.ajax({
            type: "POST",
            url: "/Products/EditProductRecord",
            data: jsondata,
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                $("#MyProductEdit").modal('hide');
                self.Products(data);
                // for redirecting to landing page after data submission is completed
                window.location.href = "/Products/Index";
            },
            error: function (data) {
                alert(data.responseText)
            }
        });
    };
    //show delete item
    self.ShowDeletedProduct = function (data) {
        
        $("#MyProductDelete").modal();
        self.SelectedProduct(new productViewModel(data));
        $("#errorMessageText").text("")
        $("#deleteProduct").prop('disabled', false)
        
        var jsondata = ko.toJSON(self.SelectedProduct());
        $.ajax({
            type: "POST",
            url: "/Products/Delete",
            data: jsondata,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data.isExist === true) {
                    $("#errorMessageText").text("Sorry you cannot delete this product");

                    $("#deleteProduct").prop('disabled', true)
                }
            },
            error: function (data) {

            }
        });
    };
    //delete item
    self.DeleteProduct = function () {
        var jsondata = ko.toJSON(self.SelectedProduct());
        $.ajax({
            type: "POST",
            url: "/Products/DeleteConfirmed",
            data: jsondata,
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {

                $("#MyProductDelete").modal('hide');
                self.Products(data);
                // for redirecting to landing page after data submission is completed
                window.location.href = "/Products/Index";
            },
            error: function (data) {

            }
        });
    }
};