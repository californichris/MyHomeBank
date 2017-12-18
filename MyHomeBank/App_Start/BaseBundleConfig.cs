using System.Web.Optimization;

namespace EPE.Common
{
    public static class BaseBundleConfig
    {
        public static readonly string ScriptsPath = "~/Scripts/";
        public static readonly string StylesPath = "~/Styles/";

        public static readonly string SiteMasterJsVirtualPath = ScriptsPath + "site_master_js";
        public static readonly string PageConfigJsVirtualPath = ScriptsPath + "page_config_js";
        public static readonly string QueryHelperJsVirtualPath = ScriptsPath + "query_helper_js";
        public static readonly string ExtraWidgetsJsVirtualPath = ScriptsPath + "extra_widgets_js";

        public static readonly string SiteMasterCSSVirtualPath = StylesPath + "site_master_css";
        public static readonly string PageConfigCSSVirtualPath = StylesPath + "page_config_css";
        public static readonly string JQueryCSSVirtualPath = StylesPath + "overcast/jquery_css";
        public static readonly string QueryHelperCSSVirtualPath = StylesPath + "query_helper_css";
        public static readonly string ExtraWidgetsCssVirtualPath = StylesPath + "extra_widgets_css";

        public static void RegisterScriptBundles(BundleCollection bundles)
        {
            var siteMasterBundle = new ScriptBundle(SiteMasterJsVirtualPath)
                .Include(ScriptsPath + "jquery.js")
                .Include(ScriptsPath + "jquery-ui.js")
                .Include(ScriptsPath + "jquery.dataTables.js")
                .Include(ScriptsPath + "jquery.json-2.4.js")
                .Include(ScriptsPath + "common.js")
                .Include(ScriptsPath + "date.js")
                .Include(ScriptsPath + "jquery.fileDownload.js")
                .Include(ScriptsPath + "spin.js");
            bundles.Add(siteMasterBundle);

            var pageConfigBundle = new ScriptBundle(PageConfigJsVirtualPath)
                .Include(ScriptsPath + "jquery.carousel.js")
                .Include(ScriptsPath + "pageconfig.js");
            bundles.Add(pageConfigBundle);

            var queryHelperBundle = new ScriptBundle(QueryHelperJsVirtualPath)
                 .Include(ScriptsPath + "jquery.carousel.js")
                 .Include(ScriptsPath + "prism.js");
            bundles.Add(queryHelperBundle);

            var multiSelectJSBundle = new ScriptBundle(ExtraWidgetsJsVirtualPath)
                .Include(ScriptsPath + "jquery.multiselect.js")                
                .Include(ScriptsPath + "jquery.multiselect.filter.js")
                .Include(ScriptsPath + "jquery-ui-timepicker-addon.js")
                .Include(ScriptsPath + "jquery.hotkeys.js")
                .Include(ScriptsPath + "jquery.maskMoney.js");
            bundles.Add(multiSelectJSBundle);

            var cssBundle = new StyleBundle(SiteMasterCSSVirtualPath)
                .Include(StylesPath + "Site.css");
            bundles.Add(cssBundle);

            var styleBundle = new StyleBundle(JQueryCSSVirtualPath)
                .Include(StylesPath + "overcast/jquery-ui.css")
                .Include(StylesPath + "overcast/jquery-horizontal-menu.css")
                .Include(StylesPath + "overcast/dataTables.jqueryui.css");
            bundles.Add(styleBundle);

            var extraWidgetsCSSBundle = new StyleBundle(ExtraWidgetsCssVirtualPath)
                .Include(StylesPath + "jquery.multiselect.css")
                .Include(StylesPath + "jquery.multiselect.filter.css");
            bundles.Add(extraWidgetsCSSBundle);

            var queryHelperCSSBundle = new StyleBundle(QueryHelperCSSVirtualPath)
                .Include(StylesPath + "prism.css");
            bundles.Add(queryHelperCSSBundle);

            var queryPageConfigCSSBundle = new StyleBundle(PageConfigCSSVirtualPath)
                .Include(StylesPath + "pageconfig.css");
            bundles.Add(queryPageConfigCSSBundle);
        }
    }
}