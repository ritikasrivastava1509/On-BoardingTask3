using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PROJECT2_CRUD_JQUERY_AJAX.Models
{
    public class ProductViewModel
    {
        public int ID { get; set; }
        
        public string Name { get; set; }
        
        public decimal Price { get; set; }
    }
}