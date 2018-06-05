using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PROJECT2_CRUD_JQUERY_AJAX.Models
{
    public class SalesViewModel
    {
        public int ID { get; set; }
        public int ProductID { get; set; }
        public int CustomerID { get; set; }
        public int StoreID { get; set; }
        public System.DateTime DateSold { get; set; }

        public string  CustomerName { get; set; }
        public string  ProductName { get; set; }
        public string  StoreName { get; set; }
    }
}