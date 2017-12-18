const PAGE_NAME = 'Page';
const TABLE_SEL = '#' + PAGE_NAME + '_table';
const DIALOG_SEL = '#' + PAGE_NAME + '_dialog';
const DIALOG_TAB_CONTAINER_WIDTH = 988;
const FIELDS_MARGIN_BORDER = 6;
const FIELDS_ICONS_WIDTH = 88;

const TAB_PAGE_NAME = 'PageTab';
const TAB_TABLE_SEL = '#' + TAB_PAGE_NAME + '_table';
const TAB_DIALOG_SEL = '#' + TAB_PAGE_NAME + '_dialog';

const FIELD_PAGE_NAME = 'PageField';
const FIELD_TABLE_SEL = '#' + FIELD_PAGE_NAME + '_table';
const FIELD_DIALOG_SEL = '#' + FIELD_PAGE_NAME + '_dialog';

const FIELD_DB_PAGE_NAME = 'PageDBFields';
const FIELD_DB_TABLE_SEL = '#' + FIELD_DB_PAGE_NAME + '_table';

const COLUMN_PAGE_NAME = 'PageGridColumn';
const COLUMN_TABLE_SEL = '#' + COLUMN_PAGE_NAME + '_table';
const COLUMN_DIALOG_SEL = '#' + COLUMN_PAGE_NAME + '_dialog';

const FILTER_PAGE_NAME = 'PageFilter';
const FILTER_FIELD_PAGE_NAME = 'PageFilterField';

var PAGE_CONFIG = {};

function initDialogTabsBtns() {
    $('#tabscrollleft').button({ icons: { primary: 'ui-icon-triangle-1-w' }, text: false }).click(function () {
        var _scroll = $('#tabsection').scrollLeft() - 380;
        $('#tabsection').animate({ scrollLeft: _scroll }, 900);
    });

    $('#tabscrollright').button({ icons: { primary: 'ui-icon-triangle-1-e' }, text: false }).click(function () {
        var _scroll = $('#tabsection').scrollLeft() + 380;
        $('#tabsection').animate({ scrollLeft: _scroll }, 900);
    });
}

function attachEventHandlers() {
    attachedGeneralEventHandlers();
    attachedDialogEventHandlers();
    attachedGridEventHandlers();
    attachedFilterEventHandlers();
    attachedFieldListEventHandlers();
}

function attachedGeneralEventHandlers() {
    $('#configtabs').tabs({ activate: configTabsActivate });
    $('#addPageTab').button({ icons: { primary: 'ui-icon-plus', secondary: 'ui-icon-newwin' }, text: false }).click(addTab);
    $('#addPageField').button({ icons: { primary: 'ui-icon-plus', secondary: 'ui-icon-field' }, text: false }).click(addField);
    $('#addPageFieldFromDB').button({ icons: { primary: 'ui-icon-plus', secondary: 'ui-icon-db' }, text: false }).click(addFieldFromDB);
    $('#previewPage').button({ icons: { primary: 'ui-icon-play' }, text: false }).click(previewPage);
    $('#savePage').button({ icons: { primary: 'ui-icon-disk' }, text: false }).click(savePage);
    $('#cancelPage').button({ icons: { primary: 'ui-icon-close' }, text: false }).click(cancelPage);
    $('#editFilter').button({ icons: { primary: 'ui-icon-pencil' }, text: false }).click(editFilter);
    $('#searchFields').on('input', searchFields);
}

function attachedDialogEventHandlers() {
    $('#tabs').on('tabchange', tabChange);

    $('#tabs').delegate('.ui-tabs-nav span.ui-icon-close', 'click', deleteTab);
    $('#tabs').delegate('.ui-tabs-nav span.ui-icon-pencil', 'click', editTab);

    $('#tabs').delegate('.ui-tabs-panel li.field span.ui-icon-close', 'click', deleteField);
    $('#tabs').delegate('.ui-tabs-panel li.field span.ui-icon-pencil', 'click', editField);
    $('#tabs').delegate('.ui-tabs-panel li.field span.ui-icon-plus', 'click', addFieldToGrid);

    $('#tabs').find('.ui-tabs-nav').sortable({ axis: 'x', stop: function () { $('#tabs').tabs('refresh'); } });
}

function attachedGridEventHandlers() {
    $('#configtabs-3').delegate('li.column span.ui-icon-close', 'click', deleteColumn);
    $('#configtabs-3').delegate('li.column span.ui-icon-pencil', 'click', editColumn);
    $('#configtabs-3').delegate('li.column span.ui-icon-plus', 'click', addColumnToFilter);
}

function attachedFilterEventHandlers() {
    $('#configtabs-4').delegate('li.filter-field span.ui-icon-close', 'click', deleteColumnFromFilter);
}

function attachedFieldListEventHandlers() {
    $('#pagefield_list_dialog').delegate('span.ui-icon-plus', 'click', _addFieldFromDB);
}

function addTab() {
    $(TAB_DIALOG_SEL).dialog('open');
    $('#TabName').focus();
}

function addField() {
    clearDialog(FIELD_DIALOG_SEL);
    $(FIELD_DIALOG_SEL).dialog('open');
    $(FIELD_DIALOG_SEL + ' ul.ui-tabs-nav #DetailsTab a').click();
    $('#FieldName').focus();
    clearPropsViews();
}

function addFieldFromDB() {
    reloadPageFieldDBList();
    $('#pagefield_list_dialog').dialog('open');
}

function savePage() {
    if (!validatePage()) return;

    var page = getSavePageObject();
    var msg = showMessage('Please wait...', { title: 'Saving page' });
    $.when(_savePage(page)).done(function (json) {
        savePageDone(page, json);
    }).fail(savePageFail).always(function () {
        hideMessage(msg);
    });
}

function savePageDone(page, json) {
    if (json.ErrorMsg == SUCCESS) {
        showSuccess($('#validateTips'), 'Page configuration succesfully saved.', true);
        page.PageId = json.Id;
        reloadPage(page);
    } else {
        showError($('#validateTips'), json.ErrorMsg, true);
    }
}

function savePageFail(jqXHR, textStatus, errorThrown) {
    var json = eval('(' + jqXHR.responseText + ')');
    if (json.ErrorMsg) {
        showError($('#validateTips'), json.ErrorMsg, true);
    }
}

function _savePage(page) {
    return $.ajax({
        type: 'POST',
        url: AJAX_CONTROLER_URL + '/PageInfo/SavePage',
        data: 'entity=' + encodeURIComponent($.toJSON(page))
    });
}

function getSavePageObject() {
    updatePageConfigObject();
    var page = clone(PAGE_CONFIG);
    setPageTabsFlagsBeforeSaving(page)
    deleteHelperObjects(page);

    return page;
}

function setPageTabsFlagsBeforeSaving(page) {
    var pageTabs = page.Tabs;
    for (var i = 0; i < pageTabs.length; i++) {
        var pageTab = pageTabs[i];
        updateTabFieldsOrder(pageTab);
        setPageFieldsFlagsBeforeSaving(page, pageTab);

        if (parseFloat(pageTab.TabId) < 0) pageTab.TabId = '';
        if (pageTab.OperationType == OPERATION_TYPES.DELETE) pageTab.UpdatedDate = '1';
        delete pageTab._fields;
    }
}

