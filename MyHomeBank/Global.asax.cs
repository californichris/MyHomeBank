using System;
using System.Web;
using System.Web.Optimization;
using EPE.Common;
using EPE.Common.Entities;
using EPE.Common.Utils;

namespace MyHomeBank
{
    public class Global : System.Web.HttpApplication
    {

        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            BundleConfig.RegisterScriptBundles(BundleTable.Bundles);
        }

        void Application_End(object sender, EventArgs e)
        {
            //  Code that runs on application shutdown

        }

        void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs

        }

        void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started
            HttpContext currentContext = HttpContext.Current;
            if (currentContext != null)
            {                
                SessionUser sessionUser = new SessionUser(currentContext);
                SessionContainer.AddUser(sessionUser);
                LoggerHelper.Debug("Session of user [" + sessionUser.UserLogin + "] starting.");
            }         
        }

        void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends. 
            // Note: The Session_End event is raised only when the sessionstate mode
            // is set to InProc in the Web.config file. If session mode is set to StateServer 
            // or SQLServer, the event is not raised.
            if (this.Session != null)
            {
                SessionUser sessionUser;
                SessionContainer.Users.TryRemove(this.Session.SessionID, out sessionUser);
                if (sessionUser != null)
                {
                    string userLogin = sessionUser.UserLogin;
                    LoggerHelper.Debug("Session of user [" + userLogin + "] ended.");
                }
                
            }
        }

    }
}
