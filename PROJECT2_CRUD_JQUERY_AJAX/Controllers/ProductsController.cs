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
    public class ProductsController : Controller
    {
        private MVCEntities db = new MVCEntities();

        // GET: Products
        public ActionResult Index()
        {

            return View("");
        }

        // Get product list to display on the landing page
        public JsonResult GetProductList()
        {

            List<ProductViewModel> productModel = db.Products.Select(x => new ProductViewModel
            {
                ID = x.ID,
                Name = x.Name,
                Price = x.Price
            }).ToList();
            return Json(productModel, JsonRequestBehavior.AllowGet);
        }

        // Save data in the product database
        public JsonResult CreateProduct(ProductViewModel productViewModel)
        {

            Product product = new Product();
            product.Name = productViewModel.Name;
            product.Price = productViewModel.Price;
            db.Products.Add(product);
            db.SaveChanges();
            return Json(productViewModel, JsonRequestBehavior.AllowGet);
        }

        // Get product for editing
        public JsonResult GetProductRecord(int id)
        {
            var productModel = db.Products.Where(x => x.ID == id).Select(y => new ProductViewModel
            {
                ID = y.ID,
                Name = y.Name,
                Price = y.Price
            }).FirstOrDefault();

            return Json(productModel, JsonRequestBehavior.AllowGet);
        }

        // Save the edited product in the database
        public JsonResult EditProductRecord([Bind(Include = "ID,Name,Price")] ProductViewModel productViewModel)
        {
            var prod = db.Products.Find(productViewModel.ID);
            prod.Name = productViewModel.Name;
            prod.Price = productViewModel.Price;
            db.SaveChanges();
            return Json(productViewModel, JsonRequestBehavior.AllowGet);
        }

        // GET: Products/Delete/5
        public JsonResult Delete(ProductViewModel productViewModel)
        {
            
            var product = db.Products.Find(productViewModel.ID);
            if (product == null)
            {
                return Json("Not found", JsonRequestBehavior.AllowGet);
            }
            ProductViewModel productViewModel1 = new ProductViewModel
            {
                ID = product.ID,
                Name = product.Name,
                Price = product.Price,

            };
            var isExist = product.ProductSolds.Any();
            return Json(new { productViewModel= productViewModel1, isExist = isExist }, JsonRequestBehavior.AllowGet);
        }

        // POST: Products/Delete/5
        public JsonResult DeleteConfirmed(ProductViewModel productViewModel)
        {
            Product product = db.Products.Find(productViewModel.ID);
            db.Products.Remove(product);
            db.SaveChanges();
            return Json(productViewModel, JsonRequestBehavior.AllowGet);
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