function setPageFieldsFlagsBeforeSaving(page, pageTab) {
    for (var f = 0; f < pageTab.Fields.length; f++) {
        var field = pageTab.Fields[f];
        if (page._gridFields[field.FieldId]) {
            field.ColumnInfo = page._gridFields[field.FieldId];

            if (parseFloat(field.ColumnInfo.ColumnId) < 0) field.ColumnInfo.ColumnId = '';
            if (parseFloat(field.ColumnInfo.FieldId) < 0) field.ColumnInfo.FieldId = '';
        }

        if (parseFloat(field.FieldId) < 0) field.FieldId = '';
        if (pageTab.OperationType == OPERATION_TYPES.DELETE || field.OperationType == OPERATION_TYPES.DELETE) field.UpdatedDate = '1';
    }
}

function updatePageConfigObject() {
    updateObjectFromDialog(PAGE_CONFIG, DIALOG_SEL);
    updateObjectFromDialog(PAGE_CONFIG.Filter, '#filter_dialog');
    updateTabsOrder();
    updateGridFieldsOrder();
    updateFilterFieldsOrder();
}

function deleteHelperObjects(page) {
    delete page._tabs;
    delete page._gridFields;
    delete page.GridFields;

    if (page.Filter.Fields.length <= 0) {
        delete page.Filter;
    } else {
        delete page.Filter._fields;
    }
}

function validatePage() {
    var tips = $('#validateTips').text('').removeClass('ui-state-highlight').removeClass('ui-state-error');
    var dialog = $(DIALOG_SEL);
    var opts = $(TABLE_SEL).Catalog('getCatalogOptions');
    if (!validateDialog(opts.pageConfig, $('#validateTips'), dialog)) return false;

    var results = _searchFields('ISID', true);
    if (results.length <= 0) {
        updateTips($('#validateTips'), 'You must specify a field as Id.', true);
        return false;
    }

    return true;
}

function getTransEntity(config, pageName) {
    var entity = {};
    $.each(config, function (key, value) {
        if (!$.isArray(value) && !$.isPlainObject(value)) {
            entity[key] = value;
        }
    });

    addSaveOperationAttrs(entity, pageName);

    return entity;
}

function updateObjectFromDialog(obj, selector) {
    var sel = 'input,select,textarea';
    $(sel, $(selector)).each(
        function (index) {
            var id = $(this).attr('name') || $(this).attr('id');

            if ($(this).attr('type') == 'checkbox') {
                obj[id] = $(this).is(':checked') ? '1' : '0';
            } else if ($(this).hasClass('hasDatepicker')) {
                var date = $(this).datepicker('getDate');
                obj[id] = $.datepicker.formatDate('mm/dd/yy', date);
            } else if ($(this).hasClass('combobox')) {
                obj[id] = $(this).ComboBox('value');
            } else if ($(this).hasClass('custom-combobox-input')) {
                //console.log('is a combobox input do nothing, value will be get from drop down');           
            } else if ($(this).hasClass('money') && maskMoneyScriptLoaded()) {
                obj[id] = $(this).maskMoney('unmasked')[0];
            } else {
                obj[id] = $(this).val();
            }

            obj[id] = $.trim(obj[id]);
        }
    );

    return obj;
}

function updateTabsOrder() {
    updateOrder(PAGE_CONFIG._tabs, '#tabsection ul.ui-tabs-nav li', 'TabId', 'TabOrder');
}

function updateGridFieldsOrder() {
    updateOrder(PAGE_CONFIG._gridFields, '#grid-columns li.column', 'FieldId', 'ColumnOrder');
}

function updateFilterFieldsOrder() {
    updateOrder(PAGE_CONFIG.Filter._fields, '#filter-fields li.filter-field', 'FieldId', 'FilterOrder');
}

function updateOrder(hashmap, selector, idFieldName, orderFieldName) {
    var items = $(selector);
    for (var i = 0; i < items.length; i++) {
        var id = $(items[i]).attr(idFieldName);
        var item = hashmap[id];
        item[orderFieldName] = (i + 1);
    }
}

function cancelPage() {
    $('#pagefield_list_dialog').dialog('close');
    $(TABLE_SEL).Catalog('reloadTable');
    carousel.data('carousel').moveToItem(0);
    clearDialogContent();
    removeDialogTabsEventHandlers();
}

function editFilter() {
    $('#filter_dialog').dialog('open');
}

function searchFields() {
    var _search = $('#searchFields').val().toUpperCase();
    var not = false;
    if (_search.substring(0, 1) == '!') {
        not = true;
        _search = _search.substring(1);
    }

    $('#tabs li.field').css('opacity', 1);
    var results = _searchFields(_search, not);
    $(results).css('opacity', .25);
}

function _searchFields(_search, not) {
    var results = $.grep($('#tabs li.field'), function (li, i) {
        var _data = PAGE_CONFIG._tabs[getTabId(li)]._fields[getFieldId(li)];
        var found = searchField(_search, _data);
        found = not ? !found : found;

        return found;
    });

    return results;
}

function searchField(_search, _data) {
    var found = false;

    if (_search == 'ISID') {
        found = !isTrue(_data.IsId);
    } else if (_search == 'REQUIRED') {
        found = !isTrue(_data.Required);
    } else if (_search == 'EXPORTABLE') {
        found = !isTrue(_data.Exportable);
    } else if (_search == 'INSERTABLE') {
        found = !isTrue(_data.Insertable);
    } else if (_search == 'UPDATABLE') {
        found = !isTrue(_data.Updatable);
    } else {
        found = _data.FieldName.toUpperCase().indexOf(_search) == -1 && _data.Label.toUpperCase().indexOf(_search) == -1 &&
            _data.DBFieldName.toUpperCase().indexOf(_search) == -1 && _data.Type.toUpperCase().indexOf(_search) == -1 &&
            _data.ControlType.toUpperCase().indexOf(_search) == -1 && _data.JoinInfo.toUpperCase().indexOf(_search) == -1 &&
            _data.DropDownInfo.toUpperCase().indexOf(_search) == -1 && _data.ControlProps.toUpperCase().indexOf(_search) == -1;
    }

    return found;
}

function clearDialogContent() {
    var tabItems = $('#tabsection ul li');
    for (var i = 0; i < tabItems.length; i++) {
        var tabContentId = $(tabItems[i]).remove().attr("aria-controls");
        $('#tabs #' + tabContentId).remove();
    }

    $('#tabs').tabs('refresh');
}

