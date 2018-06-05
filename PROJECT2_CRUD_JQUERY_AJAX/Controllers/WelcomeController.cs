using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PROJECT2_CRUD_JQUERY_AJAX.Controllers
{
    public class WelcomeController : Controller
    {
        // GET: Welcom
        public ActionResult Index()
        {
            return View();
        }
    }
}