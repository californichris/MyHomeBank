<%@ Page Title="Query Helper" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="QueryHelper.aspx.cs" Inherits="EPE.Common.QueryHelper" %>
<%@ Import Namespace="System.Web.Optimization" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
<%: Styles.Render("~/Styles/query_helper_css","~/Styles/extra_widgets_css") %>
<style type="text/css">
    #querytabs .ui-tabs-panel {
        overflow-y: scroll; 
        height: 420px;
    }

    pre.query code {
        white-space: pre-wrap;       /* Since CSS 2.1 */
        word-wrap: break-word;       /* Internet Explorer 5.5+ */
    }

    #my-carousel div.mask {
        height:600px!important;
    }
</style>
<%: Scripts.Render("~/Scripts/query_helper_js","~/Scripts/extra_widgets_js") %> 
<script type="text/javascript">
    var carousel;
    var curentPage;

    $(document).ready(function () {
        carousel = $('#my-carousel').carousel({ pagination: false, nextPrevLinks: false, speed: 'fast' });

        //Create page catalog
        $('#pages').Catalog({
            fieldId: 'PageId',
            dialogSelector: '', // no dialog
            columns: [
                { "mDataProp": "Name", "sName": "Name", "bVisible": true, "bSearchable": true },
                { "mDataProp": "Title", "sName": "Title", "bVisible": true, "bSearchable": true },
                { "mDataProp": "TableName", "sName": "TableName", "bVisible": true, "bSearchable": true },
                { "mDataProp": "ConnName", "sName": "ConnName", "bVisible": true, "bSearchable": true }
            ],
            displayLength: 18,
            source: AJAX_CONTROLER_URL + "/PageInfo/GetPageList",
            saveRequest: AJAX_CONTROLER_URL + '/PageInfo/SavePage',
            deleteRequest: AJAX_CONTROLER_URL + '/PageInfo/DeletePage',
            showNew: false,
            showDelete: false,            
            editEntityCallBack: function (oTable, options) {
                var row = getSelectedRowData(oTable);
                $('#currentPage').text('Query Helper - ' + row.Name)

                carousel.data('carousel').moveToItem(1);

                $.when(getConfig(row.Name)).done(function (json) {
                    curentPage = json;
                    $.when(createEntityDialog(curentPage), createFilter(curentPage)).done(function () {
                        getSelectStatement();
                        $('#querytabs').tabs('option', 'active', 0);
                    });
                });
            },
            initCompleteCallBack: function (oTable, oSettings, json, options) {
                $('#editpages .ui-button-text').text('View');
            }
        });

        $('#querytabs').tabs({
            activate: function (event, ui) {
                var queryType = $(ui.newPanel).attr('querytype');
                if ($.trim($('#' + queryType + 'Statement code').text()) == '') {
                    getStatement(curentPage, queryType);
                }
            },
            create: function (event, ui) {
                appendTabsButtons();
            }
        });

        $('#entity_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '600',
            height: '470',
            buttons: [
                {
                    id: "updateEntityBtn", text: "Update",
                    click: function () {
                        $(this).dialog('close');
                        refreshQuery();
                    }
                },
                {
                    id: "cancelEntityBtn", text: "Cancel",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ],
            close: function () {                
            }
        });

        $('#filter_dialog').dialog({
            autoOpen: false,
            modal: true,
            width: '600',
            height: '400',
            buttons: [
                {
                    id: "updateFilterBtn", text: "Update",
                    click: function () {
                        $(this).dialog('close');
                        refreshQuery();
                    }
                },
                {
                    id: "cancelFilterBtn", text: "Cancel",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ],
            close: function () {
            }
        });

        $('#updateFilter').button({ icons: { primary: 'ui-icon-gear' }, text: false }).click(function (event) {
            $('#filter_dialog').dialog('open');
        }).button('disable');

        $('#searchType').selectmenu({
            change: function (event, ui) { refreshQuery(); }
        });

        $('#serverSide').change(function () {
            refreshQuery();
            $('#updateFilter').button($('#serverSide').is(':checked') ? 'enable' : 'disable');
        });

        $('#orderDir,#orderBy').selectmenu();
    });

    function getSelectStatement(page) {
        if ($.trim($('#selectStatement code').text()) == '') {
            getStatement(curentPage, 'select');
        }
    }

    function getConfig(pageName) {
        var dfd = jQuery.Deferred();

        $.getJSON(
            AJAX_CONTROLER_URL + '/PageInfo/GetPageConfig?pageName=' + pageName
        ).done(function (json) {
            if (json.ErrorMsg) {
                alert(json.ErrorMsg);
                dfd.reject(json.ErrorMsg);
            }

            dfd.resolve(json);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            var json = eval('(' + jqXHR.responseText + ')');
            if (json.ErrorMsg) {
                alert(json.ErrorMsg);
                dfd.reject(json.ErrorMsg);
            }
            alert('Unable to get page configuration.');
            dfd.reject('Unable to get page configuration.');
        });

        return dfd.promise();
    }

    function appendTabsButtons() {
        var btnsTab = $('<li style="width:760px"></li>');
        btnsTab.append('<table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td valign="middle" align="right"></td></tr></tbody></table>');
        btnsTab.find('td').append('<div style="width:520px; float: left;"><p class="validateTips ui-corner-all" id="validateTips" style="margin:0px 0px 0px 2px;text-align: left;"></p></div>');
        btnsTab.find('td').append('<button id="refreshQuery" onclick="return false;" title="Refresh Config">Refresh</button>');
        btnsTab.find('td').append('<button id="updateEntity" onclick="return false;" title="Update entity info">Update Entity</button>');
        btnsTab.find('td').append('<button id="cancelQuery" onclick="return false;" title="Back to page list">Cancel</button>');

        $('#querytabs-nav').append(btnsTab);

        //Bind a click handler to the cancel button
        $('#cancelQuery').button({ icons: { primary: 'ui-icon-close' }, text: false }).click(function (event) {
            $('#pages').Catalog('reloadTable');
            carousel.data('carousel').moveToItem(0);
            $('pre.query code').text('');//clear all queries

            $('#searchType').val('OR').selectmenu('refresh');
            $('#serverSide').prop('checked', false);
            $('#updateFilter').button('disable');
        });

        //Bind a click handler to the refresh button
        $('#refreshQuery').button({ icons: { primary: 'ui-icon-arrowrefresh-1-s' }, text: false }).click(function (event) {
            $.when(getConfig(curentPage.Name)).done(function (json) {
                curentPage = json;
                var entity = getObject('#entity_dialog');

                $.when(createEntityDialog(curentPage), createFilter(curentPage)).done(function () {
                    $('pre.query code').text('');//clear all queries
                    populateDialog(entity, '#entity_dialog');
                    refreshQuery();
                });
            });         
        });

        //Bind a click handler to the updateEntity button
        $('#updateEntity').button({ icons: { primary: 'ui-icon-pencil' }, text: false }).click(function (event) {
            $('#entity_dialog').dialog('open');
        });

    }

    function refreshQuery() {
        var active = $('#querytabs').tabs('option', 'active');
        var queryType = $('#querytabs-' + active).attr('querytype');

        getStatement(curentPage, queryType);
    }

    function createEntityDialog(page) {
        return $.Deferred(function (dfd) {

            //clear table
            var tbody = $('#entity_dialog table tbody').html('');
            var html = new StringBuffer();
            var tabs = page.Tabs;
            for (var t = 0; t < tabs.length; t++) {
                var fields = tabs[t].Fields;
                var length = fields.length;
                for (var f = 0; f < length; f++) {
                    var field = fields[f];

                    html.append('<tr><td>').append(field.Label).append(':</td><td>');
                    html.append('<input type="text" name="').append(field.FieldName).append('" id="').append(field.FieldName).append('" class="text ui-widget-content ui-corner-all" /></td></tr>');                    
                }
            }

            tbody.append(html.toString());

            dfd.resolve();
        }).promise();
    }

    function createFilter(page) {
        //$('#page_filter').html('');////This code works if you want to create the filter as on every page

        return $.Deferred(function (dfd) {

            //clear table
            var tbody = $('#filter_dialog #filter_table tbody').html('');
            $('#orderBy').empty();
            $('#quickSearch').val('');
            $('#orderDir').val('asc').selectmenu('refresh');

            var html = new StringBuffer();
            for (var g = 0; g < page.GridFields.length; g++) {
                var field = page.GridFields[g];

                if (isTrue(field.Searchable)) {
                    html.append('<tr><td>').append(field.ColumnLabel).append(':</td><td>');
                    html.append('<input type="text" name="').append(field.ColumnName).append('Filter" id="').append(field.ColumnName).append('Filter" class="text ui-widget-content ui-corner-all" /></td></tr>');
                }

                var selected = '';
                if (g == 0) {
                    selected = 'selected';
                }
                $('#orderBy').append($('<option value="' + g + '" ' + selected + '>' + field.ColumnName + '</option>'));
                $('#orderBy').selectmenu('refresh');
            }

            tbody.append(html.toString());
            dfd.resolve();
            /*
            //This code works if you want to create the filter as on every page
            page.filterSelector = '#page_filter';

            $('#page_filter').Page({
                source: page,
                createPageTable: false,
                createPageDialog: false,                
                onLoadComplete: function (config) {
                    dfd.resolve();
                }
            });*/
            
        }).promise();
    }

    function getStatement(page, queryType) {
        var _url = AJAX_CONTROLER_URL + '/QueryHelper/Get' + toCamelCase(queryType) + 'Statement?pageName=' + page.Name + '&searchType=' + $('#searchType').val();
        if (queryType == 'select' && $('#serverSide').is(':checked')) {
            _url += '&filterInfo=' + encodeURIComponent($.toJSON(getFilterInfo()));
        }

        var entity = getObject('#entity_dialog');
        $.ajax({
            url: _url,
            data: 'entity=' + encodeURIComponent($.toJSON(entity))
        }).done(function (json) {
            if (json.ErrorMsg) {
                alert(json.ErrorMsg);
            }

            var statement = json.Statement.replace(/FROM/g, '\nFROM');
            statement = statement.replace(/INNER/g, '\nINNER');
            statement = statement.replace(/LEFT OUTER/g, '\nLEFT OUTER');
            statement = statement.replace(/WHERE/g, '\nWHERE');

            $('#' + queryType + 'Statement code').text(statement);
            Prism.highlightAll();
        }).fail(function (json) {
            if (json.ErrorMsg) {
                alert(json.ErrorMsg);
                return;
            }

            alert('Unable to get statement.');
        });
    }

    function getFilterInfo() {
        var filterInfo = {};
        filterInfo.draw = '1';
        filterInfo.columns = createFilterInfoColumns();
        filterInfo.order = [{ column: parseInt($('#orderBy').val()), dir: $('#orderDir').val() }];
        filterInfo.start = 0;
        filterInfo.length = TABLE_DISPLAY_LENGTH;
        filterInfo.search = { value: $('#quickSearch').val(), regex: false };

        return filterInfo;
    }

    function createFilterInfoColumns() {
        var config = curentPage;
        var cols = [];
        for (var i = 0; i < config.GridFields.length; i++) {
            var gridColumn = config.GridFields[i];

            var column = {};
            column.data = gridColumn.ColumnName;
            column.name = gridColumn.ColumnName;
            column.orderable = true;
            column.searchable = gridColumn.Searchable == 'True' ? true : false;
            column.search = { value: $('#' + gridColumn.ColumnName + 'Filter').val(), regex: false };
            
            //TODO: Add searchtype attribute when the field property is set to equals/null

            cols.push(column);
        }

        return cols;
    }

	</script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div id="my-carousel">
        <ul class="carousel">
            <li class="carousel">
                <h2>Query Helper</h2>
                <div class="catalog">
                    <table cellpadding="0" cellspacing="0" border="0" class="display" id="pages">
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
                <h2 id="currentPage">Query Helper</h2>
                <div id="querytabs">
                    <ul id="querytabs-nav">
                        <li><a href="#querytabs-0">Select</a></li>
                        <li><a href="#querytabs-1">Insert</a></li>
                        <li><a href="#querytabs-2">Update</a></li>
                        <li><a href="#querytabs-3">Delete</a></li>
                    </ul>
                    <div id="querytabs-0" querytype="select">
                        <table cellspacing="0" cellpadding="3">
                            <tr>
                                <td>
                                    <label style="float:left;">Search Type : </label>
                                </td>
                                <td>
                                    <select style="width:100px;" id="searchType"><option value="OR">OR</option><option value="AND">AND</option></select>
                                </td>
                                <td>
                                    <label style="float:left;">Server Side : </label>
                                </td>
                                <td>
                                    <input type="checkbox" name="serverSide" id="serverSide" class="ui-widget-content ui-corner-all" />
                                </td>
                                <td>
                                    <button id="updateFilter" onclick="return false;" title="Update Filter Info">Update Filter</button>
                                </td>
                            </tr>
                        </table>
                        <br />
                        <pre class="query" id="selectStatement"><code class="language-sql"></code></pre>
                        <!-- <textarea id="selectStatement" rows="20" cols="20" class="query"></textarea> -->
                    </div>                    
                    <div id="querytabs-1" querytype="insert">
                        <pre class="query" id="insertStatement"><code class="language-sql"></code></pre>
                    </div>
                    <div id="querytabs-2" querytype="update">
                        <pre class="query" id="updateStatement"><code class="language-sql"></code></pre>
                    </div>
                    <div id="querytabs-3" querytype="delete">
                        <pre class="query" id="deleteStatement"><code class="language-sql"></code></pre>
                    </div>
                </div>
            </li>
        </ul>
    </div>

    <div id="entity_dialog" title="Entity Values" style="display: none;" class="modal-form">
        <p class="validateTips ui-corner-all"></p>
        <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
        <tbody>
        </tbody>
        </table>
    </div>

    <div id="filter_dialog" title="Filter Values" style="display: none;" class="modal-form">
        <!-- <div id="page_filter"></div> -->
        <table width="100%" cellspacing="0" cellpadding="0" class="table-style">
        <tbody>
            <tr>
                <td style="width:248px;">Quick Search:</td>
                <td><input type="text" name="quickSearch" id="quickSearch" class="text ui-widget-content ui-corner-all"></td>
            </tr>
            <tr>
                <td>Order By:</td>
                <td><select id="orderBy"></select></td>
            </tr>
            <tr>
                <td>Order Dir:</td>
                <td><select id="orderDir"><option value="asc">asc</option><option value="desc">desc</option></select></td>
            </tr>
        </tbody>
        </table>
        <hr />
        <table id="filter_table" width="100%" cellspacing="0" cellpadding="0" class="table-style">
        <tbody>
        </tbody>
        </table>
    </div>

</asp:Content>
