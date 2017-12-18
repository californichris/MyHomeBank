<%@ Page Title="Refresh Cache" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="RefreshCache.aspx.cs" Inherits="EPE.Common.RefreshCache" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
<script type="text/javascript">

    $(document).ready(function () {
        
        $('#refreshPageCache').button().click(function () {
            $.ajax({
                url: AJAX_CONTROLER_URL + '/PageInfo/RefreshCache',
                dataType: 'json'
            }).done(function (json) {
                alert(json.ErrorMsg);
            });
        });        

    });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2>
        Refresh Cache
    </h2>
    <div class="catalog"><br />
        <button id="refreshPageCache" onclick="return false;">Refresh Page Cache</button><br /><br />
    </div>
</asp:Content>
