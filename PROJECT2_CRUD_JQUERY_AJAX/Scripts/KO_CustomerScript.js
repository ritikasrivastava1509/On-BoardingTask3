$(function () {
    var model = new modelView();
    ko.applyBindings(model);
    model.viewCustomer();
});

function customerViewModel() {
    var that = this;
    that.ID = ko.observable();
    that.Name = ko.observable();
    that.Address = ko.observable();
}
function modelView() {
    var self = this;
    self.customerViewModel = new customerViewModel();
    self.Customers = ko.observableArray([]);
    self.SelectedCustomer = ko.observable();
    self.CustomerExist = ko.observable();
    //Details
    self.viewCustomer = function () {

        var thisObj = this;
        try {
            $.ajax({
                url: '/Customers/GetCustomerList',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    thisObj.Customers(data);//Here we are assigning values to KO Observable array  
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        } catch (e) {
            window.location.href = '/Customers/Index';
        }
    };
    //Create
    self.AddNewCustomerRecord = function () {
        try {
            var jsondata = ko.toJSON(self);
            $.ajax({
                url: '/Customers/CreateCustomer',
                type: 'POST',
                dataType: 'json',
                data: jsondata,
                contentType: 'application/json',
                success: function (data) {
                    window.location.href = '/Customers/Index';
                    self.Customers(data);//Here we are assigning values to KO Observable array  
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        } catch (e) {
            window.location.href = '/Customers/Index';
        }
    };
    //Update Function

    self.EditCustomer = function (data) {
        self.SelectedCustomer(data);
        $("#MyCustomerEdit").modal();
    }

    self.SaveCustomer = function () {
        var jsondata = ko.toJSON(self.SelectedCustomer());
        $.ajax({
            type: "POST",
            url: "/Customers/EditCustomerRecord",
            data: jsondata,
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                $("#MyCustomerEdit").modal('hide');
                self.Customers(data);
                // for redirecting to landing page after data submission is completed
                window.location.href = "/Customers/Index";
            },
            error: function (data) {
                alert(data.responseText)
            }
        });
    };
    //Delete
    self.ShowDeletedCustomer = function (data) {
        
        self.SelectedCustomer(data);
        $("#errorMessageText").text("")
        $("#deleteCustomer").prop('disabled', false)
        $("#MyCustomerDelete").modal();
        var jsondata = ko.toJSON(self.SelectedCustomer());
        $.ajax({
            type: "POST",
            url: "/Customers/Delete",
            data: jsondata,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data.isExist == true) {
                    $("#errorMessageText").text("Sorry you cannot delete this Customer");
                    $("#deleteCustomer").prop('disabled', true)
                }
            },
            error: function (data) {

            }
        });
    };
    self.DeletedCustomer = function () {
        var jsondata = ko.toJSON(self.SelectedCustomer());
        $.ajax({
            type: "POST",
            url: "/Customers/DeleteConfirmed",
            data: jsondata,
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {

                $("#MyCustomerDelete").modal('hide');
                self.Customers(data);
                // for redirecting to landing page after data submission is completed
                window.location.href = "/Customers/Index";
            },
            error: function (data) {

            }
        });
    }
    
};
