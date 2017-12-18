using System.Web;
using System;
using System.IO;
using EPE.Common.handler;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using System.Collections;


namespace EPE.Common.handler
{
    /// <summary>
    /// Summary description for AjaxDownloadHandler
    /// </summary>
    public class AjaxDownloadHandler : AjaxController
    {

        public override void HandleExport(HttpContext context, string response)
        {
            HttpResponse resp = context.Response;
            string exportType = context.Request.Params["exportType"];
            resp.AddHeader("Content-Disposition", "attachment; filename=" + GetFileName(context) + ";");

            if (string.IsNullOrEmpty(exportType))
            {
                resp.ContentType = "application/csv";
                resp.Write(response);
            }
            else
            {
                resp.Clear();
                resp.Buffer = true;
                resp.Charset = "";

                if (exportType.Equals("excel", StringComparison.CurrentCultureIgnoreCase))
                {
                    resp.ContentType = "application/vnd.ms-excel";

                    //style to format numbers to string
                    string style = @"<style> .textmode { mso-number-format:\@; } </style>";

                    resp.Write(style);
                    resp.Output.Write(response);
                }
                else if (exportType.Equals("word", StringComparison.CurrentCultureIgnoreCase))
                {
                    resp.ContentType = "application/vnd.ms-word ";
                    resp.Output.Write(response);
                }
                else if (exportType.Equals("pdf", StringComparison.CurrentCultureIgnoreCase))
                {
                    StringReader sr = new StringReader(response);
                    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 10f);
                    HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
                    PdfWriter.GetInstance(pdfDoc, resp.OutputStream);

                    pdfDoc.Open();
                    htmlparser.Parse(sr);
                    pdfDoc.Close();

                    resp.Cache.SetCacheability(HttpCacheability.NoCache);
                    resp.ContentType = "application/pdf";
                    resp.Output.Write(pdfDoc);                    
                }
            }

            resp.Flush();
            resp.End();
        }

    }
 
}