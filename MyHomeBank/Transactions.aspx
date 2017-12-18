<%@ Page Title="Transactions" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Transactions.aspx.cs" Inherits="MyHomeBank.Transactions" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
	<script type="text/javascript">
	    var PAGE_NAME = 'Transactions';
	    var TABLE_SEL = '#' + PAGE_NAME + '_table';

	    $(document).ready(function () {

	        $('div.catalog').Page({
	            source: AJAX + '/PageInfo/GetPageConfig?pageName=' + PAGE_NAME,
	            dialogStyle: 'table',
	            onBeforeCreateFilter: function (config) {
	                var length = config.Filter.Fields.length;
	                var toFound = 2;
	                var found = 0;
	                for (var i = 0; (i < length && found < toFound); i++) {
	                    var field = config.Filter.Fields[i].FieldData;
	                    if (field.FieldName == 'TransDateFromFilter') {
	                        var props = $.trim(field.ControlProps);
	                        if (props == '') {
	                            props = {};
	                        } else {
	                            props = $.evalJSON(props);
	                        }
	                        props.value = Date.today().moveToFirstDayOfMonth().toString('MM/dd/yyyy');

	                        field.ControlProps = $.toJSON(props);
	                        found++;
	                    } else if (field.FieldName == 'TransDateToFilter') {
	                        var props = $.trim(field.ControlProps);
	                        if (props == '') {
	                            props = {};
	                        } else {
	                            props = $.evalJSON(props);
	                        }
	                        props.value = Date.today().moveToLastDayOfMonth().toString('MM/dd/yyyy');

	                        field.ControlProps = $.toJSON(props);
	                        found++;
	                    }
	                }
	            },
	            onLoadComplete: function (config) {
	                $('h2').text(config.Title);
	                if (config.Filter != null) $('div.catalog').before('<br/>')
	                document.title = config.Title;
	                initializeCatalog(config);
	            }
	        });
	    });

	    function initializeCatalog(config) {
	        var transDateIndex = getArrayIndexForKey(config.GridFields, 'ColumnName', 'TransDate');
	        var amountIndex = getArrayIndexForKey(config.GridFields, 'ColumnName', 'Amount');
	        var validatedIndex = getArrayIndexForKey(config.GridFields, 'ColumnName', 'Validated');

	        $(TABLE_SEL).Catalog({
	            pageConfig: config,
	            showExport: true,
	            serverSide: true,
	            dialogWidth: 700,
	            paginate: false,
	            scrollY: '500px',
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
	            initCompleteCallBack: function (oTable, oSettings, json, options) {
	                appendButtons(oTable, oSettings, json, options);
	                $(TABLE_SEL).on('draw.dt', function (e, o) {
	                    calculateTotal();
	                });

	                calculateTotal();
	            }
	        });
	    }

	    function calculateTotal() {
	        var trans = $(TABLE_SEL).DataTable().ajax.json().aaData;
	        var income = 0.0;
	        var expense = 0.0;
	        var balance = 0.0;

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

	        btn.button(opts).click(function (event) {
	            var _data = getSelectedRowData(oTable);
	            _data.UpdatedDate = 'GETDATE()';
	            _data.UpdatedBy = LOGIN_NAME;
	            _data.Validated = isTrue(_data.Validated) ? 'False' : 'True';

	            $(TABLE_SEL).Catalog('saveEntity', oTable, options, _data);
	        }).button('disable');

	        $(TABLE_SEL).Catalog('getButtonSection').append(btn);
	    }

	    function appendCopytoNextMonthButton(oTable, oSettings, json, options) {
	        var opts = { text: true, icons: { primary: 'ui-icon-arrowrefresh-1-e' } };
	        var btn = $('<button onclick="return false;" class="disable" title="Copy to Next Month">Copy</button>');

	        btn.button(opts).click(function (event) {
	            var _data = getSelectedRowData(oTable);
	            _data.TransId = '';
	            _data.TransDate = Date.parse(_data.TransDate).addMonths(1).toString('MM/dd/yyyy');
	            _data.UpdatedDate = 'GETDATE()';
	            _data.UpdatedBy = LOGIN_NAME;
	            _data.Validated = 'False';

	            $.ajax({
	                type: 'POST',
	                url: options.saveRequest,
	                data: 'entity=' + encodeURIComponent($.toJSON(_data))
	            }).done(function (json) {
	                if (json.ErrorMsg == SUCCESS) {
	                    //do nothing
	                } else {
	                    alert(json.ErrorMsg);
	                }
	            });
	        }).button('disable');

	        $(TABLE_SEL).Catalog('getButtonSection').append(btn);
	    }

	    function appendCopytoNextYearButton(oTable, oSettings, json, options) {
	        var opts = { text: true, icons: { primary: 'ui-icon-calendar' } };
	        var btn = $('<button onclick="return false;" class="disable" title="Copy to Next Year">Copy</button>');

	        btn.button(opts).click(function (event) {
	            var _data = getSelectedRowData(oTable);
	            _data.TransId = '';
	            _data.TransDate = Date.parse(_data.TransDate).addYears(1).toString('MM/dd/yyyy');
	            _data.UpdatedDate = 'GETDATE()';
	            _data.UpdatedBy = LOGIN_NAME;
	            _data.Validated = 'False';
	            log(_data);

	            $.ajax({
	                type: 'POST',
	                url: options.saveRequest,
	                data: 'entity=' + encodeURIComponent($.toJSON(_data))
	            }).done(function (json) {
	                if (json.ErrorMsg == SUCCESS) {
                        //do nothing
	                } else {
	                    alert(json.ErrorMsg);
	                }
	            });
	        }).button('disable');

	        $(TABLE_SEL).Catalog('getButtonSection').append(btn);
	    }

	    function appendCopyButton(oTable, oSettings, json, options) {
	        var opts = { text: true, icons: { primary: 'ui-icon-copy' } };

	        var btn = $('<button onclick="return false;" class="disable" title="Copy">Copy</button>');
	        btn.button(opts).click(function (event) {
	            var _data = getSelectedRowData(oTable);
	            _data.TransId = '';
	            _data.UpdatedDate = 'GETDATE()';
	            _data.UpdatedBy = LOGIN_NAME;
	            _data.Validated = 'False';
	           
	            var _dialog = $(TABLE_SEL).Catalog('getDialog');
	            clearDialog('#' + _dialog.attr('id'));
	            populateDialog(_data, '#' + _dialog.attr('id'));

	            _dialog.dialog('option', 'title', _dialog.attr('originalTitle') + ' [New]').dialog('open');
	            $('#dialogtabs', _dialog).tabs('option', 'active', 0);
	            $('input:visible:first', $($('div.ui-tabs-panel', _dialog)[0])).focus();
	        }).button('disable');

	        $(TABLE_SEL).Catalog('getButtonSection').append(btn);
	    }

	</script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2></h2>
    <div class="catalog"></div>
</asp:Content>