function tabChange() {
    if (exists('#tabsection ul')) {
        $('.tabscroll').show();
    } else {
        $('.tabscroll').hide();
    }

    if ($('#tabsection ul.ui-tabs-nav li:visible').length > 4) {
        $('#tabscrollsection').show();

        var _width = $('#tabsection ul.ui-tabs-nav li:visible').length * 184;
        $('div.tabcontainer div.scroller ul').width(_width);
    } else {
        $('#tabscrollsection').hide();

        $('div.tabcontainer div.scroller ul').width(737);
        $('#tabsection').scrollLeft(0);
    }
}

function configTabsActivate(event, ui) {
    $('.add-btns, .filter-btns').hide();

    if ('Dialog' == ui.newTab.find('a').text()) {
        $('.add-btns').show();
        $('#tabs').trigger('tabchange');
    } else if ('Filter' == ui.newTab.find('a').text()) {
        $('.filter-btns').show();
    }
}

function appendButtonsToNavBar() {
    var navButtonsHtml = createNavButtonsHtml();
    $('#configtabs-nav').append($(navButtonsHtml));
    $('.add-btns, .filter-btns').hide();
}

function createNavButtonsHtml() {
    var html = new StringBuffer();
    html.append('<li style="width:770px">');
    html.append('<table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td valign="middle" align="right">');
    html.append('<div style="width:520px; float: left;"><p class="validateTips ui-corner-all" id="validateTips" style="margin:0px 0px 0px 2px;text-align: left;"></p></div>');
    html.append('<button class="add-btns" id="addPageTab" onclick="return false;" title="Add tab">Tab</button>');
    html.append('<button class="add-btns" id="addPageField" onclick="return false;" title="Add field to current tab">Field</button>');
    html.append('<button class="add-btns" id="addPageFieldFromDB" onclick="return false;" title="Add fields from DB to current tab">Field From DB</button>');
    html.append('<button class="filter-btns" id="editFilter" onclick="return false;" title="Edit Filter">Edit Filter</button>');
    html.append('<button id="previewPage" onclick="return false;" title="Preview Page">Preview</button>');
    html.append('<button id="savePage" onclick="return false;" title="Save page configuration">Save</button>');
    html.append('<button id="cancelPage" onclick="return false;" title="Discard any changes to the page">Cancel</button>');
    html.append('</td></tr></tbody></table>');
    html.append('</li>');

    return html.toString();
}

function getEmptyPageConfig() {
    var pageConfig = {};
    pageConfig = getObject(DIALOG_SEL);
    pageConfig.Filter = getEmptyPageFilter();
    pageConfig.Tabs = [];
    pageConfig._tabs = {};
    pageConfig.GridFields = [];
    pageConfig._gridFields = {};

    return pageConfig;
}

function getEmptyPageFilter() {
    return { FilterText: 'Filter', FilterCols: 1, ShowClear: 'True', Fields: [], _fields: {}, FilterId: '', PageId: '' };
}

function createPage(config) {
    config.AppName = getAppName(config.PageAppId);
    PAGE_CONFIG = config;
    populateDialog(config, DIALOG_SEL);
    createDialogContent(config);
    createGridContent(config);
    createFilter(config);

    attachedDialogTabsEventHandlers();
    $('#tabs').tabs('option', 'active', 0);
}

function attachedDialogTabsEventHandlers() {
    $('#tabs').tabs('refresh').trigger('tabchange');
    $('ul.sortable-fields').sortable({
        cursor: 'move', handle: 'div.field_drag_handle',
        update: function (event, ui) {
            var tabid = $(ui.item).attr('tabid')
            updateTabFieldsOrder(PAGE_CONFIG._tabs[tabid]);
        }
    }).disableSelection();

    tabItemsDroppable();

    $('#grid-columns').sortable().disableSelection();
    $('#filter-fields').sortable().disableSelection();
}

function tabItemsDroppable() {
    var tabs = $('#tabs ul.ui-tabs-nav li');
    for (var i = 0; i < tabs.length; i++) {
        if ($(tabs[i]).hasClass('ui-droppable')) {
            $(tabs[i]).droppable('destroy');
        }
    }

    $('#tabs ul.ui-tabs-nav li').droppable({ accept: 'li.field', hoverClass: 'ui-state-hover', drop: moveFieldToTab });
}

function moveFieldToTab(event, ui) {
    var swapData = getSwapData(this, event, ui);
    ui.draggable.hide('slow', function () {
        $('a', $('#dialogTabNav-' + swapData.newTab.TabId)).click();
        var fieldWidth = calculateFieldWidth(swapData.width, swapData.field);
        $(this).css('width', fieldWidth);
        $(this).attr('tabid', swapData.newTab.TabId);
        $(this).find('div.nowrap').css('width', (fieldWidth - 82));
        $(this).appendTo(swapData.fieldList).show('slow');

        swapFieldTab(swapData.prevTab, swapData.newTab, swapData.field);
        refreshTabSortable();
    });
}

function getSwapData(drop, event, ui) {
    var swapData = {}
    var newTabId = getTabId(drop);
    var prevTabId = ui.draggable.attr('tabid');
    var fieldId = ui.draggable.attr('fieldid');

    swapData.fieldList = $('#dialogTab-' + newTabId + ' ul.ui-sortable');
    swapData.prevTab = PAGE_CONFIG._tabs[prevTabId];
    swapData.newTab = PAGE_CONFIG._tabs[newTabId];
    swapData.field = PAGE_CONFIG._tabs[prevTabId]._fields[fieldId];
    swapData.width = (DIALOG_TAB_CONTAINER_WIDTH / swapData.newTab.Cols) - FIELDS_MARGIN_BORDER;
    return swapData;
}

function swapFieldTab(prevTab, newTab, field) {
    var fieldId = field.FieldId;
    var index = prevTab.Fields.indexOf(prevTab._fields[fieldId]);
    prevTab.Fields.splice(index, 1);
    delete prevTab._fields[fieldId];

    field.TabId = newTab.TabId;
    newTab.Fields.push(field);
    newTab._fields[fieldId] = field;
}

function removeDialogTabsEventHandlers() {
    $('ul.sortable-fields').sortable('destroy');
    $('#grid-columns').html('').sortable('destroy');
    $('#filter-fields').html('').sortable('destroy');

    $('#grid-columns').append('<li id="grid-columns-empty">No fields have been added to the grid.</li>');
    $('#filter-fields').append('<li id="filter-fields-empty">No fields have been added to the filter.</li>');
}

function createDialogContent(config) {
    if (config == null || config.Tabs == null || typeof config.Tabs == 'undefined' || config.Tabs.length == 0) return;

    config._tabs = {};
    var pageTabs = config.Tabs;
    for (var i = 0; i < pageTabs.length; i++) {
        var pageTab = pageTabs[i];
        pageTab.OperationType = OPERATION_TYPES.SAVE;
        config._tabs[pageTab.TabId] = pageTab;
        $('#tabsection ul').append(createTab(pageTab, (i + 1)));
        $('#tabs').append(createTabContent(pageTab, (i + 1)));
    }
}

function createTab(tab, index) {
    var li = $(createTabHtml(tab, index));

    return li;
}

