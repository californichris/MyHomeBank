<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="CurrentUsers.aspx.cs" Inherits="CIAC.Admin.CurrentUsers" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script type="text/javascript">
        const DEFAULT_PAGE_CONFIG = $.evalJSON('{"Name": "CurrentUsers","Title": "Current Users","GridFields": [{"ColumnId": "59256","FieldId": "16816","ColumnName": "SessionId","ColumnLabel": "SessionId","ColumnOrder": "1","Visible": "True","Searchable": "True","Width": "0"}, {"ColumnId": "59257","FieldId": "16817","ColumnName": "IpAddress","ColumnLabel": "IpAddress","ColumnOrder": "5","Visible": "True","Searchable": "True","Width": "0"}, {"ColumnId": "59258","FieldId": "16818","ColumnName": "UserLogin","ColumnLabel": "UserLogin","ColumnOrder": "2","Visible": "True","Searchable": "True","Width": "0"}, {"ColumnId": "59259","FieldId": "16819","ColumnName": "UserAgent","ColumnLabel": "UserAgent","ColumnOrder": "6","Visible": "True","Searchable": "True","Width": "0"}, {"ColumnId": "59260","FieldId": "16820","ColumnName": "SessionStarted","ColumnLabel": "SessionStarted","ColumnOrder": "3","Visible": "True","Searchable": "True","Width": "0"}, {"ColumnId": "59434","FieldId": "16827","ColumnName": "SessionLastActivity","ColumnLabel": "SessionLastActivity","ColumnOrder": "4","Visible": "True","Searchable": "True","Width": "0"}],"Tabs": [{"TabId": "1425","TabName": "Details","TabOrder": "1","Cols": "1","Fields": [{"FieldId": "16816","FieldName": "SessionId","Label": "SessionId","Type": "varchar","Required": "False","DropDownInfo": "","Exportable": "False","FieldOrder": "0","ControlType": "inputbox","IsId": "True","JoinInfo": "","DBFieldName": "SessionId","Insertable": "False","Updatable": "False","ControlProps": ""}, {"FieldId": "16817","FieldName": "IpAddress","Label": "IpAddress","Type": "varchar","Required": "False","DropDownInfo": "","Exportable": "False","FieldOrder": "1","ControlType": "inputbox","IsId": "False","JoinInfo": "","DBFieldName": "IpAddress","Insertable": "False","Updatable": "False","ControlProps": ""}, {"FieldId": "16818","FieldName": "UserLogin","Label": "UserLogin","Type": "varchar","Required": "False","DropDownInfo": "","Exportable": "False","FieldOrder": "2","ControlType": "inputbox","IsId": "False","JoinInfo": "","DBFieldName": "UserLogin","Insertable": "False","Updatable": "False","ControlProps": ""}, {"FieldId": "16819","FieldName": "UserAgent","Label": "UserAgent","Type": "varchar","Required": "False","DropDownInfo": "","Exportable": "False","FieldOrder": "3","ControlType": "inputbox","IsId": "False","JoinInfo": "","DBFieldName": "UserAgent","Insertable": "False","Updatable": "False","ControlProps": ""}, {"FieldId": "16820","FieldName": "SessionStarted","Label": "SessionStarted","Type": "varchar","Required": "False","DropDownInfo": "","Exportable": "False","FieldOrder": "4","ControlType": "inputbox","IsId": "False","JoinInfo": "","DBFieldName": "SessionStarted","Insertable": "False","Updatable": "False","ControlProps": ""}, {"FieldId": "16827","FieldName": "SessionLastActivity","Label": "SessionLastActivity","Type": "varchar","Required": "False","DropDownInfo": "","Exportable": "False","FieldOrder": "6","ControlType": "inputbox","IsId": "False","JoinInfo": "","DBFieldName": "SessionLastActivity","Insertable": "False","Updatable": "False","ControlProps": ""}]}],"Filter": null}');
        const PAGE_NAME = 'CurrentUsers';
        const TABLE_SEL = '#' + PAGE_NAME + '_table';
        const DIALOG_SEL = '#' + PAGE_NAME + '_dialog';

        $(document).ready(function () {
            $('div.catalog').Page({
                source: DEFAULT_PAGE_CONFIG,
                dialogStyle: 'table', createPageDialog: false,
                onLoadComplete: function (config) {
                    $('h2').text(config.Title);
                    document.title = config.Title;
                    initCatalog(config);
                }
            });            
        });

        function initCatalog(config) {
            $(TABLE_SEL).Catalog({
                pageConfig: config, showNew: false, showDelete: false,
                showEdit: false, showExport: false,
                source: AJAX_CONTROLER_URL + '/Users/GetCurrentUsers',
                initCompleteCallBack: initComplete
            });
        }

        function initComplete(oTable, oSettings, json, options) {
            var btn = $('<button onclick="return false;" title="Refresh User" class="disable">Refresh</button>');
            btn.button().click(refreshUser).button('disable');
            $(TABLE_SEL).Catalog('getButtonSection').append(btn);
        }

        function refreshUser() {
            var entity = getSelectedRowData($(TABLE_SEL).DataTable());

            $.ajax({
                type: 'POST',
                url: AJAX_CONTROLER_URL + '/Users/RefreshUser',
                data: 'entity=' + encodeURIComponent($.toJSON(entity))
            }).done(function (json) {
                if (json.ErrorMsg == SUCCESS) {
                    alert('User successfully refreshed.');
                } else {
                    alert('Not able to refresh user.');
                }
            });
        }

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2></h2>
    <div class="catalog"></div>
</asp:Content>
