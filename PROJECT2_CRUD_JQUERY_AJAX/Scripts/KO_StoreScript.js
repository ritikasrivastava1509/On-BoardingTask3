$(function () {
    var model = new modelView();
    ko.applyBindings(model);
    model.viewStore();
});

function storeViewModel() {
    var that = this;
    that.ID = ko.observable();
    that.Name = ko.observable();
    that.Address = ko.observable();
}
function modelView() {
    var self = this;
    self.storeViewModel = new storeViewModel();
    self.Stores = ko.observableArray([]);
    self.SelectedStore = ko.observable();
    self.StoreExist = ko.observable();
    //Details
    self.viewStore = function () {

        var thisObj = this;
        try {
            $.ajax({
                url: '/Stores/GetStoreList',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    thisObj.Stores(data);//Here we are assigning values to KO Observable array  
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        } catch (e) {
            window.location.href = '/Stores/Index';
        }
    };
    //Create
    self.AddNewStoreRecord = function () {
        try {
            var jsondata = ko.toJSON(self);
            $.ajax({
                url: '/Stores/CreateStore',
                type: 'POST',
                dataType: 'json',
                data: jsondata,
                contentType: 'application/json',
                success: function (data) {
                    window.location.href = '/Stores/Index';
                    self.Stores(data);//Here we are assigning values to KO Observable array  
                },
                error: function (err) {
                    alert(err.status + " : " + err.statusText);
                }
            });
        } catch (e) {
            window.location.href = '/Stores/Index';
        }
    };
    //Update Function

    self.EditStore = function (data) {
        self.SelectedStore(data);
        $("#MyStoreEdit").modal();
    }

    self.SaveStore = function () {
        var jsondata = ko.toJSON(self.SelectedStore());
        $.ajax({
            type: "POST",
            url: "/Stores/EditStoreRecord",
            data: { id: self.SelectedStore().ID },
            dataType: 'json',
            success: function (data) {
                $("#MyStoreEdit").modal('hide');
                self.Stores(data);
                // for redirecting to landing page after data submission is completed
                window.location.href = "/Stores/Index";
            },
            error: function (data) {
                alert(data.responseText)
            }
        });
    };
    //Delete
    self.ShowDeletedStore = function (data) {
        
        self.SelectedStore(data);
        $("#errorMessageText").text("")
        $("#btnDeleteStore").prop('disabled', false)
        $("#MyStoreDelete").modal();
        var jsondata = ko.toJSON(self.SelectedStore());
        $.ajax({
            type: "POST",
            url: "/Stores/Delete",
            data: jsondata,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data.isExist == true) {
                    
                    $("#errorMessageText").text("Sorry you cannot delete this Store");
                    $("#btnDeleteStore").prop('disabled', true)
                }
            },
            error: function (data) {

            }
        });
    };
    self.DeletedStore = function () {
        var jsondata = ko.toJSON(self.SelectedStore());
        $.ajax({
            type: "POST",
            url: "/Stores/DeleteConfirmed",
            data: jsondata,
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {

                $("#MyStoreDelete").modal('hide');
                self.Stores(data);
                // for redirecting to landing page after data submission is completed
                window.location.href = "/Stores/Index";
            },
            error: function (data) {

            }
        });
    }

};
