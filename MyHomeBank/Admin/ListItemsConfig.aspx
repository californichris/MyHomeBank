<%@ Page Title="Page List Items Config" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ListItemsConfig.aspx.cs" Inherits="EPE.Common.ListItemsConfig" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
	<script type="text/javascript">

	    $(document).ready(function () {
	        $('div.catalog').Page({
	            source: AJAX_CONTROLER_URL + '/PageInfo/GetPageConfig?pageName=PageListItem',
	            onLoadComplete: function (config) {
	                $('h2').text(config.Title);
	                initializeCatalog(config);
	            }
	        });
	    });

	    function initializeCatalog(config) {
	        $('table.display').Catalog({
	            pageConfig: config,
	            showText: true,
	            displayLength: 25,
	            dialogWidth: 700,
	            dialogHeight: 600,
	            showExport: true,
	            validate: function (tips) {
	                return validateDialog(config, tips);
	            },
	            initCompleteCallBack: function (oTable, oSettings, json, options) {
                    //Creating copy buton
	                var btn = $('<button onclick="return false;" title="Copy" class="disable">Copy</button>');
	                btn.button().click(function (event) {
	                    $('table.display').Catalog('editEntity', oTable, options);
	                    $('#ItemId').val('');
	                    $('#Value').val(parseInt($('#Value').val()) + 10);
	                    $('#Text').focus().val('');
	                }).button('disable');

	                $('table.display').Catalog('getButtonSection').append(btn);
	            }
	        });
	    }

	</script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>
        List Items config
    </h2>
    <div class="catalog">

    </div>
</asp:Content>
