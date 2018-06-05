using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using PROJECT2_CRUD_JQUERY_AJAX.Models;

namespace PROJECT2_CRUD_JQUERY_AJAX.Controllers
{
    public class SalesController : Controller
    {
        private MVCEntities db = new MVCEntities();

        // GET: ProductSolds
        public ActionResult Index()
        {
            return View();
        }

        // Get: Sales list to display on the landing page
        public JsonResult GetSalesList()
        {

            List<SalesViewModel> salesModel = db.ProductSolds.Select(x => new SalesViewModel
            {
                ID = x.ID,
                ProductID = x.ProductID,
                CustomerID = x.CustomerID,
                DateSold = x.DateSold,
                StoreID = x.StoreID,
                ProductName = x.Product.Name,
                CustomerName = x.Customer.Name,
                StoreName = x.Store.Name,


            }).ToList();
            return Json(salesModel, JsonRequestBehavior.AllowGet);
        }

        // GET: ProductSolds/Create
        public ActionResult Create()
        {
            ViewBag.CustomerID = new SelectList(db.Customers, "ID", "Name");
            ViewBag.ProductID = new SelectList(db.Products, "ID", "Name");
            ViewBag.StoreID = new SelectList(db.Stores, "ID", "Name");
            return View();
        }

        // POST: ProductSolds/Create
        public JsonResult CreateSales(SalesViewModel salesViewModel)
        {

            ProductSold sales = new ProductSold();
            sales.CustomerID = salesViewModel.CustomerID;
            sales.ProductID = salesViewModel.ProductID;
            sales.StoreID = salesViewModel.StoreID;
            sales.DateSold = salesViewModel.DateSold;
            db.ProductSolds.Add(sales);
            db.SaveChanges();
            return Json(salesViewModel, JsonRequestBehavior.AllowGet);
        }

        // GET: ProductSolds/Edit/5
        public JsonResult GetEditSaleRecord(int id)
        {
            var salesModel = db.ProductSolds.Where(x => x.ID == id).Select(y => new SalesViewModel
            {
                DateSold = y.DateSold,
                CustomerID = y.CustomerID,
                StoreID = y.StoreID,
                ProductID = y.ProductID
            }).FirstOrDefault();

            return Json(salesModel, JsonRequestBehavior.AllowGet);
        }

        // POST: ProductSolds/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.


        public ActionResult Edit([Bind(Include = "ID,ProductID,CustomerID,StoreID,DateSold")] ProductSold productSold)
        {
            if (ModelState.IsValid)
            {
                db.Entry(productSold).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CustomerID = new SelectList(db.Customers, "ID", "Name", productSold.CustomerID);
            ViewBag.ProductID = new SelectList(db.Products, "ID", "Name", productSold.ProductID);
            ViewBag.StoreID = new SelectList(db.Stores, "ID", "Name", productSold.StoreID);
            return View(productSold);
        }


        public JsonResult UpdateSaleRecord([Bind(Include = "ID,ProductID,CustomerID,StoreID,DateSold")] SalesViewModel saleViewModel)
        {
            var sales = db.ProductSolds.Find(saleViewModel.ID);
            sales.DateSold = saleViewModel.DateSold;
            sales.CustomerID = saleViewModel.CustomerID;
            sales.StoreID = saleViewModel.StoreID;
            sales.ProductID = saleViewModel.ProductID;
            db.SaveChanges();
            return Json(saleViewModel, JsonRequestBehavior.AllowGet);

        }

        // GET: ProductSolds/Delete/5

        public ActionResult DeleteSalesRecord(int id)
        {

            ProductSold productSold = db.ProductSolds.Find(id);
            if (productSold == null)
            {
                return Json("Not found", JsonRequestBehavior.AllowGet);

            }
            SalesViewModel salesViewModel = new SalesViewModel
            {
                ID = productSold.ID,
                ProductName = productSold.Product.Name,
                StoreName = productSold.Store.Name,
                CustomerName = productSold.Customer.Name,
                DateSold = productSold.DateSold
            };

            return Json(salesViewModel, JsonRequestBehavior.AllowGet);
        }

        // POST: Products/Delete/5
        public ActionResult DeleteConfirmed(int id)
        {
            ProductSold productSold = db.ProductSolds.Find(id);

            db.ProductSolds.Remove(productSold);
            db.SaveChanges();
            return Json(JsonRequestBehavior.AllowGet);
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
