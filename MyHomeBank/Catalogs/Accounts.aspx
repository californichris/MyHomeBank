﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Accounts.aspx.cs" Inherits="MyHomeBank.Catalogs.Accounts" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script type="text/javascript">
        const PAGE_NAME = 'Account';
        $(document).ready(function () {
            $('div.catalog').Page({
                source: AJAX_CONTROLER_URL + '/PageInfo/GetPageConfig?pageName=' + PAGE_NAME,
                dialogStyle: 'table',
                onLoadComplete: function (config) {
                    $('h2').text(config.Title);
                    if (config.Filter != null) $('div.catalog').before('<br/>')
                    document.title = config.Title;
                    initializeCatalog(config);
                }
            });
        });

        function initializeCatalog(config) {
            $('table.display').Catalog({
                pageConfig: config,
                showExport: true,
                serverSide: true
            });
        }
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2></h2>
    <div class="catalog"></div>
</asp:Content>
