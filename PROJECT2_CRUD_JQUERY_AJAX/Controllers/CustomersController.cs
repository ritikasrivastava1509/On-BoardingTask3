using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using PROJECT2_CRUD_JQUERY_AJAX.Models;

namespace PROJECT2_CRUD_JQUERY_AJAX.Controllers
{
    public class CustomersController : Controller
    {
        private MVCEntities db = new MVCEntities();

        // GET: Customers
        public ActionResult Index()
        {
            return View("");
        }
        // Get: Customer list to display on the landing page
        public JsonResult GetCustomerList()
        {

            List<CustomerViewModel> customerModel = db.Customers.Select(x => new CustomerViewModel
            {
                ID = x.ID,
                Name = x.Name,
                Address = x.Address
            }).ToList();
            return Json(customerModel, JsonRequestBehavior.AllowGet);
        }
        // Save data in the Customer database
        public JsonResult CreateCustomer(CustomerViewModel customerViewModel)
        {

            Customer customer = new Customer();
            customer.Name = customerViewModel.Name;
            customer.Address = customerViewModel.Address;
            db.Customers.Add(customer);
            db.SaveChanges();
            return Json(customerViewModel, JsonRequestBehavior.AllowGet);
        }

        // Get  for Customer editing
        public JsonResult GetCustomerRecord(int id)
        {
            var customerModel = db.Customers.Where(x => x.ID == id).Select(y => new CustomerViewModel
            {
                ID = y.ID,
                Name = y.Name,
                Address = y.Address
            }).FirstOrDefault();

            return Json(customerModel, JsonRequestBehavior.AllowGet);
        }

        // Save the edited Customer in the database
        public JsonResult EditCustomerRecord([Bind(Include = "ID,Name,Address")] CustomerViewModel customerViewModel)
        {
            var cust = db.Customers.Find(customerViewModel.ID);
            cust.Name = customerViewModel.Name;
            cust.Address = customerViewModel.Address;
            db.SaveChanges();
            return Json(customerViewModel, JsonRequestBehavior.AllowGet);
        }
        // GET:  Customer/Delete/5
        public JsonResult Delete(CustomerViewModel customerViewModel)
        {

            var customer = db.Customers.Find(customerViewModel.ID);
            if (customer == null)
            {
                return Json("Not found", JsonRequestBehavior.AllowGet);
            }
            CustomerViewModel customerViewModel1 = new CustomerViewModel
            {
                ID = customer.ID,
                Name = customer.Name,
                Address = customer.Address,

            };
            var isExist = customer.ProductSolds.Any();
            return Json(new { customerViewModel = customerViewModel1, isExist = isExist }, JsonRequestBehavior.AllowGet);
        }

        // POST: Customers/Delete/5
        public JsonResult DeleteConfirmed(CustomerViewModel customerViewModel)
        {
            Customer customer = db.Customers.Find(customerViewModel.ID);

            db.Customers.Remove(customer);
            db.SaveChanges();
            return Json(customerViewModel, JsonRequestBehavior.AllowGet);
        }



        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}

