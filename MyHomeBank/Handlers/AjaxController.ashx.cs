using System;
using System.Configuration;
using System.Data;
using System.IO;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using EPE.Common.Ajax;
using EPE.Common.Utils;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;

namespace EPE.Common.handler
{
    /// <summary>
    /// Custom HttpHandler responsible for handling all ajax request.
    /// </summary>
    public class AjaxController : IHttpHandler
    {
        public static readonly string DefaultAjaxBasePkg = "EPE.Ajax";
        public static readonly string AjaxBasePkgParamName = "AjaxBasePkg";

        /// <summary>
        /// Process the ajax request
        /// </summary>
        /// <param name="context">the request HTTPContext</param>
        public void ProcessRequest(HttpContext context)
        {
            LoggerHelper.Info("Start");
            string response = HandleAjaxRequest(context.Request);
            
            string csv = context.Request.Params["csv"];
            if (!string.IsNullOrEmpty(csv) && bool.Parse(csv))
            {
                HandleExport(context, response);
            }                        
            else
            {
                context.Response.ContentType = "application/json";
                context.Response.Write(response);
            }
            
            LoggerHelper.Info("End");
        }

        public virtual void HandleExport(HttpContext context, string response)
        {
            string exportType = context.Request.Params["exportType"];
            context.Response.AddHeader("Content-Disposition", "attachment; filename=" + GetFileName(context) + ";");

            if (string.IsNullOrEmpty(exportType))
            {
                context.Response.ContentType = "application/csv";
                context.Response.Write(response);
            }
            else
            {
                GridView gv = CSVtoGridView(response);
                if (exportType.Equals("excel", StringComparison.CurrentCultureIgnoreCase))
                {
                    context.Response.Clear();
                    context.Response.Buffer = true;
                    context.Response.Charset = "";
                    context.Response.ContentType = "application/vnd.ms-excel";
                    
                    StringWriter sw = new StringWriter();
                    HtmlTextWriter hw = new HtmlTextWriter(sw);

                    for (int i = 0; i < gv.Rows.Count; i++)
                    {
                        //Apply text style to each Row
                        gv.Rows[i].Attributes.Add("class", "textmode");
                    }
                    gv.RenderControl(hw);

                    //style to format numbers to string
                    string style = @"<style> .textmode { mso-number-format:\@; } </style>";

                    context.Response.Write(style);
                    context.Response.Output.Write(sw.ToString());
                    context.Response.Flush();
                }
                else if (exportType.Equals("word", StringComparison.CurrentCultureIgnoreCase))
                {
                    context.Response.Clear();
                    context.Response.Buffer = true;
                    context.Response.Charset = "";
                    context.Response.ContentType = "application/vnd.ms-word ";

                    StringWriter sw = new StringWriter();
                    HtmlTextWriter hw = new HtmlTextWriter(sw);
                    gv.RenderControl(hw);

                    context.Response.Output.Write(sw.ToString());
                    context.Response.Flush();
                }
                else if (exportType.Equals("pdf", StringComparison.CurrentCultureIgnoreCase))
                {
                    context.Response.ContentType = "application/pdf";
                    context.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                    StringWriter sw = new StringWriter();
                    HtmlTextWriter hw = new HtmlTextWriter(sw);
                    gv.RenderControl(hw);

                    StringReader sr = new StringReader(sw.ToString());
                    Document pdfDoc = new Document(PageSize.A4.Rotate(), 10f, 10f, 10f, 0f);
                    HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
                    PdfWriter.GetInstance(pdfDoc, context.Response.OutputStream);

                    pdfDoc.Open();
                    htmlparser.Parse(sr);
                    pdfDoc.Close();

                    context.Response.Write(pdfDoc);
                }
            }

            context.Response.End();
        }

        public virtual GridView CSVtoGridView(string response)
        {
            string[] Lines = response.Split(new string[] { Environment.NewLine }, StringSplitOptions.None);
            string[] Fields;
            Fields = Lines[0].Split(new string[] { "\",\"" }, StringSplitOptions.None);
            int Cols = Fields.GetLength(0);
            DataTable dt = new DataTable();
                        
            for (int i = 0; i < Cols; i++)
            {
                dt.Columns.Add(Fields[i].Replace("\"", ""), typeof(string));
            }

            DataRow Row;
            for (int i = 1; i < Lines.GetLength(0); i++)
            {
                Fields = Lines[i].Split(new string[] { "\",\"" }, StringSplitOptions.None);
                if (Fields.GetLength(0) == Cols)
                {
                    Row = dt.NewRow();
                    for (int f = 0; f < Cols; f++)
                    {
                        Row[f] = Fields[f].Replace("\"", "");
                    }
                    dt.Rows.Add(Row);
                }
            }

            GridView gv = new GridView();
            gv.AllowPaging = false;
            gv.DataSource = dt;
            gv.DataBind();

            return gv;
        }