function createTabHtml(tab, index) {
    var html = new StringBuffer();
    html.append('<li id="dialogTabNav-').append(tab.TabId).append('" tabid=').append(tab.TabId).append('>');
    html.append('<a href="#dialogTab-').append(tab.TabId).append('">');
    html.append('<div style="width:115px;" class="nowrap" title="').append(tab.TabName).append('"><span style="white-space: nowrap">').append(tab.TabName).append('</span></div>');
    html.append('</a>');
    html.append('<span class="ui-icon ui-icon-pencil" title="Edit Tab">Edit Tab</span>');
    html.append('<span class="ui-icon ui-icon-close"  title="Delete Tab">Delete Tab</span>');
    html.append('</li>');

    return html.toString();
}

function createTabContent(tab, index) {
    var div = $('<div id="dialogTab-' + tab.TabId + '" style="height:370px;overflow: auto;" class="dialogtab"></div>');
    var ul = $('<ul class="sortable-fields"></ul>');
    div.append(ul);
    appendFields(tab, ul);

    return div;
}

function appendFields(tabConfig, ul) {
    $.page.sortList(tabConfig.Fields, { sortBy: 'FieldOrder', sortType: 'INT' });
    var width = (DIALOG_TAB_CONTAINER_WIDTH / tabConfig.Cols) - FIELDS_MARGIN_BORDER;
    tabConfig._fields = {};
    for (var f = 0; f < tabConfig.Fields.length; f++) {
        var fieldConfig = tabConfig.Fields[f];
        if (fieldConfig.OperationType && fieldConfig.OperationType == OPERATION_TYPES.DELETE) continue;
        fieldConfig.OperationType = OPERATION_TYPES.SAVE;
        tabConfig._fields[fieldConfig.FieldId] = fieldConfig;
        $(ul).append(createField(fieldConfig, width));
    }
}

function calculateFieldWidth(defaultWidth, field) {
    var width = defaultWidth;
    if (field.ControlProps) {
        var colSpan = $.page.getFieldProp(field, 'colSpan');
        if (colSpan) {
            width = (defaultWidth * parseInt(colSpan)) + ((parseInt(colSpan) - 1) * FIELDS_MARGIN_BORDER);
        }
    }

    return width;
}

function createField(field, width) {
    var li = $(createFieldHtml(field));
    var fieldWidth = calculateFieldWidth(width, field);
    li.css('width', fieldWidth);
    li.find('div.nowrap').css('width', (fieldWidth - FIELDS_ICONS_WIDTH));
    return li;
}

function createFieldHtml(field) {
    var html = new StringBuffer();
    html.append('<li id="Field-').append(field.FieldId).append('" class="ui-state-default field" fieldid="').append(field.FieldId).append('" tabid="').append(field.TabId).append('">');
    appendFieldTable(html, field);
    html.append('<div class="field_drag_handle" title="Drag field from here"><span class="ui-icon ui-icon-grip-dotted-horizontal"></span></div>');
    html.append('</li>');

    return html.toString();
}

function appendFieldTable(html, field) {
    var _label = field.Label;
    html.append('<table width="100%" cellspacing="0" cellpadding="0"><tr style="height: 28px;">');
    html.append('<td style="width: 18px;vertical-align: middle;padding-left: 2px;">').append(getImage(field)).append('</td>');
    html.append('<td><div class="nowrap" title="').append(_label).append('"><span style="white-space: nowrap">').append(_label).append('</span></div></td>');
    appendFieldBtns(html, field);
    html.append('</tr></table>');
}

function appendFieldBtns(html, field) {
    if (field.Required == 'True' || field.Required == '1') {
        html.append('<td style="width: 16px; vertical-align: middle;"><span class="ui-icon ui-icon-notice" title="Required">*</span></td>');
    }
    html.append('<td style="width: 16px; vertical-align: middle; cursor: pointer;"><span class="ui-icon ui-icon-close" title="Delete Field">Delete Field</span></td>');
    html.append('<td style="width: 16px; vertical-align: middle; cursor: pointer;"><span class="ui-icon ui-icon-pencil" title="Edit Field">Edit Field</span></td>');
    html.append('<td style="width: 16px; vertical-align: middle; cursor: pointer;"><span class="ui-icon ui-icon-plus" title="Add Field to Grid">Add Field to Grid</span></td>');
}

function createGridContent(config) {
    if (config.GridFields.length > 0) {
        $('#grid-columns').html('');
    }

    config.GridFields.sort(function (a, b) {
        var a1 = parseInt(a.ColumnOrder), b1 = parseInt(b.ColumnOrder);
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
    });

    config._gridFields = {};
    for (var i = 0; i < config.GridFields.length; i++) {
        var data = config.GridFields[i];
        config._gridFields[data.FieldId] = data;
        appendColumn(data);
    }
}

function appendColumn(data) {
    var li = createColumn(data);
    $('#grid-columns').append(li);
}

function updateColumn(newColumn) {
    var column = PAGE_CONFIG._gridFields[newColumn.FieldId];
    updateObject(column, newColumn);
}

function createColumn(data) {
    var li = $(createColumnHtml(data));

    return li;
}

function createColumnHtml(data) {
    var html = new StringBuffer();
    html.append('<li class="ui-state-default column" id="Column-').append(data.FieldId).append('" columnid="').append(data.ColumnId).append('" fieldid="').append(data.FieldId).append('">');
    html.append('<table width="100%" cellspacing="0" cellpadding="0"><tr style="height: 28px;">');
    html.append('<td><div class="nowrap" style="width:422px;" title="').append(data.ColumnLabel).append('"><span style="white-space: nowrap">').append(data.ColumnLabel).append('</span></div></td>');
    html.append('<td style="width: 16px; vertical-align: middle; cursor: pointer;"><span class="ui-icon ui-icon-plus" title="Add Column to Filter">Add Column to Filter</span></td>');
    html.append('<td style="width: 16px; vertical-align: middle; cursor: pointer;"><span class="ui-icon ui-icon-close" title="Remove Column from Grid">Remove Column from Grid</span></td>');
    html.append('<td style="width: 16px; vertical-align: middle; cursor: pointer;"><span class="ui-icon ui-icon-pencil" title="Edit Column">Edit Column</span></td>');
    html.append('</tr></table>');
    html.append('<div class="field_drag_handle" title="Drag column from here to sort"><span class="ui-icon ui-icon-grip-dotted-horizontal"></span></div>');
    html.append('</tr></table>');
    html.append('</li>');

    return html.toString();
}

function createFilter(json) {
    clearDialog('#filter_dialog');
    var dialog = $('#filter_dialog');
    $('#FilterText', dialog).val('Filter');
    $('#FilterCols', dialog).val('1');
    $('#ShowClear', dialog).prop('checked', true);

    if (!json.Filter) json.Filter = getEmptyPageFilter();

    var filter = json.Filter;
    populateDialog(filter, '#filter_dialog');

    var length = filter.Fields.length;
    $('#filter-fields').html('');

    PAGE_CONFIG.Filter._fields = {};
    for (var i = 0; i < length; i++) {
        var field = filter.Fields[i];
        var tabId = getTabId($('#Field-' + field.FieldId));
        var data = PAGE_CONFIG._tabs[tabId]._fields[field.FieldId];
        $('#filter-fields').append(createFilterField(field, data));
        PAGE_CONFIG.Filter._fields[field.FieldId] = field;
    }
}

