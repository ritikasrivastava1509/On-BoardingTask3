$(function () {
    var model = new modelView();
    ko.applyBindings(model);
    model.viewSales();
});

function salesViewModel() {
    var that = this;
    that.ID = ko.observable();
    that.CustomerID = ko.observable();
    that.ProductID = ko.observable();
    that.StoreID = ko.observable();
    that.DateSold = ko.observable();
    that.CustomerName = ko.observable();
    that.ProductName = ko.observable();
    that.StoreName = ko.observable();
}


function modelView() {
    var self = this;
    self.salesViewModel = new salesViewModel();
    self.Sales = ko.observableArray();
    self.AllCustomers = ko.observableArray();
    self.AllProducts = ko.observableArray();
    self.SelectedCustomer = ko.observable();
    self.SelectedProduct = ko.observable();
    self.AllStores = ko.observableArray();
    self.SelectedDateSold = ko.observable();
    self.SelectedSales = ko.observable();
    self.SelectedStore = ko.observable();
    //Details
    self.viewSales = function () {
        var thisObj = this;
        try {
            $.ajax({
                url: '/Sales/GetSalesList',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    thisObj.Sales(data);//Here we are assigning values to KO Observable array  
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        } catch (e) {
            window.location.href = '/Sales/Index';
        }
    };
    //Create

    try {
        $.ajax({
            url: '/Customers/GetCustomerList',
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                self.AllCustomers(data);//Here we are assigning values to KO Observable array  
            },
            error: function (err) {
                alert(err.status + " : " + err.statusText);
            }
        });
    } catch (e) {
        window.location.href = '/Sales/Index';
    }

    try {
        $.ajax({
            url: '/Products/GetProductList',
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                self.AllProducts(data);//Here we are assigning values to KO Observable array  
            },
            error: function (err) {
                alert(err.status + " : " + err.statusText);
            }
        });
    } catch (e) {
        window.location.href = '/Sales/Index';
    }

    try {
        $.ajax({
            url: '/Stores/GetStoreList',
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {

                self.AllStores(data);//Here we are assigning values to KO Observable array  
            },
            error: function (err) {
                alert(err.status + " : " + err.statusText);
            }
        });
    } catch (e) {
        window.location.href = '/Sales/Index';
    }

    self.AddNewSales = function () {
        $('#MySales').modal()
    };

    self.AllNewSalesRecord = function () {
        try {
            
            var self = this;
            self.salesViewModel.DateSold(self.SelectedDateSold());
            self.salesViewModel.ProductID(self.SelectedProduct());
            self.salesViewModel.CustomerID(self.SelectedCustomer());
            self.salesViewModel.StoreID(self.SelectedStore());
            
            var jsondata = ko.toJSON(self);
            $.ajax({
                url: '/Sales/CreateSales',
                type: 'POST',
                dataType: 'json',
                data: jsondata,
                contentType: 'application/json',
                success: function (data) {
                    window.location.href = '/Sales/Index';
                    self.Sales(data);//Here we are assigning values to KO Observable array  
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        } catch (e) {
            window.location.href = '/Sales/Index';
        }
    };
    //update
    self.EditSales = function (data) {
        self.SelectedSales(data);
        $("#MyEditSales").modal();
    }

    self.SaveSales = function () {
        var jsondata = ko.toJSON(self.SelectedSales());
        $.ajax({
            type: "POST",
            url: "/Sales/UpdateSaleRecord",
            data: jsondata,
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                $("#MyEditSales").modal('hide');
                self.Sales(data);
                // for redirecting to landing page after data submission is completed
                window.location.href = "/Sales/Index";
            },
            error: function (data) {
                alert(data.responseText)
            }
        });
    };

    //Delete
    self.DeletedSales = function (data) {
            self.SelectedSales(data);
            $("#MyDeleteSales").modal();
                  }
    self.DeleteSalesRecord = function () {
        var jsondata = ko.toJSON(self.SelectedSales());
        $.ajax({
            type: "POST",
            url: "/Sales/DeleteConfirmed",
            data: { id: self.SelectedSales().ID},
            dataType: 'json',
            success: function (data) {
                $("#MyDeleteSales").modal('hide');
                self.Sales(data);
                // for redirecting to landing page after data submission is completed
                window.location.href = "/Sales/Index";
            },
            error: function (data) {
                alert(data.responseText)
            }
        });
    };

           
};


