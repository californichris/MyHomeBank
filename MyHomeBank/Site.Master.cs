using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using EPE.Common.Utils;
namespace MyHomeBank
{
    public partial class SiteMaster : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string loginName = GetUserLogin();
                LoggerHelper.Debug("loginName = " + loginName);

                if (!Page.ClientScript.IsClientScriptBlockRegistered("menuGlobals"))
                {
                    StringBuilder menuGlobals = new StringBuilder();
                    menuGlobals.Append("\n<script type='text/javascript'>\n");
                    menuGlobals.Append("var LOGIN_NAME = '").Append(loginName).Append("';\n");
                    menuGlobals.Append("</script>");

                    Page.ClientScript.RegisterClientScriptBlock(this.GetType(), "menuGlobals", menuGlobals.ToString());
                }
            }
        }

        private string GetUserLogin()
        {
            string loginName = "";
            if (Session["CurrentUserLogin"] == null)
            {
                try
                {
                    string[] name = { "" };
                    if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.User.Identity.Name))
                    {
                        name = System.Web.HttpContext.Current.User.Identity.Name.Split('\\');
                        loginName = System.Web.HttpContext.Current.User.Identity.Name;
                    }

                    LoggerHelper.Debug("loginName before split = " + loginName);

                    if (name.Length >= 1)
                    {
                        loginName = name[1];
                    }
                }
                catch (Exception e)
                {
                    LoggerHelper.Error(e);
                }

                if (!string.IsNullOrEmpty(loginName))
                {
                    Session["CurrentUserLogin"] = loginName;
                }
            }
            else
            {
                loginName = (string)Session["CurrentUserLogin"];
            }

            return loginName;
        }
    }
}