function createFilterField(filterField, field) {
    var li = $(createFilterFieldHtml(filterField, field));
    return li;
}

function createFilterFieldHtml(filterField, field) {
    var html = new StringBuffer();
    html.append('<li class="ui-state-default filter-field" id="FilterField-').append(filterField.FieldId).append('" filterfieldid="').append(filterField.FilterFieldId).append('" fieldid="').append(field.FieldId).append('">');
    html.append('<table width="100%" cellspacing="0" cellpadding="0"><tr style="height: 28px;">');
    html.append('<td><div class="nowrap" style="width:464px;" title="').append(field.Label).append('"><span style="white-space: nowrap">').append(field.Label).append('</span></div></td>');
    html.append('<td style="width: 16px; vertical-align: middle; cursor: pointer;"><span class="ui-icon ui-icon-close" title="Delete field from filter">Delete field from filter</span></td>');
    html.append('</tr></table>');
    html.append('<div class="field_drag_handle" title="Drag filter field from here"><span class="ui-icon ui-icon-grip-dotted-horizontal"></span></div>');
    html.append('</li>');

    return html.toString();
}

function getImage(field) {
    var html = '<img class="nowrap" title="TITLE" src="../Images/IMAGE_NAME" style="opacity: 0.5;padding-right:2px;">';

    if (field.ControlType == 'selectmenu') {
        return html.replace('TITLE', 'SelectMenu').replace('IMAGE_NAME', 'select.gif');
    } else if (field.ControlType == 'dropdownlist') {
        return html.replace('TITLE', 'ComboBox').replace('IMAGE_NAME', 'list.gif');
    } else if (field.ControlType == 'checkbox') {
        return html.replace('TITLE', 'Checkbox').replace('IMAGE_NAME', 'checkbox.gif');
    } else if (field.ControlType == 'hidden') {
        return html.replace('TITLE', 'Hidden').replace('IMAGE_NAME', 'hidden.gif');
    } else if (field.ControlType == 'multiline') {
        return html.replace('TITLE', 'TextArea').replace('IMAGE_NAME', 'textarea.gif');
    }

    return html.replace('TITLE', 'TextBox').replace('IMAGE_NAME', 'text.gif');
}

function reloadPage(page) {
    $('#pagefield_list_dialog').dialog('close');
    var activeTab = $('#tabs').tabs('option', 'active');
    var entity = getObject(DIALOG_SEL);
    removeDialogTabsEventHandlers();
    clearDialogContent();
    clearDialog(DIALOG_SEL);
    $.when(getPageConfig(entity)).done(function (json) {
        if (json.ErrorMsg) {
            alert(json.ErrorMsg);
            return;
        }

        createPage(json);
        $('#tabs').tabs('option', 'active', activeTab);
    });
}

/********* Start Page Tab Related Methods ************************/

function initPageTabCatalog(config) {
    $(TAB_TABLE_SEL).Catalog({
        pageConfig: config,
        dialogSelector: TAB_DIALOG_SEL,
        showExport: false,
        source: [],
        validate: function (tips) {
            return validateDialog(config, tips);
        },
        saveEntityCallBack: saveTab
    });
}

function deleteTab() {
    if (confirm('Are you sure you want to delete this tab?') == false)
        return false;

    if (confirm('If you delete this tab, all tab fields will be deleted too, Are you really sure you want to delete the tab?') == false)
        return false;

    var tabId = getTabId(this);
    PAGE_CONFIG._tabs[tabId].OperationType = OPERATION_TYPES.DELETE;
    deleteTabFields(PAGE_CONFIG._tabs[tabId]);
    removeTabFromUI($(this).closest('li'));
}

function deleteTabFields(tab) {
    for (var i = 0; i < tab.Fields.length; i++) {
        removeFieldFromUI($('#Field-' + tab.Fields[i].FieldId));
    }
}

function removeTabFromUI(li) {
    var tabContentId = $(li).remove().find('a').attr('href');
    $(tabContentId).remove();
    $('#tabs').tabs('refresh').trigger('tabchange');
}

function editTab() {
    var tabId = getTabId(this);
    populateDialog(PAGE_CONFIG._tabs[tabId], TAB_DIALOG_SEL);
    $(TAB_DIALOG_SEL).dialog('open');
}

function saveTab() {
    var tab = getObject(TAB_DIALOG_SEL);
    if (_isNullOrEmpty(tab.TabId)) {
        tab.TabId = getUniqueId();
        tab.OperationType = OPERATION_TYPES.SAVE;
        tab.Fields = [];
        PAGE_CONFIG.Tabs.push(tab);
    } else {
        tab = updateTab(tab);
    }

    PAGE_CONFIG._tabs[tab.TabId] = tab;
    $(TAB_DIALOG_SEL).dialog('close');
    updateTabInUI(tab);
    tabItemsDroppable();
}

function refreshTabSortable() {
    $('ul.sortable-fields').sortable('destroy');
    $('ul.sortable-fields').sortable({
        cursor: 'move', handle: 'div.field_drag_handle',
        update: function (event, ui) {
            var tabid = $(ui.item).attr('tabid')
            updateTabFieldsOrder(PAGE_CONFIG._tabs[tabid]);
        }
    }).disableSelection();
}

function updateTab(newTab) {
    var tab = PAGE_CONFIG._tabs[newTab.TabId];
    tab.Cols = newTab.Cols;
    tab.TabName = newTab.TabName;
    updateTabFieldsOrder(PAGE_CONFIG._tabs[tab.TabId]);

    return tab;
}

function updateTabFieldsOrder(tab) {
    var fields = $('#dialogTab-' + tab.TabId + ' ul.sortable-fields li.field');
    for (var i = 0; i < fields.length; i++) {
        var fieldId = $(fields[i]).attr('fieldid');
        tab._fields[fieldId].FieldOrder = (i + 1);
    }
}

function updateTabInUI(tab) {
    var selector = '#dialogTabNav-' + tab.TabId;
    if (exists(selector)) {
        $(selector + ' a div span').text(tab.TabName);
        updateTabContentInUI(tab);
    } else {
        $('#tabsection ul').append(createTab(tab, (PAGE_CONFIG.Tabs.length + 1)));
        $('#tabs').append(createTabContent(tab, (PAGE_CONFIG.Tabs.length + 1)));

        $('#dialogTab-' + tab.TabId + ' ul.sortable-fields').sortable({
            cursor: 'move', handle: 'div.field_drag_handle'
        }).disableSelection();
    }

    $('#tabs').tabs('refresh').trigger('tabchange');
    if ($('#tabs').tabs('option', 'active') == false) $('#tabs').tabs('option', 'active', 0);
}

function updateTabContentInUI(tab) {
    var ul = $('#dialogTab-' + tab.TabId + ' ul.sortable-fields');
    appendFields(tab, ul.html(''));

    $(ul).sortable('refresh');
}