        /// <summary>
        /// Return the csv file name.
        /// </summary>
        /// <param name="context">the request HttpContext</param>
        /// <returns>the csv file name</returns>
        public virtual string GetFileName(HttpContext context)
        {
            string csv = context.Request.Params["csv"];
            string exportType = context.Request.Params["exportType"];
            string fileName = "data_" + DateTime.Now.ToString("hhmmssfff") + ".";
            
            if (string.IsNullOrEmpty(exportType))
            {
                fileName += "csv";
            }
            else
            {
                if (exportType.Equals("excel", StringComparison.CurrentCultureIgnoreCase))
                {
                    fileName += "xls";
                }
                else if (exportType.Equals("word", StringComparison.CurrentCultureIgnoreCase))
                {
                    fileName += "doc";
                }
                else if (exportType.Equals("pdf", StringComparison.CurrentCultureIgnoreCase))
                {
                    fileName += "pdf";
                }
            }

            return fileName;
        }

        /// <summary>
        /// Handles all ajax requests by parsing the additional path information of the request.
        /// <para> The path info must be in the format : /ClassToBeInstatiated/MethodToBeInvoke for</para>
        /// <para> more detail please see <see cref="EPE.Common.handler.ClassInfo" />. </para>
        /// <para>The ClassToBeInstatiated must extend EPE.Common.Ajax.AjaxBase </para>
        /// <para> and the MethodToBeInvoke must have the following signature: public string methodName(HttpRequest request)</para>
        /// </summary>
        /// <param name="request">the HttpRequest</param>
        /// <returns>Returns a JSON response.</returns>
        public virtual string HandleAjaxRequest(HttpRequest request)
        {
            string ajaxResponse = "";
            string pathInfo = "";
            try
            {
                pathInfo = request.PathInfo;
                LoggerHelper.Debug("Parsing path info = [" + pathInfo + "]");
                ClassInfo clazzInfo = new ClassInfo(pathInfo);

                if (!clazzInfo.isValid())
                {
                    LoggerHelper.Error("Invalid pathInfo, Could not process ajax request");
                    return "{\"ErrorMsg\" : \"Invalid pathInfo, Could not process ajax request(" + pathInfo + ").\"}";
                }

                LoggerHelper.Debug("Get class type = [" + clazzInfo.GetClazz() + "]");
                Type type = Type.GetType(clazzInfo.GetClazz());
                AjaxBase instance = (AjaxBase)Activator.CreateInstance(type);

                LoggerHelper.Debug("Get method = [" + clazzInfo.GetMethod() + "]");
                MethodInfo methodInfo = type.GetMethod(clazzInfo.GetMethod());

                LoggerHelper.Debug("Invoking method = [" + clazzInfo.GetMethod() + "]");
                ajaxResponse = (string)methodInfo.Invoke(instance, new Object[] { request });

            }
            catch (Exception e)
            {
                LoggerHelper.Error(e);
                ajaxResponse = "{\"ErrorMsg\" : \"Could not process ajax request(" + pathInfo + ").\"}";
            }
            finally
            {
                LoggerHelper.Debug("Ajax Response = [" + ajaxResponse + "]");
            }

            return ajaxResponse;
        }

        /// <summary>
        /// Overriding the method to allow asynchronous calls.
        /// </summary>
        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }

    /// <summary>
    /// Contains methods to parse the HttpRequest.PathInfo and stored the necessary information 
    /// to instantiate the requested class and invoke the requested method.
    /// </summary>
    public class ClassInfo
    {
        private string clazz = "";
        private string method = "";

        public ClassInfo()
        {
        }

        public ClassInfo(string pathInfo)
            : this(pathInfo.TrimStart('/').Split('/'))
        {

        }

        public ClassInfo(string[] pathElems)
        {
            if (pathElems.Length == 2)
            {
                this.clazz = GetClazz(pathElems[0]);
                this.method = pathElems[1];
            }
        }

        public string GetClazz()
        {
            return this.clazz;
        }

        public void SetClazz(string clazz)
        {
            this.clazz = clazz;
        }

        public string GetMethod()
        {
            return this.method;
        }

        public void SetMethod(string method)
        {
            this.method = method;
        }

        /// <summary>
        /// Determines if the necessary info is present
        /// </summary>
        /// <returns>true if the necessary info is present false otherwise</returns>
        public virtual bool isValid()
        {
            return !(string.IsNullOrEmpty(clazz) && string.IsNullOrEmpty(method));
        }

        /// <summary>
        /// Search for the given class in the System.Configuration.AppSettingsSection and returns the value
        /// if found otherwise contructs the fully qualified name using the configured ajax package.
        /// </summary>
        /// <param name="clazz">the class to be instantiated</param>
        /// <returns>the class fully qualified name</returns>
        private string GetClazz(string clazz)
        {
            string fullyQualifiedName = ConfigurationManager.AppSettings[clazz];
            if (String.IsNullOrEmpty(fullyQualifiedName))
            {
                fullyQualifiedName = GetBasePackage() + "." + clazz;
            }

            return fullyQualifiedName;
        }

        /// <summary>
        /// Search for the AjaxBasePkg key in the System.Configuration.AppSettingsSection and returns the value
        /// if found otherwise return the AjaxController.DefaultAjaxBasePkg.
        /// </summary>
        /// <returns>the ajax base package</returns>
        private string GetBasePackage()
        {
            string ajaxBasePkg = ConfigurationManager.AppSettings[AjaxController.AjaxBasePkgParamName];
            if (String.IsNullOrEmpty(ajaxBasePkg))
            {
                ajaxBasePkg = AjaxController.DefaultAjaxBasePkg;
            }

            return ajaxBasePkg;
        }
    }
}