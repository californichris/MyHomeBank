<%@ Page Title="Transactions" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Transactions.aspx.cs" Inherits="MyHomeBank.Transactions" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
	<script type="text/javascript">
	    var PAGE_NAME = 'Transactions';
	    var TABLE_SEL = '#' + PAGE_NAME + '_table';
	    var FILTER_SEL = '#' + PAGE_NAME + '_filter';

	    var RANGE = {};
	    RANGE['This Fortnight'] = { FromDay: 1, FromMonth: 0, ToDay: 15, ToMonth: 0 };
	    RANGE['Next Fortnight'] = { FromDay: 1, FromMonth: 1, ToDay: 15, ToMonth: 1 };
	    RANGE['Last Fortnight'] = { FromDay: 1, FromMonth: -1, ToDay: 15, ToMonth: -1 };
	    RANGE['This Month'] = { FromDay: 1, FromMonth: 0, ToDay: 31, ToMonth: 0 };
	    RANGE['Next Month'] = { FromDay: 1, FromMonth: 1, ToDay: 31, ToMonth: 1 };
	    RANGE['Last Month'] = { FromDay: 1, FromMonth: -1, ToDay: 31, ToMonth: -1 };
	    RANGE['Last 3 Months'] = { FromDay: 1, FromMonth: -2, ToDay: 31, ToMonth: 0 };
	    RANGE['Last 6 Months'] = { FromDay: 1, FromMonth: -5, ToDay: 31, ToMonth: 0 };
	    RANGE['January'] = { FromDay: 1, FromMonth: 0, ToDay: 31, ToMonth: 0 };
	    RANGE['February'] = { FromDay: 1, FromMonth: 1, ToDay: 31, ToMonth: 1 };
	    RANGE['March'] = { FromDay: 1, FromMonth: 2, ToDay: 31, ToMonth: 2 };
	    RANGE['April'] = { FromDay: 1, FromMonth: 3, ToDay: 31, ToMonth: 3 };
	    RANGE['May'] = { FromDay: 1, FromMonth: 4, ToDay: 31, ToMonth: 4 };
	    RANGE['June'] = { FromDay: 1, FromMonth: 5, ToDay: 31, ToMonth: 5 };
	    RANGE['July'] = { FromDay: 1, FromMonth: 6, ToDay: 31, ToMonth: 6 };
	    RANGE['August'] = { FromDay: 1, FromMonth: 7, ToDay: 31, ToMonth: 7 };
	    RANGE['September'] = { FromDay: 1, FromMonth: 8, ToDay: 31, ToMonth: 8 };
	    RANGE['October'] = { FromDay: 1, FromMonth: 9, ToDay: 31, ToMonth: 9 };
	    RANGE['November'] = { FromDay: 1, FromMonth: 10, ToDay: 31, ToMonth: 10 };
	    RANGE['December'] = { FromDay: 1, FromMonth: 11, ToDay: 31, ToMonth: 11 };

	    const DEFAULT_RANGE = 'This Fortnight';
	    const DEFAULT_ACC = 'Wells Fargo Checking'; //only use one const use DEFAULT_ACCOUNT in site master

	    $(document).ready(function () {
	        $('div.catalog').Page({
	            source: AJAX + '/PageInfo/GetPageConfig?pageName=' + PAGE_NAME,
	            dialogStyle: 'table',
	            onBeforeCreateFilter: beforeCreateFilter,
	            onLoadComplete: loadComplete
	        });
	    });

	    function beforeCreateFilter(config) {	        
	        updateFieldControlType(config, 'CategoryFilter');
	        updateFieldControlType(config, 'PaymentFilter');

	        var field = updateFieldControlType(config, 'ValidatedFilter');
	        if (field) {
	            field.FieldName = 'Range';
	            field.Label = 'Range';
	            field.DropDownInfo = '{"url":"AjaxController.ashx/PageInfo/GetPageEntityList?pageName=PageListItem&entity={FieldName:\\"RangeType\\"}","valField":"ItemId","textField":"Text","sortBy":"Value","sortType":"INT","selectedText":"'+DEFAULT_RANGE+'","cache":true,"addEmptyOption":false}';
	        }

	        setFromDate($.page.filter.getFilterField(config, 'TransDateFromFilter'));
	        setToDate($.page.filter.getFilterField(config, 'TransDateToFilter'));
	    }

	    function loadComplete(config) {
	        $('h2').text(config.Title);
	        if (config.Filter != null) $('div.catalog').before('<br/>')
	        document.title = config.Title;
	        initCatalog(config);

	        $('#clearFilter').off('click').click(clearFilter);
	        $('#Range').selectmenu({ change: rangeChange });
	    }

	    function clearFilter() {
	        $('#CategoryFilter,#PaymentFilter').val('').selectmenu('refresh');

	        $('#Range').val(getSelectmenuId('#Range', DEFAULT_RANGE)).selectmenu('refresh');
	        $('#TransDateFromFilter').val(getFromDate());
	        $('#TransDateToFilter').val(getToDate());
	        $('#AccountNameFilter').val(getAcctId(DEFAULT_ACC)).selectmenu('refresh');

	        $(FILTER_SEL).Filter('refresh');
	    }

	    function rangeChange() {	        
	        var selectedRange = $('#Range option[value=' + $('#Range').val() + ']').text();
	        var range = calculateRange(selectedRange);

	        $('#TransDateFromFilter').val(range.From.toString('MM/dd/yyyy'));
	        $('#TransDateToFilter').val(range.To.toString('MM/dd/yyyy'));

	        $(FILTER_SEL).Filter('refresh');
	    }

	    function calculateRange(selectedRange) {
	        var range = RANGE[selectedRange] ? RANGE[selectedRange] : RANGE[DEFAULT_RANGE];
	        var from = getFortnightFrom(), to = getFortnightTo();
	        if (selectedRange == 'Next Fortnight') {
	            from.getDate() == 1 ? from.set({ day: 16 }) : from.addMonths(1).set({ day: 1 });
	            to.getDate() == 15 ? to.moveToLastDayOfMonth() : to.addMonths(1).set({ day: 15 });
	        } else if (selectedRange == 'Last Fortnight') {
	            from.getDate() == 1 ? from.addMonths(-1).set({ day: 16 }) : from.set({ day: 1 });
	            to.getDate() == 15 ? to.addMonths(-1).moveToLastDayOfMonth() : to.set({ day: 15 });
	        } else if (selectedRange.indexOf('Month') != -1) {
	            from = Date.today().set({ day: range.FromDay }).addMonths(range.FromMonth);
	            to = Date.today().addMonths(range.ToMonth);
	            range.ToDay == 31 ? to.moveToLastDayOfMonth() : to.set({ day: range.ToDay });
	        } else {
	            from = Date.today().set({ day: range.FromDay, month: range.FromMonth });
	            to = Date.today().set({ month: range.ToMonth });
	            range.ToDay == 31 ? to.moveToLastDayOfMonth() : to.set({ day: range.ToDay });
	        }

	        return {From : from, To : to};
	    }

	    function initCatalog(config) {
	        var transDateIndex = getArrayIndexForKey(config.GridFields, 'ColumnName', 'TransDate');
	        var amountIndex = getArrayIndexForKey(config.GridFields, 'ColumnName', 'Amount');
	        var validatedIndex = getArrayIndexForKey(config.GridFields, 'ColumnName', 'Validated');

	        $(TABLE_SEL).Catalog({
	            pageConfig: config, showExport: true, serverSide: true,
	            dialogWidth: 700, paginate: false, scrollY: '500px',
	            sorting: [[transDateIndex, 'asc']],
	            rowCallback: function (nRow, aData, iDisplayIndex) {
	                if(aData.Amount < 0) {	            	        		
	                    jQuery('td:eq(' + amountIndex + ')', nRow).html('<font color="red">' + aData.Amount + '</font>').addClass('expense');
	                } else {
	                    jQuery('td:eq(' + amountIndex + ')', nRow).html('<font color="green">' + aData.Amount + '</font>').addClass('income');;
	                }
        	
	                if (isTrue(aData.Validated)) {
	                    jQuery('td:eq(' + validatedIndex + ')', nRow).html('<span class="ui-icon ui-icon-check"></span>');
	                } else {
	                    jQuery('td:eq(' + validatedIndex + ')', nRow).html('');
	                }	            	        
        	
	                return nRow;	
	            },
	            initCompleteCallBack: initComplete
	        });
	    }

	    function initComplete(oTable, oSettings, json, options) {
	        appendButtons(oTable, oSettings, json, options);
	        $(TABLE_SEL).on('draw.dt', function (e, o) {
	            calculateTotal();
	        });

	        calculateTotal();
	    }

	    function calculateTotal() {
	        var trans = $(TABLE_SEL).DataTable().ajax.json().aaData;
	        var income = 0.0, expense = 0.0, balance = 0.0;

	        for (var i = 0; i < trans.length; i++) {
	            var tran = trans[i];
	            if (tran.Amount >= 0.0) {
	                income += parseFloat(tran.Amount);
	            } else {
	                expense += parseFloat(tran.Amount);
	            }
	        }

	        balance = income + expense;
	        $(TABLE_SEL + '_info').html($(TABLE_SEL + '_info').html() + ' (Income : ' + income + ', Expense : ' + expense + ', Balance : ' + balance + ')');
	    }

	    function appendButtons(oTable, oSettings, json, options) {
	        appendCopyButton(oTable, oSettings, json, options);
	        appendValidateButton(oTable, oSettings, json, options);
	        appendCopytoNextMonthButton(oTable, oSettings, json, options);
	        appendCopytoNextYearButton(oTable, oSettings, json, options);	        
	    }

	    function appendValidateButton(oTable, oSettings, json, options) {
	        var opts = { text: false, icons: { primary: 'ui-icon-check' } };
	        var btn = $('<button onclick="return false;" class="disable" title="Toggle validate status">Validate/Unvalidate</button>');
	        btn.button(opts).click(validateTran).button('disable');

	        $(TABLE_SEL).Catalog('getButtonSection').append(btn);
	    }

	    function validateTran() {
	        var _data = getSelectedRowData($(TABLE_SEL).DataTable());
	        _data.Validated = isTrue(_data.Validated) ? 'False' : 'True';
	        setUpdateProps(_data);

	        $(TABLE_SEL).Catalog('saveEntity', $(TABLE_SEL).DataTable(), $(TABLE_SEL).Catalog('getCatalogOptions'), _data);
	    }

	    function appendCopytoNextMonthButton(oTable, oSettings, json, options) {
	        var opts = { text: true, icons: { primary: 'ui-icon-arrowrefresh-1-e' } };
	        var btn = $('<button onclick="return false;" class="disable" title="Copy to Next Month">Copy</button>');
	        btn.button(opts).click(copyToNextMonth).button('disable');

	        $(TABLE_SEL).Catalog('getButtonSection').append(btn);
	    }

	    function copyToNextMonth() {
	        var _data = getSelectedRowData($(TABLE_SEL).DataTable());
	        _data.TransId = '';
	        var date = Date.parse(_data.TransDate);
	        var isLastDay = date.getDaysInMonth() == date.getDate();
	        date.addMonths(1);
	        if (isLastDay) date.moveToLastDayOfMonth();
	        _data.TransDate = date.toString('MM/dd/yyyy');
	        _data.Validated = 'False';
	        setUpdateProps(_data);

	        saveTransaction(_data);
	    }

	    function appendCopytoNextYearButton(oTable, oSettings, json, options) {
	        var opts = { text: true, icons: { primary: 'ui-icon-calendar' } };
	        var btn = $('<button onclick="return false;" class="disable" title="Copy to Next Year">Copy</button>');
	        btn.button(opts).click(copyToNextYear).button('disable');

	        $(TABLE_SEL).Catalog('getButtonSection').append(btn);
	    }

	    function copyToNextYear() {
	        var _data = getSelectedRowData($(TABLE_SEL).DataTable());
	        _data.TransId = '';
	        _data.TransDate = Date.parse(_data.TransDate).addYears(1).toString('MM/dd/yyyy');
	        _data.Validated = 'False';
	        setUpdateProps(_data);

	        saveTransaction(_data);
	    }

	    function appendCopyButton(oTable, oSettings, json, options) {
	        var opts = { text: true, icons: { primary: 'ui-icon-copy' } };
	        var btn = $('<button onclick="return false;" class="disable" title="Copy">Copy</button>');
	        btn.button(opts).click(copyTran).button('disable');

	        $(TABLE_SEL).Catalog('getButtonSection').append(btn);
	    }

	    function copyTran() {
	        var _data = getSelectedRowData($(TABLE_SEL).DataTable());
	        _data.TransId = '';
	        _data.Validated = 'False';
	        setUpdateProps(_data);

	        $(TABLE_SEL).Catalog('editEntity', $(TABLE_SEL).DataTable(), $(TABLE_SEL).Catalog('getCatalogOptions'), _data);
	        var _dialog = $(TABLE_SEL).Catalog('getDialog');
	        _dialog.dialog('option', 'title', _dialog.attr('originalTitle') + ' [New]').dialog('open');
	    }

	    function saveTransaction(entity) {
	        var options = $(TABLE_SEL).Catalog('getCatalogOptions');
	        $.ajax({
	            type: 'POST',
	            url: options.saveRequest,
	            data: 'entity=' + encodeURIComponent($.toJSON(entity))
	        }).done(handleResponse);
	    }

	    function handleResponse(json) {
	        if (json && json.ErrorMsg && json.ErrorMsg != SUCCESS) {
	            alert(json.ErrorMsg);
	        }
	        $(FILTER_SEL).Filter('refresh');
	    }
        
	    function setUpdateProps(data) {
	        data.UpdatedDate = 'GETDATE()';
	        data.UpdatedBy = LOGIN_NAME;
	    }

	    function setFromDate(field) {
	        updateFieldValueProp(field, getFromDate());
	    }

	    function setToDate(field) {	        
	        updateFieldValueProp(field, getToDate());
	    }

	    function getFortnightFrom() {
	        var d = Date.today();
	        return d.getDate() <= 15 ? d.moveToFirstDayOfMonth() : d.set({ day: 15 });
	    }

	    function getFortnightTo() {
	        var d = Date.today();
	        return d.getDate() <= 15 ? d.set({ day: 15 }) : d.moveToLastDayOfMonth();
	    }

	    function getFromDate() {
	        return getFortnightFrom().toString('MM/dd/yyyy');
	    }

	    function getToDate() {
	        return getFortnightTo().toString('MM/dd/yyyy');
	    }

	    function updateFieldValueProp(field, value) {
	        if (!field) return;
	        var props = $.trim(field.ControlProps) ? $.evalJSON(field.ControlProps) : {};
	        props.value = value;
	        field.ControlProps = $.toJSON(props);
	    }

	    function updateFieldControlType(config, fieldName) {
	        var field = $.page.filter.getFilterField(config, fieldName);
	        if (field) field.ControlType = 'selectmenu';

	        return field;
	    }

	    function getAcctId(_text) {
	        var _items = $('#AccountNameFilter').selectmenu('getData');

	        for (var i = 0; i < _items.length; i++) {
	            var item = _items[i];
	            if (item.Name == _text) {
	                return item.AccountId;
	            }
	        }

	        return '';
	    }

	</script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2></h2>
    <div class="catalog"></div>
</asp:Content>