function getTabId(link) {
    var li = $(link).closest('li');
    return $(li).attr('tabid');
}

/********* End Page Tab Related Methods ************************/

/********* Start Page Field Related Methods ************************/

function initPageFieldCatalog(config) {
    $(FIELD_TABLE_SEL).Catalog({
        pageConfig: config,
        dialogSelector: FIELD_DIALOG_SEL,
        dialogWidth: '800px',
        showExport: false,
        source: [],
        validate: function (tips) {
            return validateDialog(config, tips);
        },
        saveEntityCallBack: saveField,
        initCompleteCallBack: pageFieldComplete
    });
}

function initPageFieldDBCatalog(config) {
    $(FIELD_DB_TABLE_SEL).Catalog({
        pageConfig: config,
        fieldId: 'Name',
        showNew: false,
        showEdit: false,
        showDelete: false,
        showExport: false,
        paginate: false,
        source: [],
        rowCallback: pageFieldDBRowCallback,
        selectRowCallBack: pageFieldDBSelectRow
    });

    initPageFieldDBDialog();
}

function initPageFieldDBDialog() {
    $('#pagefield_list_dialog').dialog({
        autoOpen: false,
        modal: false,
        width: '500',
        height: '500',
        buttons: [
            {
                id: 'add-all-fields', text: 'Add All',
                click: addAllFieldsFromDB
            },
            {
                id: 'button-close', text: 'Close',
                click: function () {
                    $(this).dialog('close');
                }
            }
        ],
        close: function () {
            clearDialog('#pagefield_list_dialog');
        }
    });
}

function pageFieldDBRowCallback(nRow, aData, iDisplayIndex) {
    jQuery('td:eq(3)', nRow).html('<span class="ui-icon ui-icon-plus" title="Add to current tab."></span>');

    return nRow;
}

function pageFieldDBSelectRow(oTable, row) {
    selectRow(oTable, row);
}

function deleteField() {
    if (confirm('Are you sure you want to delete this Field?') == false)
        return false;

    var tabId = getTabId(this);
    var fieldId = getFieldId(this);

    var field = PAGE_CONFIG._tabs[tabId]._fields[fieldId];
    if (parseFloat(field.FieldId) <= 0) {
        var index = PAGE_CONFIG._tabs[tabId].Fields.indexOf(field);
        PAGE_CONFIG._tabs[tabId].Fields.splice(index, 1);
        delete PAGE_CONFIG._tabs[tabId]._fields[fieldId];
    } else {
        PAGE_CONFIG._tabs[tabId]._fields[fieldId].OperationType = OPERATION_TYPES.DELETE;
    }

    removeFieldFromUI($(this).closest('li'));
}

function removeFieldFromUI(li) {
    //check if the field is linked to a column
    var selector = '#Column-' + getFieldId(li);
    if (exists(selector)) {
        var columnli = $(selector);
        _deleteColumn(getFieldId(columnli));
    }

    $(li).remove();
}

function editField() {
    var tabId = getTabId(this);
    var fieldId = getFieldId(this);

    populateDialog(PAGE_CONFIG._tabs[tabId]._fields[fieldId], FIELD_DIALOG_SEL);
    $(FIELD_DIALOG_SEL).dialog('open');
    $(FIELD_DIALOG_SEL + ' ul.ui-tabs-nav #DetailsTab a').click();
    clearPropsViews();
}

function saveField(oTable, options) {
    var field = getObject(FIELD_DIALOG_SEL);
    if (_isNullOrEmpty(field.FieldId)) {
        field.TabId = getActiveTabId();
        field.FieldId = getUniqueId();
        field.OperationType = OPERATION_TYPES.SAVE;
        field.FieldOrder = PAGE_CONFIG._tabs[field.TabId].Fields.length;
        PAGE_CONFIG._tabs[field.TabId].Fields.push(field);
        PAGE_CONFIG._tabs[field.TabId]._fields[field.FieldId] = field;
    } else {
        updateField(field);
    }

    updateTabContentInUI(PAGE_CONFIG._tabs[field.TabId]);
    $(FIELD_DIALOG_SEL).dialog('close');
}

function updateField(newField) {
    var field = PAGE_CONFIG._tabs[newField.TabId]._fields[newField.FieldId];
    updateObject(field, newField);
}

function getActiveTabId() {
    var activeTab = $($('#tabs').find('.ui-tabs-nav li')[$('#tabs').tabs('option', 'active')]);
    return activeTab.attr('tabid');
}

function addFieldToGrid() {
    var fieldId = getFieldId(this);
    var selector = 'li.column[fieldid=' + fieldId + ']';
    if (exists(selector)) {
        updateTips($('#validateTips'), 'Field is already in the grid.', true);
        $('#configtabs').tabs('option', 'active', 2);
        $(selector).effect('highlight');
        return;
    }

    var tabId = getTabId(this);
    var data = PAGE_CONFIG._tabs[tabId]._fields[fieldId];

    _addFieldToGrid(data);
}

function _addFieldToGrid(data) {
    clearDialog(COLUMN_DIALOG_SEL);
    var dialog = $(COLUMN_DIALOG_SEL);
    $('#ColumnName', dialog).val(data.FieldName);
    $('#ColumnLabel', dialog).val(data.Label);
    $('#FieldId', dialog).val(data.FieldId);
    $('#Width', dialog).val('0');
    $('#Visible', dialog).prop('checked', true);
    $('#Searchable', dialog).prop('checked', true);

    var opts = $(COLUMN_TABLE_SEL).Catalog('getCatalogOptions');
    if (!validateDialog(opts.pageConfig, $('#validateTips'), dialog)) return;

    saveColumn();
    showSuccess($('#validateTips'), 'Field succesfully added to grid.', true);
}

function addAllFieldsFromDB() {
    if (!$(FIELD_DB_TABLE_SEL).DataTable().ajax.json()) return;

    var list = $(FIELD_DB_TABLE_SEL).DataTable().ajax.json().aaData;
    for (var i = 0; i < list.length; i++) {
        addDBFieldToCurrentTab(list[i]);
    }
}

function _addFieldFromDB(event) {
    var tr = $(this).closest('tr')[0];
    var fieldName = $(tr).attr('id');
    var data = $(FIELD_DB_TABLE_SEL).DataTable().rows('#' + fieldName).data()[0];

    addDBFieldToCurrentTab(data);
}

function addDBFieldToCurrentTab(data) {
    clearDialog(FIELD_DIALOG_SEL);
    var dialog = $(FIELD_DIALOG_SEL);
    $('#FieldName', dialog).val(data.Name);
    $('#DBFieldName', dialog).val(data.Name);
    $('#Label', dialog).val(data.Name);
    $('#Type', dialog).val(data.Type.toLowerCase());
    $('#ControlType', dialog).val('inputbox');
    if (data.Type == 'bit') $('#ControlType', dialog).val('checkbox');
    $('#Required', dialog).prop('checked', data.Required == 'NO');
    $('#Exportable', dialog).prop('checked', true);
    $('#Insertable', dialog).prop('checked', true);
    $('#Updatable', dialog).prop('checked', true);

    var opts = $(FIELD_TABLE_SEL).Catalog('getCatalogOptions');
    if (!validateDialog(opts.pageConfig, $('#field_list_dialog p.validateTips'), dialog)) return;

    saveField();
}

