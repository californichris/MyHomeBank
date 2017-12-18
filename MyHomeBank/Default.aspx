<%@ Page Title="My Home Bank" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="MyHomeBank._Default" %>
<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
	<script type="text/javascript">
	    var loading = null;
	    $(document).ready(function () {
	        loading = createLoading();

	        $.when(getPageConfig('Summary'), getPageConfig('MonthlySummary')).done(function (json1, json2) {
	            $('#monthlyBalance').Page({
	                source: json2[0],
	                createPageDialog: false,
	                onLoadComplete: function (config) {
	                    getMonthlySummaryBalance(config, Date.today().toString('yyyy'), DEFAULT_ACCOUNT);
	                }
	            });

	            $('#summary').Page({
	                source: json1[0],
	                createPageDialog: false,
	                onLoadComplete: function (config) {
	                    getSummaryData(config);
	                }
	            });
	        });

	        

	    });

	    function getPageConfig(pageName) {
	        var _url = AJAX + '/PageInfo/GetPageConfig?pageName=' + pageName;
	        return $.ajax({ url: _url });
	    }

	    function getSummaryData(config) {
	        var future = {};
	        future.GroupByFields = 'AccountId,AccountName';
	        future.Functions = [];
	        future.Functions.push({ Function: 'SUM', FieldName: 'Amount' });

	        var todayEnt = {};
	        todayEnt.Validated = '1';
	        todayEnt.IsClosed = 'N';

	        var bankEnt = {};
	        bankEnt.TransDate = '01/01/1970_RANGE_' + Date.today().toString('MM/dd/yyyy') + ' 23:59:59';
	        bankEnt.IsClosed = 'N';

	        var futureEnt = {};
	        futureEnt.IsClosed = 'N';

	        $.when(getAggreateData(future, todayEnt), getAggreateData(future, bankEnt), getAggreateData(future, futureEnt)).done(function (json1, json2, json3) {
	            var _data = mergeArrays(json1[0], json2[0], json3[0]);

	            var accounts = json3[0].aaData;
	            for (var i = 0; i < accounts.length; i++) {
	                var account = accounts[i];
	                var option = $('<option value="' + account.AccountId + '">' + account.AccountName + '</option>');
	                if (DEFAULT_ACCOUNT == parseInt(account.AccountId)) $(option).attr('selected', true);
	                $('#summaryAccount').append(option);
	                $('#summaryAccount').selectmenu('refresh');
	            }

	            $('#Summary_table').Catalog({
	                pageConfig: config,
	                paginate: false,
	                //scrollY: '250px',
	                showNew: false,
	                showEdit: false,
                    showDelete: false,
                    source: _data,
                    initCompleteCallBack: function (oTable, oSettings, json, options) {
	                    loading.remove();
	                    $('#summary,#summaryMonthly').show();
	                }
	            });


	        });
	    }

	    function getMonthlySummaryBalance(config, year, account) {
	        var entity = {};
	        entity.TransYear = year;
	        entity.AccountId = account;
	        var _url = AJAX + '/PageInfo/GetPageEntityList?pageName=MonthlySummary&searchType=AND&entity=' + $.toJSON(entity);
	        
	        var aggregate = {};
	        aggregate.GroupByFields = 'AccountId,AccountName';
	        aggregate.Functions = [];
	        aggregate.Functions.push({ Function: 'SUM', FieldName: 'Amount' });

	        var aggrEnt = {};
	        aggrEnt.TransDate = '01/01/1970_RANGE_' + Date.parse('12/31/' + (parseInt(year) - 1)).toString('MM/dd/yyyy') + ' 23:59:59';
	        aggrEnt.AccountId = account;

	        $.when($.ajax({ url: _url }), getAggreateData(aggregate, aggrEnt)).done(function (json1, json2) {
	            var _data = json1[0].aaData;
	            var _initialBalance = 0.0;

	            if (json2[1] == 'success' && json2[0].aaData && json2[0].aaData.length > 0) {
	                _initialBalance = parseFloat(json2[0].aaData[0].Aggregate).toFixed(2);
	            }

	            var initialIndex = getArrayIndexForKey(config.GridFields, 'ColumnName', 'InitialBalance');
	            var endIndex = getArrayIndexForKey(config.GridFields, 'ColumnName', 'EndBalance');

	            $('#MonthlySummary_table').attr('initialBalance', _initialBalance);

	            $('#MonthlySummary_table').Catalog({
	                pageConfig: config,
	                paginate: false,
	                showNew: false,
	                showEdit: false,
	                showDelete: false,
	                source: _data,
	                ordering: false,
	                initCompleteCallBack: function (oTable, oSettings, json, options) {
	                    appendButtons(oTable, oSettings, json, options);
	                },
	                rowCallback: function (nRow, aData, iDisplayIndex) {
	                    var initialBalance = $('#MonthlySummary_table').attr('initialBalance');
	                    jQuery('td:eq(' + initialIndex + ')', nRow).html(initialBalance);
	                    jQuery('td:eq(' + endIndex + ')', nRow).html(parseFloat(parseFloat(initialBalance) + parseFloat(aData.MonthlyBalance)).toFixed(2));

	                    initialBalance = parseFloat(parseFloat(initialBalance) + parseFloat(aData.MonthlyBalance)).toFixed(2);
	                    $('#MonthlySummary_table').attr('initialBalance', initialBalance);
	                    return nRow;
	                }
	            });
	        });
	    }

	    function mergeArrays(array1, array2, array3) {
	        var merge = array3.aaData;

	        for (var i = 0; i < merge.length; i++) {
	            var item = merge[i];
	            item.Today = getArrayValue(array1.aaData, 'Aggregate', 'AccountId', item.AccountId);
	            item.Bank = getArrayValue(array2.aaData, 'Aggregate', 'AccountId', item.AccountId);
	            item.Future = item.Aggregate;
	        }

	        return merge;
	    }

	    function getArrayValue(array, fieldName, key, value) {
	        for (var i = 0; i < array.length; i++) {
	            var item = array[i];
	            if (item[key] == value) {
	                return item[fieldName];
	            }
	        }
	    }

	    function getAggreateData(aggregate, entity) {
	        var _url = AJAX + '/PageInfo/GetAggreateEntities?pageName=Transactions&searchType=AND&aggregateInfo=' + $.toJSON(aggregate);
	        if (!_isNullOrEmpty(entity) && !$.isEmptyObject(entity)) {
	            _url += '&entity=' + $.toJSON(entity)
	        }

	        return $.ajax({ url: _url });
	    }

	    function appendButtons(oTable, oSettings, json, options) {
	        var summaryAccount = $('<select id="summaryAccount" name="summaryAccount" class="ui-corner-all" style="width:180px;"></select>');
	        $('#MonthlySummary_table').Catalog('getButtonSection').append(summaryAccount);
	        summaryAccount.selectmenu({ change: function () { realodMonthlySummary(); } });

	        var summaryYear = $('<select id="summaryYear" name="summaryYear" class="ui-corner-all" style="width:100px;"></select>');
	        var year = parseInt(Date.today().toString('yyyy'));
	        var startYear = 2013;

	        for (var i = startYear; i <= year; i++) {
	            var option = $('<option value="' + i + '">' + i + '</option>');
	            if (year == i) $(option).attr('selected', true);
	            $(summaryYear).append(option);
	        }

	        $('#MonthlySummary_table').Catalog('getButtonSection').append(summaryYear);
	        summaryYear.selectmenu({ change: function () { realodMonthlySummary(); }});
	    }

	    function realodMonthlySummary() {
	        log('reload');

	        var year = parseInt($('#summaryYear').val());
	        var account = parseInt($('#summaryAccount').val());

	        var entity = {};
	        entity.TransYear = year;
	        entity.AccountId = account;
	        var _url = AJAX + '/PageInfo/GetPageEntityList?pageName=MonthlySummary&searchType=AND&entity=' + $.toJSON(entity);

	        var aggregate = {};
	        aggregate.GroupByFields = 'AccountId,AccountName';
	        aggregate.Functions = [];
	        aggregate.Functions.push({ Function: 'SUM', FieldName: 'Amount' });

	        var aggrEnt = {};
	        aggrEnt.TransDate = '01/01/1970_RANGE_' + Date.parse('12/31/' + (parseInt(year) - 1)).toString('MM/dd/yyyy') + ' 23:59:59';
	        aggrEnt.AccountId = account;

	        $.when($.ajax({ url: _url }), getAggreateData(aggregate, aggrEnt)).done(function (json1, json2) {
	            var _data = json1[0].aaData;
	            var initialBalance = 0.0;

	            if (json2[1] == 'success' && json2[0].aaData && json2[0].aaData.length > 0) {
	                initialBalance = parseFloat(json2[0].aaData[0].Aggregate).toFixed(2);
	            }

	            $('#MonthlySummary_table').attr('initialBalance', initialBalance);
	            $('#MonthlySummary_table').Catalog('clearTable');
	            $('#MonthlySummary_table').Catalog('addDataToTable', _data);	            
	        });

	    }

	    function createLoading() {
	        var loading = $('<div id="loading" style="height:500px;">Loading, please wait...</div>');
	        $('h2').after(loading);

	        var target = document.getElementById('loading');
	        var spinner = new Spinner(spinOpts).spin(target);

	        return loading;
	    }
    </script>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <h2>Welcome to My Home Bank</h2><br />
    <div id="summary" style="display:none;"></div><br />
    <div id="monthlyBalance" style="display:none;"></div>
</asp:Content>
