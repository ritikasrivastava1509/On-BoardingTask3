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
    model.viewCustomer();
    ko.applyBindings(model);


});

function customerViewModel(data) {
    var that = this;
    that.ID = ko.observable(data.ID);
    that.Name = ko.observable(data.Name).extend({ required: true, minLength: 2, maxLength: 10 });
    that.Address = ko.observable(data.Address).extend({ required: true, minLength: 2, maxLength: 50 });
    that.validationErrors = ko.validation.group(that);
    that.CanSave = ko.computed(function () {
        that.validationErrors.showAllMessages();
        return that.errors().length === 0;
    }, this
    );


}

var emptyCustomer = {
    ID: 0,
    Name: '',
    Address: ''
}

function modelView() {
    var self = this;
    self.Customers = ko.observableArray([]);
    self.SelectedCustomer = ko.observable();
    self.CustomerExist = ko.observable();
    self.errors = ko.validation.group(self);
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
        if (self.errors().length === 0) {
            try {
                var jsondata = ko.toJSON(self.SelectedCustomer());
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
        }
        else {

            self.errors.showAllMessages();
        }
    };

//Add Function
self.AddCustomer = function (data) {
    self.SelectedCustomer(new customerViewModel(emptyCustomer));
    $("#MyCustomer").modal();
}
    //Update Function

    self.EditCustomer = function (data) {
        self.SelectedCustomer(new customerViewModel(data));
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

        self.SelectedCustomer(new customerViewModel(data));
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
