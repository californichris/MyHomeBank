using System.Web.Optimization;

namespace EPE.Common
{
    public static class BundleConfig
    {
        public static void RegisterScriptBundles(BundleCollection bundles)
        {
            BaseBundleConfig.RegisterScriptBundles(bundles);

            //var siteMasterBundle = bundles.GetBundleFor(BaseBundleConfig.SiteMasterJsVirtualPath);
            //siteMasterBundle.Include(SCRIPTS_PATH + "another.js");

            var jqplotJSBundle = new ScriptBundle(BaseBundleConfig.ScriptsPath + "jqplot_js")
                .Include(BaseBundleConfig.ScriptsPath + "dashboard_common.js")
                .Include(BaseBundleConfig.ScriptsPath + "jqplot/jquery.jqplot.js")
                .Include(BaseBundleConfig.ScriptsPath + "jqplot/jqplot.pieRenderer.js")
                .Include(BaseBundleConfig.ScriptsPath + "jqplot/jqplot.barRenderer.js")
                .Include(BaseBundleConfig.ScriptsPath + "jqplot/jqplot.categoryAxisRenderer.js")
                .Include(BaseBundleConfig.ScriptsPath + "jqplot/jqplot.pointLabels.js")
                .Include(BaseBundleConfig.ScriptsPath + "jqplot/jqplot.canvasOverlay.js");
            bundles.Add(jqplotJSBundle);

            var jqplotBundle = new StyleBundle(BaseBundleConfig.StylesPath + "jqplot_css")
                .Include(BaseBundleConfig.StylesPath + "jquery.jqplot.css");
            bundles.Add(jqplotBundle);
        }
    }
}