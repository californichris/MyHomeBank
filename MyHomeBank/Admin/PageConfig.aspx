<%@ Page Title="Page Config" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="PageConfig.aspx.cs" Inherits="EPE.Common.PageConfig" %>
<%@ Import Namespace="System.Web.Optimization" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <%: Styles.Render("~/Styles/page_config_css") %>
    <%: Scripts.Render("~/Scripts/page_config_js") %>  
    <script type="text/javascript">
        const DEFAULT_PAGE_CONFIG = $.evalJSON('{"PageAppId":"24","PageId":"908","Name":"Page","Title":"Page Config","TableName":"Page","UpdatedBy":null,"UpdatedDate":null,"ConnName":"","GridFields":[{"ColumnId":"43945","FieldId":"14182","PageId":"908","ColumnName":"Name","ColumnLabel":"Name","ColumnOrder":"2","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"43946","FieldId":"14183","PageId":"908","ColumnName":"Title","ColumnLabel":"Title","ColumnOrder":"3","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"43947","FieldId":"14184","PageId":"908","ColumnName":"ConnName","ColumnLabel":"ConnName","ColumnOrder":"5","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"43948","FieldId":"14185","PageId":"908","ColumnName":"TableName","ColumnLabel":"TableName","ColumnOrder":"4","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"43949","FieldId":"14191","PageId":"908","ColumnName":"AppName","ColumnLabel":"Application","ColumnOrder":"1","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null}],"Tabs":[{"TabId":"1213","PageId":"908","TabName":"Details","URL":null,"TabOrder":"1","Cols":"1","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FieldId":"14182","TabId":"1213","FieldName":"Name","Label":"Name","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"1","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Name","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14183","TabId":"1213","FieldName":"Title","Label":"Title","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"2","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Title","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14184","TabId":"1213","FieldName":"ConnName","Label":"ConnName","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"3","ControlType":"selectmenu","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"ConnName","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14185","TabId":"1213","FieldName":"TableName","Label":"TableName","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"4","ControlType":"dropdownlist","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"TableName","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14186","TabId":"1213","FieldName":"PageAppId","Label":"Application","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"5","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"PageAppId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14187","TabId":"1213","FieldName":"PageId","Label":"PageId","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"6","ControlType":"hidden","IsId":"True","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"PageId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14188","TabId":"1213","FieldName":"UpdatedBy","Label":"UpdatedBy","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"7","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"UpdatedBy","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14189","TabId":"1213","FieldName":"UpdatedDate","Label":"UpdatedDate","Type":"datetime","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"8","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"UpdatedDate","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14191","TabId":"1213","FieldName":"AppName","Label":"Application","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"False","FieldOrder":"9","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"AppName","Insertable":"False","Updatable":"False","ColumnInfo":null,"ControlProps":""}]}],"Filter":{"FilterId":"5218","PageId":null,"FilterText":"Filter","FilterCols":"1","ShowClear":"True","FilterProps":"","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FilterFieldId":"16923","FilterId":"5218","FieldId":"14191","FilterOrder":"1","UpdatedBy":null,"UpdatedDate":null}]}}');
        const DEFAULT_TAB_CONFIG = $.evalJSON('{"PageAppId":"24","PageId":"911","Name":"PageTab","Title":"Page Tab","TableName":"PageTab","UpdatedBy":null,"UpdatedDate":null,"ConnName":"","GridFields":[{"ColumnId":"44784","FieldId":"14204","PageId":"911","ColumnName":"TabName","ColumnLabel":"Name","ColumnOrder":"1","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"44785","FieldId":"14205","PageId":"911","ColumnName":"Cols","ColumnLabel":"Cols","ColumnOrder":"2","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null}],"Tabs":[{"TabId":"1216","PageId":"911","TabName":"Tab","URL":null,"TabOrder":"1","Cols":"1","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FieldId":"14204","TabId":"1216","FieldName":"TabName","Label":"Name","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"1","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"TabName","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14205","TabId":"1216","FieldName":"Cols","Label":"Cols","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"2","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Cols","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14206","TabId":"1216","FieldName":"TabId","Label":"TabId","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"3","ControlType":"hidden","IsId":"True","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"TabId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14207","TabId":"1216","FieldName":"PageId","Label":"PageId","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"4","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"PageId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14208","TabId":"1216","FieldName":"TabOrder","Label":"TabOrder","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"5","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"TabOrder","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14209","TabId":"1216","FieldName":"UpdatedBy","Label":"UpdatedBy","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"6","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"UpdatedBy","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14210","TabId":"1216","FieldName":"UpdatedDate","Label":"UpdatedDate","Type":"datetime","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"7","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"UpdatedDate","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""}]}],"Filter":null}');
        const DEFAULT_FIELD_CONFIG = $.evalJSON('{"PageAppId":"24","PageId":"912","Name":"PageField","Title":"Page Field","TableName":"PageField","UpdatedBy":null,"UpdatedDate":null,"ConnName":"","GridFields":[{"ColumnId":"44856","FieldId":"14211","PageId":"912","ColumnName":"FieldName","ColumnLabel":"Name","ColumnOrder":"1","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"44857","FieldId":"14214","PageId":"912","ColumnName":"Type","ColumnLabel":"Type","ColumnOrder":"2","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"44858","FieldId":"14215","PageId":"912","ColumnName":"ControlType","ColumnLabel":"ControlType","ColumnOrder":"3","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null}],"Tabs":[{"TabId":"1217","PageId":"912","TabName":"Details","URL":null,"TabOrder":"1","Cols":"2","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FieldId":"14211","TabId":"1217","FieldName":"FieldName","Label":"Name","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"1","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"FieldName","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14219","TabId":"1217","FieldName":"IsId","Label":"IsId","Type":"bit","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"2","ControlType":"checkbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"IsId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14212","TabId":"1217","FieldName":"DBFieldName","Label":"DB Name","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"3","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"DBFieldName","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14220","TabId":"1217","FieldName":"Required","Label":"Required","Type":"bit","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"4","ControlType":"checkbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Required","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14213","TabId":"1217","FieldName":"Label","Label":"Label","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"5","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Label","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14221","TabId":"1217","FieldName":"Exportable","Label":"Exportable","Type":"bit","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"6","ControlType":"checkbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Exportable","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14214","TabId":"1217","FieldName":"Type","Label":"Type","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"7","ControlType":"selectmenu","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Type","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14222","TabId":"1217","FieldName":"Insertable","Label":"Insertable","Type":"bit","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"8","ControlType":"checkbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Insertable","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14215","TabId":"1217","FieldName":"ControlType","Label":"ControlType","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"9","ControlType":"selectmenu","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"ControlType","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14223","TabId":"1217","FieldName":"Updatable","Label":"Updatable","Type":"bit","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"10","ControlType":"checkbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Updatable","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14216","TabId":"1217","FieldName":"FieldId","Label":"FieldId","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"11","ControlType":"hidden","IsId":"True","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"FieldId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14224","TabId":"1217","FieldName":"TabId","Label":"TabId","Type":"int","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"12","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"TabId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14217","TabId":"1217","FieldName":"FieldOrder","Label":"FieldOrder","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"13","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"FieldOrder","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14225","TabId":"1217","FieldName":"UpdatedBy","Label":"UpdatedBy","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"14","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"UpdatedBy","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14218","TabId":"1217","FieldName":"UpdatedDate","Label":"UpdatedDate","Type":"datetime","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"15","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"UpdatedDate","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""}]},{"TabId":"1218","PageId":"912","TabName":"Drop Down Info","URL":null,"TabOrder":"2","Cols":"1","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FieldId":"14226","TabId":"1218","FieldName":"DropDownInfo","Label":"DropDownInfo","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"1","ControlType":"multiline","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"DropDownInfo","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":"{\\"rows\\":\\"6\\"}"}]},{"TabId":"1219","PageId":"912","TabName":"Join Info","URL":null,"TabOrder":"3","Cols":"1","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FieldId":"14227","TabId":"1219","FieldName":"JoinInfo","Label":"JoinInfo","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"1","ControlType":"multiline","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"JoinInfo","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":"{\\"rows\\":\\"6\\"}"}]},{"TabId":"1220","PageId":"912","TabName":"Properties","URL":null,"TabOrder":"4","Cols":"1","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FieldId":"14228","TabId":"1220","FieldName":"ControlProps","Label":"ControlProps","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"1","ControlType":"multiline","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"ControlProps","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":"{\\"rows\\":\\"6\\"}"}]}],"Filter":null}');
        const DEFAULT_FIELD_DB_CONFIG = $.evalJSON('{"PageAppId":"24","PageId":"915","Name":"PageDBFields","Title":"Fields From DataBase","TableName":"PageField","UpdatedBy":null,"UpdatedDate":null,"ConnName":"","GridFields":[{"ColumnId":"44912","FieldId":"14241","PageId":"915","ColumnName":"Name","ColumnLabel":"Name","ColumnOrder":"1","Visible":"True","Searchable":"True","Width":"200","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"44913","FieldId":"14242","PageId":"915","ColumnName":"Required","ColumnLabel":"Nullable","ColumnOrder":"3","Visible":"True","Searchable":"True","Width":"80","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"44914","FieldId":"14243","PageId":"915","ColumnName":"Type","ColumnLabel":"Type","ColumnOrder":"2","Visible":"True","Searchable":"True","Width":"80","UpdatedBy":null,"UpdatedDate":null},{"ColumnId":"44915","FieldId":"14244","PageId":"915","ColumnName":"Order","ColumnLabel":"Add","ColumnOrder":"4","Visible":"True","Searchable":"True","Width":"30","UpdatedBy":null,"UpdatedDate":null}],"Tabs":[{"TabId":"1223","PageId":"915","TabName":"Details","URL":null,"TabOrder":"1","Cols":"1","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FieldId":"14241","TabId":"1223","FieldName":"Name","Label":"Name","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"False","FieldOrder":"1","ControlType":"inputbox","IsId":"True","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Name","Insertable":"False","Updatable":"False","ColumnInfo":null,"ControlProps":""},{"FieldId":"14242","TabId":"1223","FieldName":"Required","Label":"Required","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"False","FieldOrder":"2","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Required","Insertable":"False","Updatable":"False","ColumnInfo":null,"ControlProps":""},{"FieldId":"14243","TabId":"1223","FieldName":"Type","Label":"Type","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"False","FieldOrder":"3","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Type","Insertable":"False","Updatable":"False","ColumnInfo":null,"ControlProps":""},{"FieldId":"14244","TabId":"1223","FieldName":"Add","Label":"Add","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"False","FieldOrder":"4","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Add","Insertable":"False","Updatable":"False","ColumnInfo":null,"ControlProps":""}]}],"Filter":null}');
        const DEFAULT_COLUMN_CONFIG = $.evalJSON('{"PageAppId":"24","PageId":"918","Name":"PageGridColumn","Title":"Page Grid Column","TableName":"PageGridColumn","UpdatedBy":null,"UpdatedDate":null,"ConnName":"","GridFields":[{"ColumnId":"45337","FieldId":"14274","PageId":"918","ColumnName":"ColumnName","ColumnLabel":"ColumnName","ColumnOrder":"1","Visible":"True","Searchable":"True","Width":"0","UpdatedBy":null,"UpdatedDate":null}],"Tabs":[{"TabId":"1227","PageId":"918","TabName":"Grid Column Details","URL":null,"TabOrder":"1","Cols":"1","UpdatedBy":null,"UpdatedDate":null,"Fields":[{"FieldId":"14274","TabId":"1227","FieldName":"ColumnName","Label":"Name","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"1","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"ColumnName","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14275","TabId":"1227","FieldName":"ColumnLabel","Label":"Label","Type":"varchar","Required":"False","DropDownInfo":"","Exportable":"True","FieldOrder":"2","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"ColumnLabel","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14283","TabId":"1227","FieldName":"Width","Label":"Width","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"3","ControlType":"inputbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Width","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14282","TabId":"1227","FieldName":"Visible","Label":"Visible","Type":"bit","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"4","ControlType":"checkbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Visible","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14279","TabId":"1227","FieldName":"Searchable","Label":"Searchable","Type":"bit","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"5","ControlType":"checkbox","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"Searchable","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14273","TabId":"1227","FieldName":"ColumnId","Label":"ColumnId","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"6","ControlType":"hidden","IsId":"True","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"ColumnId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14276","TabId":"1227","FieldName":"ColumnOrder","Label":"ColumnOrder","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"7","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"ColumnOrder","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14277","TabId":"1227","FieldName":"FieldId","Label":"FieldId","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"8","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"FieldId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14278","TabId":"1227","FieldName":"PageId","Label":"PageId","Type":"int","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"9","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"PageId","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14280","TabId":"1227","FieldName":"UpdatedBy","Label":"UpdatedBy","Type":"varchar","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"10","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"UpdatedBy","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""},{"FieldId":"14281","TabId":"1227","FieldName":"UpdatedDate","Label":"UpdatedDate","Type":"datetime","Required":"True","DropDownInfo":"","Exportable":"True","FieldOrder":"11","ControlType":"hidden","IsId":"False","UpdatedBy":null,"UpdatedDate":null,"JoinInfo":"","DBFieldName":"UpdatedDate","Insertable":"True","Updatable":"True","ColumnInfo":null,"ControlProps":""}]}],"Filter":null}');

        $(document).ready(function () {
            carousel = $('#my-carousel').carousel({ pagination: false, nextPrevLinks: false, speed: 'fast' });
            initPageConfigPage();
        });

        function initPageConfigPage() {
            initPageConfigCatalog(DEFAULT_PAGE_CONFIG);
            initPageTabCatalog(DEFAULT_TAB_CONFIG);
            $('#Type', $(FIELD_DIALOG_SEL)).selectmenu();
            $('#ControlType', $(FIELD_DIALOG_SEL)).selectmenu();
            initPageFieldCatalog(DEFAULT_FIELD_CONFIG);
            initPageFieldDBCatalog(DEFAULT_FIELD_DB_CONFIG);
            initPageColumnCatalog(DEFAULT_COLUMN_CONFIG);
            initFilterDialog();
            initControls();
            attachEventHandlers();
        }

        function initPageConfigCatalog(config) {
            $(TABLE_SEL).Catalog({
                pageConfig: config,
                dialogSelector: '',
                showExport: true,
                columns: getPageTableColumns(),
                source: AJAX_CONTROLER_URL + '/PageInfo/GetPageList',
                deleteRequest: AJAX_CONTROLER_URL + '/PageInfo/DeletePage',
                newEntityCallBack: newPageConfig,
                editEntityCallBack: editPageConfig,
                validate: function (tips) {
                    return validateDialog(config, tips);
                },
                initCompleteCallBack: appendPreviewBtnToMainTable
            });
        }

        function getPageTableColumns() {
            return [
                        { "mDataProp": "Name", "sName": "Name", "bVisible": true, "bSearchable": true },
                        { "mDataProp": "Title", "sName": "Title", "bVisible": true, "bSearchable": true },
                        { "mDataProp": "TableName", "sName": "TableName", "bVisible": true, "bSearchable": true },
                        { "mDataProp": "ConnName", "sName": "ConnName", "bVisible": true, "bSearchable": true }
            ];
        }

        function initControls() {
            $.page.initSelectMenu('#ConnName');
            $.when($.getData(AJAX_CONTROLER_URL + '/PageInfo/GetConnections')).done(function (json) {
                var ddInfo = {};
                ddInfo.fieldName = 'ConnName'
                ddInfo.valField = 'ConnName';
                ddInfo.textField = 'ConnName';
                ddInfo.onChange = connNameChange;

                $.page.createSelectMenuOptions($('#ConnName'), json, ddInfo);
            });

            $.when($.getData(AJAX_CONTROLER_URL + '/PageInfo/GetTables?ConnName=')).done(function (json) {
                $('#TableName').ComboBox({
                    list: json.aaData,
                    sortByField: 'Name', valField: 'Name', textField: 'Name', removedInvalid: false,
                    onCreateComplete: function () {
                        $('#TableName_combobox_wrapper').css('width', '96.5%');
                    }
                });
            });

            $('#configtabs').tabs();

            $.page.initSelectMenu('#ConnName');
            $('#TableName').ComboBox({ list: [], sortByField: 'Name', valField: 'Name', textField: 'Name', removedInvalid: false });
            appendButtonsToNavBar();
            initDialogTabsBtns();
            $('#tabs').tabs();
        }

        function previewPage() {
            if ($('#PageId').val() == '') {
                updateTips($('#validateTips'), 'You need to save the page first.', true);
                return;
            }

            window.open('preview.aspx?pageName=' + $('#Name').val(), '_blank');
        }

        function newPageConfig() {
            $('#validateTips').text('').removeClass('ui-state-highlight').removeClass('ui-state-error');
            clearDialog(DIALOG_SEL);
            PAGE_CONFIG = getEmptyPageConfig();
            $('#Connection').val('Default');
            connNameChange();
            attachedDialogTabsEventHandlers();
            carousel.data('carousel').moveToItem(1);
            $('#configtabs').tabs('option', 'active', 0);
        }

        function editPageConfig() {
            $('#validateTips').text('').removeClass('ui-state-highlight').removeClass('ui-state-error');
            clearDialog(DIALOG_SEL);
            carousel.data('carousel').moveToItem(1);

            var entity = getSelectedRowData($(TABLE_SEL).DataTable());
            $('#configtabs').tabs('option', 'active', 0);
            populateDialog(entity, DIALOG_SEL);
            connNameChange();

            var msg = showMessage('Please wait...', { title: 'Loading' });
            $.getJSON(
                AJAX_CONTROLER_URL + '/PageInfo/GetPageConfig?pageName=' + entity['Name']
            ).done(function (json) {
                if (json.ErrorMsg) {
                    alert(json.ErrorMsg);
                    return;
                }

                createPage(json);
            }).always(function () {
                hideMessage(msg)
            });
        }

        function appendPreviewBtnToMainTable(oTable, oSettings, json, options) {
            var btn = $('<button onclick="return false;" class="disable" title="Preview Page">Preview</button>');
            btn.button({ icons: { primary: "ui-icon-play" } }).click(function (event) {
                var data = getSelectedRowData(oTable);
                window.open('preview.aspx?pageName=' + data.Name, '_blank');
            }).button('disable');

            $(TABLE_SEL).Catalog('getButtonSection').append(btn);
        }

        function connNameChange() {
            var currVal = $('#TableName').ComboBox('value');
            $('#TableName').ComboBox('value', 'Loading...');
            $.when($.getData(AJAX_CONTROLER_URL + '/PageInfo/GetTables?ConnName=' + $('#ConnName').val())).done(function (json) {
                $('#TableName').ComboBox('reload', {
                    list: json.aaData,
                    onLoadComplete: function () {
                        $('#TableName').ComboBox('value', currVal);
                    }
                });
            });
        }

        function pageFieldComplete(oTable, oSettings, json, options) {
            $('#PageField_dialogtabs').tabs();
            createPropsViews();
        }

        function reloadPageFieldDBList() {
            $(FIELD_DB_TABLE_SEL).Catalog('clearTable');
            var url = AJAX_CONTROLER_URL + '/PageInfo/GetTableColumns?tableName=' + $('#TableName').val() + '&connName=' + $('#ConnName').val();
            $(FIELD_DB_TABLE_SEL).Catalog('reloadTable', url);
        }

        function getAppName(appId) {
            return APP_PATH.replace('/', '');
        }

        function createPropsPage(pageConfig) {
            pageConfig.Tabs[0].Fields[0].DropDownInfo = '';
            $('#' + pageConfig.Name + 'table_container').Page({
                source: pageConfig,
                dialogStyle: 'table',
                onLoadComplete: function (config) {
                    $('#' + pageConfig.PropsTableRow + ' td').append($(pageConfig.PROPS_TABLE_SEL));
                    loadPropsDrop(pageConfig);
                    initPropsCatalog(pageConfig);
                }
            });
        }

        function loadPropsDrop(pageConfig) {
            var defaultKeys = '{"aaData":[{"FieldName":"DropDownProperty","Value":"10","Text":"url","ShortText":"","Enable":"True","Selected":"False","ItemId":"41"},{"FieldName":"DropDownProperty","Value":"20","Text":"valField","ShortText":"","Enable":"True","Selected":"False","ItemId":"42"},{"FieldName":"DropDownProperty","Value":"30","Text":"textField","ShortText":"","Enable":"True","Selected":"False","ItemId":"43"}]}';
            if (pageConfig.Name == 'JoinInfo') {
                defaultKeys = '{"aaData":[{"FieldName":"JoinInfoProperty","Value":"10","Text":"ExtraJoinDetails","ShortText":"","Enable":"True","Selected":"False","ItemId":"44"},{"FieldName":"JoinInfoProperty","Value":"20","Text":"JoinField","ShortText":"","Enable":"True","Selected":"False","ItemId":"45"},{"FieldName":"JoinInfoProperty","Value":"30","Text":"JoinFields","ShortText":"","Enable":"True","Selected":"False","ItemId":"46"},{"FieldName":"JoinInfoProperty","Value":"40","Text":"JoinType","ShortText":"","Enable":"True","Selected":"False","ItemId":"47"},{"FieldName":"JoinInfoProperty","Value":"50","Text":"TableName","ShortText":"","Enable":"True","Selected":"False","ItemId":"48"}]}';
            } else if (pageConfig.Name == 'ControlProps') {
                defaultKeys = '{"aaData":[{"FieldName":"ControlProps","Value":"10","Text":"colSpan","ShortText":"","Enable":"True","Selected":"False","ItemId":"49"},{"FieldName":"ControlProps","Value":"20","Text":"maxlength","ShortText":"","Enable":"True","Selected":"False","ItemId":"50"},{"FieldName":"ControlProps","Value":"30","Text":"disabled","ShortText":"","Enable":"True","Selected":"False","ItemId":"51"},{"FieldName":"ControlProps","Value":"40","Text":"class","ShortText":"","Enable":"True","Selected":"False","ItemId":"52"},{"FieldName":"ControlProps","Value":"50","Text":"nowrap","ShortText":"","Enable":"True","Selected":"False","ItemId":"53"},{"FieldName":"ControlProps","Value":"60","Text":"filter-type","ShortText":"","Enable":"True","Selected":"False","ItemId":"54"},{"FieldName":"ControlProps","Value":"70","Text":"search-type","ShortText":"","Enable":"True","Selected":"False","ItemId":"55"}]}';
            }

            var data = $.evalJSON(defaultKeys);
            $('#' + pageConfig.Name + '_dialog #PropKey').ComboBox({list:data.aaData, "valField": "Text", "textField": "Text", "removedInvalid": false });
        }

        function getPageConfig(entity) {
            return $.ajax({
                url: AJAX_CONTROLER_URL + '/PageInfo/GetPageConfig?pageName=' + entity.Name
            });
        }

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div id="my-carousel">
        <ul class="carousel">
            <li class="carousel">
                <h2>Page Config</h2>
                <div id="page_catalog_container" style="display: block;">
                    <table cellpadding="0" cellspacing="0" border="0" class="display" id="Page_table">
                        <thead>
                            <tr>
                                <th align="left">Name</th>
                                <th align="left">Title</th>
                                <th align="left">Table Name</th>
                                <th align="left">Conn Name</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </li>

            <li class="carousel">

                <div id="configtabs">
                    <ul id="configtabs-nav">
                        <li><a href="#configtabs-1">General</a></li>
                        <li><a href="#configtabs-2">Dialog</a></li>
                        <li><a href="#configtabs-3">Grid</a></li>
                        <li><a href="#configtabs-4">Filter</a></li>
                    </ul>
                    <div id="configtabs-1">
                        <div id="Page_dialog" title="Page Config" style="" class="modal-form">
                           <div id="Page_dialogtabs" class="ui-tabs ui-widget ui-corner-all" style="border: 0px;">
                              <div id="tabs-1" aria-labelledby="ui-id-17" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="false" style="padding: 0px;">
                                 <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
                                    <tbody>
                                       <tr class="columns-1">
                                          <td width="100%"><label for="Name">Name<font color="red">*</font> :</label></td>
                                       </tr>
                                       <tr class="columns-1">
                                          <td valign="top" width="100%"><input type="text" name="Name" id="Name" class="text ui-widget-content ui-corner-all"></td>
                                       </tr>
                                       <tr class="columns-1">
                                          <td width="100%"><label for="Title">Title<font color="red">*</font> :</label></td>
                                       </tr>
                                       <tr class="columns-1">
                                          <td valign="top" width="100%"><input type="text" name="Title" id="Title" class="text ui-widget-content ui-corner-all"></td>
                                       </tr>
                                       <tr class="columns-1">
                                          <td width="100%"><label for="ConnName">ConnName :</label></td>
                                       </tr>
                                       <tr class="columns-1">
                                          <td valign="top" width="100%"><select name="ConnName" id="ConnName" class="ui-widget-content ui-corner-all"></select></td>
                                       </tr>
                                       <tr class="columns-1">
                                          <td width="100%"><label for="TableName">TableName<font color="red">*</font> :</label></td>
                                       </tr>
                                       <tr class="columns-1">
                                          <td valign="top" width="100%"><select name="TableName" id="TableName" class="ui-widget-content ui-corner-all"></select></td>
                                       </tr>
                                    </tbody>
                                 </table>
                                 <input type="hidden" name="PageAppId" id="PageAppId"><input type="hidden" name="PageId" id="PageId"><input type="hidden" name="UpdatedBy" id="UpdatedBy"><input type="hidden" name="UpdatedDate" id="UpdatedDate"><input type="hidden" name="AppName" id="AppName" filter-type="text" search-type="equals">
                              </div>
                           </div>
                        </div>
                    </div>
                    <div id="configtabs-2">
                        <div id="tabs" style="height: 440px;">
                            <div class="tabcontainer">
                                <table width="100%" cellpading="0" cellspacing="0" style="padding:0px;">
                                    <tr>
                                        <td width="737px">
                                            <div id="tabsection" class="scroller">
                                                <ul></ul>
                                            </div>
                                        </td>
                                        <td>
                                            <div id="tabscrollsection" style="display:none;" class="tabscroll ui-widget-header">
                                                <button id="tabscrollright" class="scrollbtn right">Scroll Right</button>
                                                <button id="tabscrollleft" class="scrollbtn left">Scroll Left</button>
                                            </div>
                                        </td>
                                        <td>
                                            <div id="tabssearchsection" style="display:none;" class="tabscroll searchContainer ui-widget-header">
                                                <input type="search" id="searchFields" class="text ui-corner-all" placeholder="Quick Search" aria-controls="pages">
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div id="configtabs-3"  style="overflow-y:scroll; height:500px;">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tbody>
                                <tr>
                                    <td width="50%">
                                        <div style="height: 440px;">
                                            <ul id="grid-columns" style="width: 100%;">
                                                <li id="grid-columns-empty">No fields have been added to the grid.</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td width="50%"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="configtabs-4" style="overflow-y:scroll; height:500px;">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tbody>
                                <tr>
                                    <td width="50%">
                                        <div style="height: 440px;">
                                            <ul id="filter-fields" style="width: 100%;">
                                                <li id="filter-fields-empty">No fields have been added to the filter.</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td width="50%"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </li>
        </ul>
    </div>


    <div id="pagetab_catalog_container" style="display: none;">
       <table cellpadding="0" cellspacing="0" border="0" class="display" id="PageTab_table">
          <thead>
             <tr>
                <th align="left">Name</th>
                <th align="left">Cols</th>
             </tr>
          </thead>
          <tbody></tbody>
       </table>
    </div>

    <div id="pagefield_catalog_container" style="display: none;">
       <table cellpadding="0" cellspacing="0" border="0" class="display" id="PageField_table">
          <thead>
             <tr>
                <th align="left">Name</th>
                <th align="left">Type</th>
                <th align="left">ControlType</th>
             </tr>
          </thead>
          <tbody></tbody>
       </table>
    </div>

    <div id="pagecolumn_catalog_container" style="display: none;">
       <table cellpadding="0" cellspacing="0" border="0" class="display" id="PageGridColumn_table">
          <thead>
             <tr>
                <th align="left">ColumnName</th>
             </tr>
          </thead>
          <tbody></tbody>
       </table>
    </div>

    <div id="pagefield_list_dialog" title="Fields from Database" style="display: none;" class="modal-form">
       <p class="validateTips ui-corner-all"></p>
       <table cellpadding="0" cellspacing="0" border="0" class="display" id="PageDBFields_table">
          <thead>
             <tr>
                <th align="left">Name</th>
                <th align="left">Type</th>
                <th align="left">Nullable</th>
                <th align="left">Add</th>
             </tr>
          </thead>
          <tbody></tbody>
       </table>
    </div>

    <div id="PageTab_dialog" title="Page Tab" style="display:none;" class="modal-form">
       <p class="validateTips ui-corner-all"></p>
       <div id="PageTab_dialogtabs" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
          <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
             <li id="TabTab" class="ui-state-default ui-corner-top ui-tabs-active ui-state-active" role="tab" tabindex="0" aria-controls="tabs-1" aria-labelledby="ui-id-30" aria-selected="true" aria-expanded="true"><a href="#tabs-1" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-30">Tab</a></li>
          </ul>
          <div id="tabs-1" aria-labelledby="ui-id-30" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="false">
             <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
                <tbody>
                   <tr class="columns-1">
                      <td width="100%"><label for="TabName">Name<font color="red">*</font> :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><input type="text" name="TabName" id="TabName" class="text ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-1">
                      <td width="100%"><label for="Cols">Cols<font color="red">*</font> :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><input type="text" name="Cols" id="Cols" class="text ui-widget-content ui-corner-all"></td>
                   </tr>
                </tbody>
             </table>
             <input type="hidden" name="TabId" id="TabId"><input type="hidden" name="PageId" id="PageId"><input type="hidden" name="TabOrder" id="TabOrder"><input type="hidden" name="UpdatedBy" id="UpdatedBy"><input type="hidden" name="UpdatedDate" id="UpdatedDate">
          </div>
       </div>
    </div>

    <div id="PageField_dialog" title="Page Field" style="display:none;" class="modal-form">
       <p class="validateTips ui-corner-all"></p>
       <div id="PageField_dialogtabs" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
          <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
             <li id="DetailsTab" class="ui-state-default ui-corner-top ui-tabs-active ui-state-active" role="tab" tabindex="0" aria-controls="tabs-1" aria-labelledby="ui-id-15" aria-selected="true" aria-expanded="true"><a href="#tabs-1" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-15">Details</a></li>
             <li id="DropDownInfoTab" class="ui-state-default ui-corner-top" role="tab" tabindex="-1" aria-controls="tabs-2" aria-labelledby="ui-id-16" aria-selected="false" aria-expanded="false"><a href="#tabs-2" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-16">Drop Down Info</a></li>
             <li id="JoinInfoTab" class="ui-state-default ui-corner-top" role="tab" tabindex="-1" aria-controls="tabs-3" aria-labelledby="ui-id-17" aria-selected="false" aria-expanded="false"><a href="#tabs-3" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-17">Join Info</a></li>
             <li id="PropertiesTab" class="ui-state-default ui-corner-top" role="tab" tabindex="-1" aria-controls="tabs-4" aria-labelledby="ui-id-18" aria-selected="false" aria-expanded="false"><a href="#tabs-4" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-18">Properties</a></li>
          </ul>
          <div id="tabs-1" aria-labelledby="ui-id-15" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="false">
             <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
                <tbody>
                   <tr class="columns-2">
                      <td width="50%"><label for="FieldName">Name<font color="red">*</font> :</label></td>
                      <td width="50%"><label for="IsId">IsId :</label></td>
                   </tr>
                   <tr class="columns-2">
                      <td valign="top" width="50%"><input type="text" name="FieldName" id="FieldName" class="text ui-widget-content ui-corner-all"></td>
                      <td valign="top" width="50%"><input type="checkbox" name="IsId" id="IsId" class="ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-2">
                      <td width="50%"><label for="DBFieldName">DB Name<font color="red">*</font> :</label></td>
                      <td width="50%"><label for="Required">Required :</label></td>
                   </tr>
                   <tr class="columns-2">
                      <td valign="top" width="50%"><input type="text" name="DBFieldName" id="DBFieldName" class="text ui-widget-content ui-corner-all"></td>
                      <td valign="top" width="50%"><input type="checkbox" name="Required" id="Required" class="ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-2">
                      <td width="50%"><label for="Label">Label<font color="red">*</font> :</label></td>
                      <td width="50%"><label for="Exportable">Exportable :</label></td>
                   </tr>
                   <tr class="columns-2">
                      <td valign="top" width="50%"><input type="text" name="Label" id="Label" class="text ui-widget-content ui-corner-all"></td>
                      <td valign="top" width="50%"><input type="checkbox" name="Exportable" id="Exportable" class="ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-2">
                      <td width="50%"><label for="Type-button">Type<font color="red">*</font> :</label></td>
                      <td width="50%"><label for="Insertable">Insertable :</label></td>
                   </tr>
                   <tr class="columns-2">
                      <td valign="top" width="50%">
                         <select name="Type" id="Type" class="ui-widget-content ui-corner-all selectMenu">
                            <option value="" selected="selected"></option>
                            <option value="bigint">bigint</option>
                            <option value="bit">bit</option>
                            <option value="char">char</option>
                            <option value="date">date</option>
                            <option value="datetime">datetime</option>
                            <option value="datetime2">datetime2</option>
                            <option value="decimal">decimal</option>
                            <option value="encrypt">encrypt</option>
                            <option value="escapetext">escapetext</option>
                            <option value="int">int</option>
                            <option value="money">money</option>
                            <option value="nchar">nchar</option>
                            <option value="number">number</option>
                            <option value="nvarchar">nvarchar</option>
                            <option value="real">real</option>
                            <option value="smalldatetime">smalldatetime</option>
                            <option value="smallint">smallint</option>
                            <option value="timestamp(6)">timestamp(6)</option>
                            <option value="tinyint">tinyint</option>
                            <option value="varbinary">varbinary</option>
                            <option value="varchar">varchar</option>
                            <option value="varchar2">varchar2</option>
                         </select>
                      </td>
                      <td valign="top" width="50%"><input type="checkbox" name="Insertable" id="Insertable" class="ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-2">
                      <td width="50%"><label for="ControlType-button">ControlType<font color="red">*</font> :</label></td>
                      <td width="50%"><label for="Updatable">Updatable :</label></td>
                   </tr>
                   <tr class="columns-2">
                      <td valign="top" width="50%">
                         <select name="ControlType" id="ControlType" class="ui-widget-content ui-corner-all selectMenu">
                            <option value="" selected="selected"></option>
                            <option value="checkbox">checkbox</option>
                            <option value="dropdownlist">dropdownlist</option>
                            <option value="hidden">hidden</option>
                            <option value="inputbox">inputbox</option>
                            <option value="multiline">multiline</option>
                            <option value="multiselect">multiselect</option>
                            <option value="selectmenu">selectmenu</option>
                            <option value="timepicker">timepicker</option>
                         </select>
                      </td>
                      <td valign="top" width="50%"><input type="checkbox" name="Updatable" id="Updatable" class="ui-widget-content ui-corner-all"></td>
                   </tr>
                </tbody>
             </table>
             <input type="hidden" name="FieldId" id="FieldId"><input type="hidden" name="TabId" id="TabId"><input type="hidden" name="FieldOrder" id="FieldOrder"><input type="hidden" name="UpdatedBy" id="UpdatedBy"><input type="hidden" name="UpdatedDate" id="UpdatedDate">
          </div>
          <div id="tabs-2" aria-labelledby="ui-id-16" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">
             <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
                <tbody>
                   <tr class="columns-1">
                      <td width="100%"><label for="DropDownInfo">DropDownInfo :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><textarea rows="6" name="DropDownInfo" id="DropDownInfo" class="text ui-widget-content ui-corner-all"></textarea></td>
                   </tr>
                </tbody>
             </table>
          </div>
          <div id="tabs-3" aria-labelledby="ui-id-17" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">
             <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
                <tbody>
                   <tr class="columns-1">
                      <td width="100%"><label for="JoinInfo">JoinInfo :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><textarea rows="6" name="JoinInfo" id="JoinInfo" class="text ui-widget-content ui-corner-all"></textarea></td>
                   </tr>
                </tbody>
             </table>
          </div>
          <div id="tabs-4" aria-labelledby="ui-id-18" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="true" style="display: none;">
             <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
                <tbody>
                   <tr class="columns-1">
                      <td width="100%"><label for="ControlProps">ControlProps :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><textarea rows="6" name="ControlProps" id="ControlProps" class="text ui-widget-content ui-corner-all"></textarea></td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>

    <div id="PageGridColumn_dialog" title="Page Grid Column" style="display:none;" class="modal-form">
       <p class="validateTips ui-corner-all"></p>
       <div id="PageGridColumn_dialogtabs" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
          <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
             <li id="GridColumnDetailsTab" class="ui-state-default ui-corner-top ui-tabs-active ui-state-active" role="tab" tabindex="0" aria-controls="tabs-1" aria-labelledby="ui-id-15" aria-selected="true" aria-expanded="true"><a href="#tabs-1" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-15">Grid Column Details</a></li>
          </ul>
          <div id="tabs-1" aria-labelledby="ui-id-15" class="ui-tabs-panel ui-widget-content ui-corner-bottom" role="tabpanel" aria-hidden="false">
             <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
                <tbody>
                   <tr class="columns-1">
                      <td width="100%"><label for="ColumnName">Name :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><input type="text" name="ColumnName" id="ColumnName" class="text ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-1">
                      <td width="100%"><label for="ColumnLabel">Label :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><input type="text" name="ColumnLabel" id="ColumnLabel" class="text ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-1">
                      <td width="100%"><label for="Width">Width<font color="red">*</font> :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><input type="text" name="Width" id="Width" class="text ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-1">
                      <td width="100%"><label for="Visible">Visible<font color="red">*</font> :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><input type="checkbox" name="Visible" id="Visible" class="ui-widget-content ui-corner-all"></td>
                   </tr>
                   <tr class="columns-1">
                      <td width="100%"><label for="Searchable">Searchable<font color="red">*</font> :</label></td>
                   </tr>
                   <tr class="columns-1">
                      <td valign="top" width="100%"><input type="checkbox" name="Searchable" id="Searchable" class="ui-widget-content ui-corner-all"></td>
                   </tr>
                </tbody>
             </table>
             <input type="hidden" name="ColumnId" id="ColumnId"><input type="hidden" name="ColumnOrder" id="ColumnOrder"><input type="hidden" name="FieldId" id="FieldId"><input type="hidden" name="PageId" id="PageId"><input type="hidden" name="UpdatedBy" id="UpdatedBy"><input type="hidden" name="UpdatedDate" id="UpdatedDate">
          </div>
       </div>
    </div>

    <div id="props_tables_container" style="display:none;"></div>

    <div id="filter_dialog" title="Filter" style="display: none;" class="modal-form">
        <p class="validateTips ui-corner-all"></p>
        <fieldset>
            <label for="FilterText">Text :</label>
            <input type="text" name="FilterText" id="FilterText" value="Filter" class="text ui-widget-content ui-corner-all" />
            <label for="FilterCols">Columns :</label>
            <input type="text" name="FilterCols" id="FilterCols" value="1" class="text ui-widget-content ui-corner-all" />
            <label for="ShowClear">Show Clear :</label>
            <input type="checkbox" name="ShowClear" id="ShowClear" checked class="ui-widget-content ui-corner-all" />
            <input type="hidden" name="FilterId" id="FilterId" />
        </fieldset>
    </div>

</asp:Content>