function getFieldId(link) {
    var li = $(link).closest('li');
    return $(li).attr('fieldid');
}

/********* End Page Field Related Methods ************************/

function initPageColumnCatalog(config) {
    $(COLUMN_TABLE_SEL).Catalog({
        pageConfig: config,
        dialogSelector: COLUMN_DIALOG_SEL,
        showExport: false,
        source: [],
        validate: function (tips) {
            return validateDialog(config, tips);
        },
        saveEntityCallBack: saveColumn
    });
}

function deleteColumn() {
    if (confirm('Are you sure you want to removed this column from the grid?') == false)
        return false;

    _deleteColumn(getFieldId(this));
}

function _deleteColumn(fieldId) {
    var index = PAGE_CONFIG.GridFields.indexOf(PAGE_CONFIG._gridFields[fieldId]);
    PAGE_CONFIG.GridFields.splice(index, 1);
    delete PAGE_CONFIG._gridFields[fieldId]

    removeColumnFromUI($('#Column-' + fieldId));
}

function removeColumnFromUI(li) {
    var fieldId = getFieldId(li);
    if (PAGE_CONFIG.Filter._fields[fieldId]) {
        _deleteColumnFromFilter($('#FilterField-' + fieldId));
    }

    $(li).remove();
}

function editColumn() {
    var fieldId = getFieldId(this);
    populateDialog(PAGE_CONFIG._gridFields[fieldId], COLUMN_DIALOG_SEL);
    $(COLUMN_DIALOG_SEL).dialog('open');
}

function addColumnToFilter() {
    var fieldId = getFieldId(this);
    if (!validateBeforeAddColumnToFilter(fieldId)) return;

    var tabId = getTabId($('#Field-' + fieldId));
    var field = PAGE_CONFIG._tabs[tabId]._fields[fieldId];
    _addColumnToFilter(field);
}

function validateBeforeAddColumnToFilter(fieldId) {
    if (parseFloat(fieldId) < 0) {
        updateTips($('#validateTips'), 'The page MUST be save first, in order to add this column to the filter.', true);
        return false;
    }

    var selector = 'li.filter-field[fieldid=' + fieldId + ']';
    if (PAGE_CONFIG.Filter._fields[fieldId]) {
        updateTips($('#validateTips'), 'Field is already in the filter.', true);
        $('#configtabs').tabs('option', 'active', 3);
        $(selector).effect('highlight');
        return false;
    }

    return true;
}

function _addColumnToFilter(field) {
    if (exists('#filter-fields-empty')) $('#filter-fields').html('');
    var filterField = { FieldId: field.FieldId, FilterFieldId: getUniqueId() };
    filterField.FilterOrder = PAGE_CONFIG.Filter.Fields.length;

    PAGE_CONFIG.Filter._fields[field.FieldId] = filterField;
    PAGE_CONFIG.Filter.Fields.push(filterField);
    $('#filter-fields').append(createFilterField(filterField, field));

    showSuccess($('#validateTips'), 'Field succesfully added to filter.', true);
}

function deleteColumnFromFilter() {
    if (confirm('Are you sure you want to removed this field from the fielter?') == false)
        return false;

    var li = $(this).closest('li');
    _deleteColumnFromFilter(li);
}

function _deleteColumnFromFilter(li) {
    var fieldId = getFieldId(li);
    li.remove();

    var index = PAGE_CONFIG.Filter.Fields.indexOf(PAGE_CONFIG.Filter._fields[fieldId]);
    PAGE_CONFIG.Filter.Fields.splice(index, 1);
    delete PAGE_CONFIG.Filter._fields[fieldId];
}

function saveColumn(oTable, options) {
    if (exists('#grid-columns-empty')) $('#grid-columns').html('');

    var column = getObject(COLUMN_DIALOG_SEL);
    if (_isNullOrEmpty(column.ColumnId)) {
        column.ColumnId = getUniqueId();
        column.OperationType = OPERATION_TYPES.SAVE;
        column.ColumnOrder = PAGE_CONFIG.GridFields.length;
        PAGE_CONFIG.GridFields.push(column);
        PAGE_CONFIG._gridFields[column.FieldId] = column;
        appendColumn(column);
    } else {
        updateColumn(column);
        $('#Column-' + column.FieldId + ' div.nowrap span').text(column.Label);
    }

    $(COLUMN_DIALOG_SEL).dialog('close');
}

function getColumnId(link) {
    var li = $(link).closest('li');
    return $(li).attr('columnid');
}


function initFilterDialog() {
    $('#filter_dialog').dialog({
        autoOpen: false,
        modal: true,
        width: '400',
        buttons: [
            {
                id: 'button-save', text: 'Save',
                click: function () {
                    $(this).dialog('close');
                }
            }
        ],
        close: function () { }
    });
}

function updateObject(obj, newObj) {
    $.each(newObj, function (key, value) {
        obj[key] = value;
    });
}

function getUniqueId() {
    var id = new Date().getTime();
    return '' + (-1 * id);
}

/************** Start Properties Related Methods ******************************/

const DEFAULT_PROPS_PAGE_CONFIG = '{"Name": "Properties","Title":"Properties", "GridFields": [{"ColumnName": "PropKey","ColumnLabel": "Property","ColumnOrder": "1","Visible": "True","Searchable": "True","Width": "0"}, {"ColumnName": "PropValue","ColumnLabel": "Value","ColumnOrder": "2","Visible": "True","Searchable": "True","Width": "0"}],"Tabs": [{"TabName": "Property","TabOrder": "1","Cols": "1","Fields": [{"FieldId": "99999","FieldName": "PropKey","Label": "Property","Type": "varchar","Required": "True","DropDownInfo": "","FieldOrder": "1","ControlType": "dropdownlist","IsId": "True","JoinInfo": "","ControlProps": ""}, {"FieldId": "99998","FieldName": "PropValue","Label": "Value","Type": "nvarchar","Required": "True","DropDownInfo": "","FieldOrder": "2","ControlType": "inputbox","IsId": "False","JoinInfo": "","ControlProps": ""}]}],"Filter": null}';

function createPropsViews() {
    createDropDownInfoPropsView();
    createJoinInfoPropsView();
    createControlPropsView();
}

function createDropDownInfoPropsView() {
    var propsTab = getTabContentElement('Drop Down Info', $(FIELD_DIALOG_SEL));
    var pageConfig = getDropDownInfoConfig();
    appendTogglePropsBtn(pageConfig, propsTab);
    appendPropsTableToDialog(pageConfig, propsTab);
}

function createJoinInfoPropsView() {
    var propsTab = getTabContentElement('Join Info', $(FIELD_DIALOG_SEL));
    var pageConfig = getJoinInfoConfig();
    appendTogglePropsBtn(pageConfig, propsTab);
    appendPropsTableToDialog(pageConfig, propsTab);
}

function createControlPropsView() {
    var propsTab = getTabContentElement('Properties', $(FIELD_DIALOG_SEL));
    var pageConfig = getControlPropsConfig();
    appendTogglePropsBtn(pageConfig, propsTab);
    appendPropsTableToDialog(pageConfig, propsTab);
}

function getDropDownInfoConfig() {
    var pageConfig = $.evalJSON(DEFAULT_PROPS_PAGE_CONFIG);
    pageConfig.Tabs[0].Fields[0].DropDownInfo = '{"url":"AjaxController.ashx/PageInfo/GetPageEntityList?pageName=PageListItem&entity={\\"FieldName\\":\\"DropDownProperty\\"}","valField":"Text","textField":"Text","removedInvalid":false,"cache":true}';
    pageConfig.Name = 'DropDownInfo';
    pageConfig.Title = 'Drop Down Info Property';
    setDefaultProps(pageConfig);

    return pageConfig;
}

function getJoinInfoConfig() {
    var pageConfig = $.evalJSON(DEFAULT_PROPS_PAGE_CONFIG);
    pageConfig.Tabs[0].Fields[0].DropDownInfo = '{"url":"AjaxController.ashx/PageInfo/GetPageEntityList?pageName=PageListItem&entity={\\"FieldName\\":\\"JoinInfoProperty\\"}","valField":"Text","textField":"Text","removedInvalid":false,"cache":true}';
    pageConfig.Name = 'JoinInfo';
    pageConfig.Title = 'Join Info Property';
    setDefaultProps(pageConfig);

    return pageConfig;
}

function getControlPropsConfig() {
    var pageConfig = $.evalJSON(DEFAULT_PROPS_PAGE_CONFIG);
    pageConfig.Tabs[0].Fields[0].DropDownInfo = '{"url":"AjaxController.ashx/PageInfo/GetPageEntityList?pageName=PageListItem&entity={\\"FieldName\\":\\"ControlProps\\"}","valField":"Text","textField":"Text","removedInvalid":false,"cache":true}';
    pageConfig.Name = 'ControlProps';
    pageConfig.Title = 'Control Props Property';
    setDefaultProps(pageConfig);

    return pageConfig;
}

function setDefaultProps(pageConfig) {
    pageConfig.ToggleButton = pageConfig.Name + 'togglePropsView';
    pageConfig.PropsJsonRow = pageConfig.Name + 'propsJsonRow';
    pageConfig.PropsTableRow = pageConfig.Name + 'propsTableRow';
    pageConfig.PROPS_TABLE_SEL = '#' + pageConfig.Name + '_table';
    pageConfig.PROPS_DIALOG_SEL = '#' + pageConfig.Name + '_dialog';
    pageConfig.PROPS_JSON_TEXTAREA = '#' + pageConfig.Name;
}

function appendTogglePropsBtn(pageConfig, propsTab) {
    var btn = $('<button id="' + pageConfig.ToggleButton + '"title="Show table format" style="float:right; margin-bottom:5px;">Table</button>');
    $('table td:first', propsTab).append(btn);
    btn.button().click(function () { togglePropsView(this, pageConfig) });

    return btn;
}

function appendPropsTableToDialog(pageConfig, propsTab) {
    var propsRow = $('table tbody tr:last', propsTab);
    $(propsRow).attr('id', pageConfig.PropsJsonRow);
    $('table tbody', propsTab).append('<tr id="' + pageConfig.PropsTableRow + '" class="columns-1" style="display:none;"><td width="100%"></td></tr>');
    $('#props_tables_container').append('<div id="' + pageConfig.Name + 'table_container"></div>')
    createPropsPage(pageConfig);
}

function initPropsCatalog(config) {
    $(config.PROPS_TABLE_SEL).Catalog({
        pageConfig: config,
        source: [],
        displayLength: 7,
        deleteEntityCallBack: function () { deleteProp(config) },
        saveEntityCallBack: function () { saveProp(config) }
    });
}

function deleteProp(pageConfig) {
    $(pageConfig.PROPS_TABLE_SEL).DataTable().rows('.row_selected').remove().draw();
    $(pageConfig.PROPS_JSON_TEXTAREA).val(tableToJson(pageConfig));
}

function saveProp(pageConfig) {
    var entity = getObject(pageConfig.PROPS_DIALOG_SEL);
    $(pageConfig.PROPS_TABLE_SEL).DataTable().row.add(entity).draw();
    $(pageConfig.PROPS_DIALOG_SEL).dialog('close');

    $(pageConfig.PROPS_JSON_TEXTAREA).val(tableToJson(pageConfig));
    $(pageConfig.PROPS_TABLE_SEL).DataTable().clear().rows.add(jsonToTable(pageConfig)).draw();
}

function togglePropsView(btn, pageConfig) {
    $(btn).button('option', 'label', $(btn).text() == 'Table' ? 'Json' : 'Table');
    $('#' + pageConfig.PropsTableRow).toggle();
    $('#' + pageConfig.PropsJsonRow).toggle();

    if ($(btn).text() == 'Json') {
        $(pageConfig.PROPS_TABLE_SEL).DataTable().clear().rows.add(jsonToTable(pageConfig)).draw();
    }
}

function tableToJson(pageConfig) {
    var obj = {};
    var rows = $(pageConfig.PROPS_TABLE_SEL).DataTable().rows().data();
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        obj[row.PropKey] = row.PropValue;
    }

    if ($.isEmptyObject(obj)) return '';
    return $.toJSON(obj);
}

function jsonToTable(pageConfig) {
    var rows = [];
    if ($.trim($(pageConfig.PROPS_JSON_TEXTAREA).val()) != '') {
        var obj = jQuery.parseJSON($.trim($(pageConfig.PROPS_JSON_TEXTAREA).val()));
        if (!$.isEmptyObject(obj)) {
            $.each(obj, function (key, value) {
                var row = { 'PropKey': key, 'PropValue': value };
                rows.push(row);
            });
        }
    }

    return rows;
}

function getTabContentElement(tabName, dialog) {
    var id = $.trim(tabName.replace(/ /g, '')) + 'Tab';
    var tabContentId = $('#' + id).attr('aria-controls');
    return $('#' + tabContentId, dialog);
}

function clearPropsViews() {
    clearPropsView(getDropDownInfoConfig());
    clearPropsView(getJoinInfoConfig());
    clearPropsView(getControlPropsConfig());
}

function clearPropsView(pageConfig) {
    $('#' + pageConfig.ToggleButton).button('option', 'label', 'Json');
    $('#' + pageConfig.PropsTableRow).show();
    $('#' + pageConfig.PropsJsonRow).hide();
    $(pageConfig.PROPS_TABLE_SEL).DataTable().clear().rows.add(jsonToTable(pageConfig)).draw();
}

/************** End Properties Related Methods ******************************/