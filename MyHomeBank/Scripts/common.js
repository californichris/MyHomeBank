/**
* @required    jquery-1.9.1.js or higher
* @description EPE Common functions 
* @version     1.0
* @file        common.js
* @author      Christian Beltran
* @contact     christian.beltran@epelectric.com
*
* @copyright Copyright 2013, all rights reserved.
*
*/
const SUCCESS = 'Success';
var TABLE_DISPLAY_LENGTH = 18;
const SESSION_EXPIRED = 'Session expired.';
const DEFAULT_VALUE = 'defaultVal';
const FILTER_DEFAULT_VALUE = 'filterDefaultVal';
var MASK_MONEY_DEFAULT_OPTS = { prefix: '$', allowNegative: true, allowZero: true };
const POST_TYPE_PARAMS = ['entity', 'aggregateInfo'];

const OPERATION_TYPES = {
    SAVE: 'Save',
    DELETE: 'Delete',
    UPDATE: 'Update',
    DELETE_ENTITIES: 'DeleteEntities'
}

$.ajaxSetup({
    dataType: 'json'
});

// Generic asynchronous cache
$.createCache = function (requestFunction) {
    var cache = {};
    return function (key, callback) {
        if (!cache[key]) {
            //key not in cache, adding a promise of the new created deferred object to the cache.
            cache[key] = $.Deferred(function (defer) {
                //calling the requested function and passing the defer object so it can be resolved.
                requestFunction(defer, key);
            }).promise();
        }
        //returning cache value and adding callback function if any, to be called when the defferred object is resolved.
        return cache[key].done(callback);
    };
};

//method used to ensure that the same ajax request is not being made multiple times.
$.getData = $.createCache(function (defer, url) {
    //creating the ajax request
    $.ajax({
        url: url
    }).done(function (json) {
        defer.resolve(json);
    }).fail(defer.reject);
});

/*
 * spin default options
 */
var spinOpts = {
    lines: 13, // The number of lines to draw
    length: 50, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#CCC', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

/*
 * Logs the given message to the console if present if not sends an alert(IE)
 *
 * @param {String|msg} the given message.
 */
function log(msg) {
    if(typeof console != 'undefined') {
        console.log(msg);
    } else {
        alert(msg);
    }
}

function addOperationAttrs(entity, pageName, operationtype) {
    entity.PageName = pageName;
    entity.OperationType = operationtype;

    return entity;
}

function addSaveOperationAttrs(entity, pageName) {
    return addOperationAttrs(entity, pageName, OPERATION_TYPES.SAVE);
}

function addDeleteOperationAttrs(entity, pageName) {
    return addOperationAttrs(entity, pageName, OPERATION_TYPES.DELETE);
}

function addDeleteEntitiesOperationAttrs(entity, pageName) {
    return addOperationAttrs(entity, pageName, OPERATION_TYPES.DELETE_ENTITIES);
}


function addUpdateOperationAttrs(entity, pageName) {
    return addOperationAttrs(entity, pageName, OPERATION_TYPES.UPDATE);
}

/**
 * Prevents form for being submitted
 */
function preventSubmitting() {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false; // <= IE10 
    }
}

function getGridColsIndexes(config) {
    var colNames = $.map(config.GridFields, function (col) { return col.ColumnName; }).join(',');
    return _getGridColsIndexes(colNames, config);
}

function _getGridColsIndexes(colNames, config) {
    var gridIndexes = {};
    var columnNames = colNames.split(',');
    for (var i = 0; i < columnNames.length; i++) {
        gridIndexes[columnNames[i]] = getArrayIndexForKey(config.GridFields, 'ColumnName', columnNames[i]);
    }

    return gridIndexes;
}

function getArrayIndexForKey(arr, key, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == val)
            return i;
    }
    return -1;
}

function getToday() {
    return Date.today().toString('MM/dd/yyyy');
}

function clone(obj) {
    return $.evalJSON($.toJSON(obj));
}

function startsWith(text, str) {
    return text.substring(0, str.length) === str;
}

function endsWith(text, str) {
    return text.substring(text.length - str.length, text.length) === str;
}

/**
 * @deprecated please used $.page.initSelectMenu instead
 */
function initSelectMenu(selector) {
    $.page.initSelectMenu(selector);
}

/**
 * @deprecated please used $.page.createSelectMenuOptions instead
 */
function createSelectMenuOptions(json, ddInfo) {
    $.page.createSelectMenuOptions($('#' + ddInfo.fieldName), json, ddInfo);
}

/**
 * @deprecated please used $.page.filter.createFilter instead
 */
function createFilter() {
    return $.page.filter.createFilter($('.filter-form'));
}

/**
 * @deprecated please used $.page.filter.setDateRangeFilterVal instead
 */
function setDateRangeFilterVal(filter, ele) {
    $.page.filter.setDateRangeFilterVal(filter, ele);
}

/**
 * filterByDate
 */
function filterByDate(aData, colIndex, dateFrom, dateTo) {
    if (dateFrom == '' && dateTo == '') return true;

    // parse the range from a single field into min and max, remove " - "
    dateMin = dateFrom.substring(6, 10) + dateFrom.substring(0, 2) + dateFrom.substring(3, 5);
    dateMax = dateTo.substring(6, 10) + dateTo.substring(0, 2) + dateTo.substring(3, 5);

    // 2 here is the column where my dates are.
    var date = aData[colIndex];
    date = date.substring(6, 10) + date.substring(0, 2) + date.substring(3, 5);

    // run through cases
    if (dateMin == "" && date <= dateMax) {
        return true;
    }
    else if (dateMin == "" && date <= dateMax) {
        return true;
    }
    else if (dateMin <= date && "" == dateMax) {
        return true;
    }
    else if (dateMin <= date && date <= dateMax) {
        return true;
    }
    // all failed
    return false;
}
  
/**
 * Returns a string representing the current date and time
 * with the specified date and time format respectively.
 *
 * @param {String|df} the date format
 * @param {String|tf} the time format
 * @return {String} current date time
 */
function getCurrentDateTime(df, tf) {
    var dateformat = ((df == null) || (typeof df == 'undefined')) ? 'm/dd/yy' : df;
    var timeformat = ((tf == null) || (typeof tf == 'undefined')) ? 'h:mm:ss TT' : tf;

    var d = new Date();
    var date = $.datepicker.formatDate(dateformat, d);
    var time = $.datepicker.formatTime(timeformat, { hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds() }, {});

    return date + ' ' + time; 
}

/**
 * Determines if the value of the DOM element si is null or empty using the
 * given selector.
 *
 * @param {String|selector} the given selector.
 */
function isNullOrEmpty(selector) {
    return _isNullOrEmpty($(selector).val());
}

/**
 * Determines if the given value is null or empty.
 *
 * @param {String|value} the given value.
 */
function _isNullOrEmpty(value) {
    return value == null || value == '';
}

/**
 * Returns a string representing the current date and time
 * with the specified date and time format respectively.
 *
 * @param {String|df} the date format
 * @param {String|tf} the time format
 * @return {String} current date time
 */
function getParam(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);

    return null;
}

/**
 * Determines if a DOM element exists using the given selector.
 *
 * @param {String|selector} the given selector.
 */
function exists(selector) {
    if ($(selector).size() > 0) {
        return true;
    }
    return false;
}

function updateTips(tips, msg, removed) {
    tips.text(msg).addClass("ui-state-highlight");
    setTimeout(function () {
        tips.removeClass("ui-state-highlight");
        if (typeof removed != 'undefined' && removed != null && removed == true) {
            tips.text('');
        }
    }, 1500);
}

function showSuccess(tips, msg, removed) {
    tips.text(msg).addClass("ui-state-success");
    setTimeout(function () {
        tips.removeClass("ui-state-success");
        if (typeof removed != 'undefined' && removed != null && removed == true) {
            tips.text('');
        }
    }, 1500);
}

function showError(tips, msg, removed) {
    tips.text(msg).addClass("ui-state-error");
    setTimeout(function () {
        tips.removeClass("ui-state-error");
        if (typeof removed != 'undefined' && removed != null && removed == true) {
            tips.text('');
        }
    }, 1500);
}

function showMessage(msg, options) {
    if (exists('#common_message_box')) $('#common_message_box').remove();
    var opts = $.extend({
        modal: true, closeOnEscape: false, open: function (event, ui) {
            $('.ui-dialog-titlebar-close', $('#common_message_box').parent()).hide();
        }
    }, options);
    return $('<div id="common_message_box">').html(msg).dialog(opts);
}

function hideMessage(_dialog) {
    _dialog.dialog('close').dialog('destroy');;
}

function isAlpha(value) {
    return !/[~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test(value);//Alpha no special characters
}

function checkAlpha(tips, field, fieldDesc) {
    if (checkEmpty(field)) return true;

    var valid = isAlpha(field.val()); //Alpha no special characters
    if (!valid) {
        field.addClass("ui-state-error");
        tips.text(fieldDesc + " must be alphanumeric.").addClass("ui-state-highlight");
        field.on('blur.validation', function () {
            if (checkAlpha(tips, field, fieldDesc)) {
                tips.text("").removeClass("ui-state-highlight");
                field.removeClass("ui-state-error");
                field.off('.validation');
            }
        });

        return false;
    } else {
        return true;
    }
}

function checkRequired(tips, field, fieldDesc) {
    field.removeClass("ui-state-error").off('.validation');
    field.val($.trim(field.val()));
    if (_isNullOrEmpty(field.val())) {
        field.addClass("ui-state-error");
        tips.text(fieldDesc + " is required.").addClass("ui-state-highlight");
        field.on('blur.validation', function () {
            if (checkRequired(tips, field, fieldDesc)) {
                tips.text("").removeClass("ui-state-highlight");
                field.removeClass("ui-state-error");
                field.off('.validation');
            }
        });

        return false;
    } else {
        return true;
    }
}

function checkEmpty(field) {
    field.removeClass("ui-state-error").off('.validation');
    field.val($.trim(field.val()));
    return field.val() == '';
}

function checkDate(tips, field, fieldDesc) {    
    if (checkEmpty(field)) return true;

    var date = null;
    if (field.hasClass('hasDatepicker')) {
        date = $.datepicker.formatDate($(field).datepicker('option', 'dateFormat'), $(field).datepicker("getDate"));
        if (date != field.val()) {
            date = new Date(field.val()).toString();
        }
    } else {
        date = new Date(field.val()).toString();
    }

    var valid = !/Invalid|NaN/.test(date);
    if (!valid) {
        field.addClass("ui-state-error");
        tips.text(fieldDesc + " must be a valid date.").addClass("ui-state-highlight");
        field.on('blur.validation', function () {
            if (checkDate(tips, field, fieldDesc)) {
                tips.text("").removeClass("ui-state-highlight");
                field.removeClass("ui-state-error");
                field.off('.validation');
            }
        });

        return false;
    } else {
        return true;
    }
}

/*
 * validates if the specified value is a valid date
 *
 * @param {string,date} the date to be validated
 * @return {boolean} true if valid false otherwise  
 */
function validateDate(date) {
    var d = new Date(date).toString();
    return !/Invalid|NaN/.test(date);
}

function checkISODate(tips, field, fieldDesc) {
    if (checkEmpty(field)) return true;

    var valid = /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(field.val()); //ISODate
    if (!valid) {
        field.addClass("ui-state-error");
        tips.text(fieldDesc + " must be a valid date.").addClass("ui-state-highlight");
        field.on('blur.validation', function () {
            if (checkDate(tips, field, fieldDesc)) {
                tips.text("").removeClass("ui-state-highlight");
                field.removeClass("ui-state-error");
                field.off('.validation');
            }
        });

        return false;
    } else {
        return true;
    }
}

function checkLength(tips, field, fieldDesc, min, max) {
    if (checkEmpty(field)) return true;

    if (field.val().length > max || field.val().length < min) {
        field.addClass("ui-state-error");
        updateTips(tips, "Length of " + fieldDesc + " must be between " + min + " and " + max + ".");
        return false;
    } else {
        return true;
    }
}

function isFloat(val) {
    return val != '' && /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val);
}

function checkFloat(tips, field, fieldDesc, min, max) {
    if (checkEmpty(field)) return true;

    var value = field.val();
    if ($(field).hasClass('money') && maskMoneyScriptLoaded()) {
        value = $(field).maskMoney('unmasked')[0];
    };

    var valid = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
    var desc = fieldDesc + " must be a decimal number.";
    if (valid) {
        if ((typeof min != undefined && typeof max != undefined) && (parseFloat(value) < min || parseFloat(value) > max)) {
            desc = fieldDesc + " must be a decimal number between " + min.toFixed(2) + " and " + max.toFixed(2) + ".";
        } else {
            return true;
        }
    } 
        
    field.addClass("ui-state-error");
    tips.text(desc).addClass("ui-state-highlight");
    field.on('blur.validation', function () {
        if (checkFloat(tips, field, fieldDesc, min, max)) {
            tips.text("").removeClass("ui-state-highlight");
            field.removeClass("ui-state-error");
            field.off('.validation');
        }
    });

    return false;    
}

function checkInt(tips, field, fieldDesc, min, max) {
    if (checkEmpty(field)) return true;

    var valid = /^\d+$/.test(field.val());
    var desc = fieldDesc + " must be a number.";
    if (valid) {
        if ((typeof min != undefined && typeof max != undefined) && (parseInt(field.val()) < min || parseInt(field.val()) > max)) {
            desc = fieldDesc + " must be a number between " + min + " and " + max + ".";
        } else {
            return true;
        }
    }

    field.addClass("ui-state-error");
    tips.text(desc).addClass("ui-state-highlight");
    field.on('blur.validation', function () {
        if (checkInt(tips, field, fieldDesc, min, max)) {
            tips.text("").removeClass("ui-state-highlight");
            field.removeClass("ui-state-error");
            field.off('.validation');
        }
    });

    return false;
}

function checkMinMax(tips, minField, maxField, desc) {
    if (checkEmpty(minField) && checkEmpty(maxField)) return true;

    var minVal = parseFloat(minField.val());
    var maxVal = parseFloat(maxField.val());

    if (minVal >= maxVal) {
        minField.addClass("ui-state-error");
        maxField.addClass("ui-state-error");
        tips.text(desc).addClass("ui-state-highlight");
        minField.on('blur.validation', function () {
            if (checkMinMax(tips, minField, maxField, desc)) {
                tips.text("").removeClass("ui-state-highlight");
            }
        });

        maxField.on('blur.validation', function () {
            if (checkMinMax(tips, minField, maxField, desc)) {
                tips.text("").removeClass("ui-state-highlight");
            }
        });

        return false;
    }

    return true;
}

function checkValid(tips, field, fieldDesc, values) {
    field.val($.trim(field.val()));
    if (field.val() == '') return true;

    var valid = jQuery.inArray(field.val(), values) == -1;
    if (valid) {
        field.addClass("ui-state-error");
        updateTips(tips, fieldDesc + " must be a value in (" + values.join(',') + ")");
        return false;
    }

    return true;
}

function checkEmail(tips, field, fieldDesc) {
    field.removeClass("ui-state-error").off('.validation');
    field.val($.trim(field.val()));

    var valid = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(field.val());
    if (!valid) {
        field.addClass("ui-state-error");
        tips.text(fieldDesc + " is invalid. [e.g. email@example.com]").addClass("ui-state-highlight");
        field.on('blur.validation', function () {
            if (checkEmail(tips, field, fieldDesc)) {
                tips.text("").removeClass("ui-state-highlight");
                field.removeClass("ui-state-error");
                field.off('.validation');
            }
        });

        return false;
    } else {
        return true;
    }
}

function checkURL(tips, field) {
    field.removeClass("ui-state-error").off('.validation');
    field.val($.trim(field.val()));
    valid = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|\\(\\[^\s\\]+)+(\\)?).*$/ig.test(field.val());

    if (!valid) {
        field.addClass("ui-state-error");
        tips.text("URL or Shared Drive Path is invalid. ").addClass("ui-state-highlight");
        field.on('blur.validation', function () {
            if (checkURL(tips, field)) {
                tips.text("").removeClass("ui-state-highlight");
                field.removeClass("ui-state-error");
                field.off('.validation');
            }
        });

        return false;
    } else {
        return true;
    }
}

/*
 * US Phone Numbers [ e.g. (xxx)xxx-xxxx ] are validated according the following rules:
 * - Area code first 3 digits start with a number from 2–9, followed by 0–8, and then any third digit.
 * - The second group of three digits, known as the central office or exchange code, starts with a number from 2–9, followed by any two digits.
 * - The final four digits, known as the station code, have no restrictions.
 */
function checkPhoneUS(tips, field, fieldDesc) {
    field.removeClass("ui-state-error").off('.validation');
    field.val($.trim(field.val()));

    var phone_number = field.val();
    phone_number = phone_number.replace(/\s+/g, "");

    var valid = phone_number.length > 9 && phone_number.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/);
    if (!valid) {
        field.addClass("ui-state-error");
        tips.text(fieldDesc + " is invalid. [e.g. (999)999-9999]").addClass("ui-state-highlight");
        field.on('blur.validation', function () {
            if (checkPhoneUS(tips, field, fieldDesc)) {
                tips.text("").removeClass("ui-state-highlight");
                field.removeClass("ui-state-error");
                field.off('.validation');
            }
        });

        return false;
    } else {
        return true;
    }
}

/*
 * International Phone Numbers [ e.g. +xxx (xxx)xxx-xxxx ] are validated according the following rules:
 * - Start with a plus "+" sign
 * - Any three digits for the country code
 * - Any three digits for the area codes.
 * - A second group of any three digits for the exchange code.
 * - The final four digits, known as the station code, have no restrictions.
*/
function checkInternationalPhone(tips, field, fieldDesc) {
    field.removeClass("ui-state-error").off('.validation');
    field.val($.trim(field.val()));

    var phone_number = field.val();
    phone_number = phone_number.replace(/\s+/g, "");

    var valid = phone_number.length > 9 && phone_number.match(/^\+\d{1,3}[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
    if (!valid) {
        field.addClass("ui-state-error");
        tips.text(fieldDesc + " is invalid. [e.g. +999 (999)999-9999]").addClass("ui-state-highlight");
        field.on('blur.validation', function () {
            if (checkPhoneUS(tips, field, fieldDesc)) {
                tips.text("").removeClass("ui-state-highlight");
                field.removeClass("ui-state-error");
                field.off('.validation');
            }
        });

        return false;
    } else {
        return true;
    }
}

function validateDialog(config, tips, dialog) {
    //TODO: add logic to highlight combobox/selectmenu fields
    var valid = true;
    tips.text("").removeClass('ui-state-highlight').removeClass('ui-state-error');
    for (var t = 0; t < config.Tabs.length && valid; t++) {
        var fields = config.Tabs[t].Fields;
        for (var f = 0; f < fields.length && valid; f++) {
            var field = fields[f];
            var element = $('#' + field.FieldName);
            if (!(typeof dialog === 'undefined') && dialog != null) {
                element = $('#' + field.FieldName, dialog);
            }
            //If is Id, hidden or checkbox don't performed any validation
            if (field.IsId == 'True' || field.ControlType == 'hidden' || field.ControlType == 'checkbox') continue;

            element.val($.trim(element.val()));

            if (field.Required == 'True') {
                valid = valid && checkRequired(tips, element, field.Label);
            }

            // The following checks are not necesary if the field is not required and the value is empty.
            if (element.val() == '') continue;

            if (field.Type == 'int' && field.ControlType == 'inputbox') {
                valid = valid && checkInt(tips, element, field.Label);
            }

            if ((field.Type == 'decimal' || field.Type == 'money') && field.ControlType == 'inputbox') {
                valid = valid && checkFloat(tips, element, field.Label);
            }

            if (field.Type.indexOf('date') != -1 && field.ControlType == 'inputbox') {
                valid = valid && checkDate(tips, element, field.Label);
            }
        }
    }

    return valid;
}

function isTrue(value) {
    if(!value) return false;

    return value == '1' || value.toLowerCase() == 'true' || value.toUpperCase() == 'YES';
}

function isFalse(value) {
    if (!value) return false;

    return value == '0' || value.toLowerCase() == 'false' || value.toUpperCase() == 'FALSE';
}

function populateDialog(data, selector) {
    var sel = 'input,select,textarea';
    $(sel, $(selector)).each(
        function (index) {  
            var id = $(this).attr('name');
            if (id == null || id == '') {
                id = $(this).attr('id');
            }

            if ($(this).attr('type') == 'checkbox' && isTrue(data[id])) {
                $(this).prop('checked', true);
            } else if ($(this).hasClass('hasDatepicker') && data[id] != '') {
                $(this).datepicker('setDate', new Date(data[id]));
            } else if ($(this).hasClass('custom-combobox-input')) {
                //$(this).val($('#' + id + ' option[value=' + data[$('#' + id).attr('name')] + ']').text());
            } else if ($(this).hasClass('combobox')) {
                $(this).ComboBox('value', data[id]);
            } else if ($(this).hasClass('money') && maskMoneyScriptLoaded()) {
                $(this).val(data[id]).maskMoney('mask');
            } else if ($(this).hasClass('selectMenu')) {
                if (data[id] == '' && $('option:first', $(this)).val().toUpperCase() == 'NULL') {
                    $(this).val($('option:first', $(this)).val());
                } else {
                    $(this).val(data[id]);
                }
                
                $(this).selectmenu('refresh', true);           
            } else {
                $(this).val(data[id]);
            }
        }
    );
}

function getObject(selector) {
    var sel = 'input,select,textarea';
    var obj = {};
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

function multiselectScriptLoaded() {
    return scriptLoaded('multiselect') || scriptLoaded('extra_widget');
}

function maskMoneyScriptLoaded() {
    return scriptLoaded('maskMoney') || scriptLoaded('extra_widget');
}

function scriptLoaded(scriptName) {
    var len = $('script').filter(function () {
        return (typeof $(this).attr('src') != 'undefined' && $(this).attr('src').indexOf(scriptName) != -1);
    }).length;

    return len > 0;
}

function disableDialog(selector) {
    $(selector + ' select.selectMenu').selectmenu('disable');
    $(selector + ' input').prop('disabled', true);
    $(selector + ' textarea').prop('disabled', true);
    $(selector + ' button.ui-button[role=button]').button('disable');
    $(selector + ' a.ui-button[role=button]').button('disable');
    $(selector + ' .custom-combobox-input').css('width', '96.5%');
    if (multiselectScriptLoaded()) $(selector + ' select.multiselect').multiselect('disable');    
}

function enableDialog(selector) {
    $(selector + ' select.selectMenu').selectmenu('enable');
    $(selector + ' input').prop('disabled', false);
    $(selector + ' textarea').prop('disabled', false);
    $(selector + ' button.ui-button[role=button]').button('enable');
    $(selector + ' a.ui-button[role=button]').button('enable');
    $(selector + ' .custom-combobox-input').css('width', '99%');
    if (multiselectScriptLoaded()) $(selector + ' select.multiselect').multiselect('enable');
}

function clearDialog(selector) {
    $(selector + " input, " + selector + " select, " + selector + " textarea").val("").removeClass("ui-state-error");
    $(selector + " input[type=checkbox]").prop('checked', false);
    $(selector + " p.validateTips").text("").removeClass('ui-state-highlight').removeClass('ui-state-error');
    $(selector).parent().children('.ui-dialog-buttonpane').find('button').button('enable');
    $(selector + ' input, select').off('.validation');
    $(selector + ' span .ui-selectmenu-text').text('');

    $(selector + ' select.selectMenu[firstOptionVal=NULL]').val('NULL');
}

function fnGetSelected(dataTable) {
    return dataTable.rows('.row_selected').nodes();
}

function getSelectedRowData(dataTable) {
    return dataTable.rows('.row_selected').data()[0];
}

/**
 * highlights the select row of a datatable
 * @param {object} a DataTable object
 */
function selectRow(dataTable, row) {
    var buttonsSelector = '#' + $(row).closest('table').attr('id') + '_wrapper button.disable';
    $(buttonsSelector).button('disable');
    if ($(row).hasClass('row_selected')) {
        $(row).removeClass('row_selected').removeClass('ui-state-active');
    }
    else {
        dataTable.$('tr.row_selected').removeClass('row_selected').removeClass('ui-state-active');
        $(row).addClass('row_selected').addClass('ui-state-active');
        $(buttonsSelector).button('enable');
    }
}

function toCamelCase(str) {
    return str.replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function columnsDefinition(config) {
    var cols = [];
    for (var i = 0; i < config.GridFields.length; i++) {
        var gridColumn = config.GridFields[i];
        var column = {};
        column.data = gridColumn.ColumnName;
        column.name = gridColumn.ColumnName;
        column.visible = gridColumn.Visible == 'True' ? true : false;
        column.searchable = gridColumn.Searchable == 'True' ? true : false;

        if (gridColumn.Width != '' && gridColumn.Width != '0') {
            column.width = '' + gridColumn.Width + 'px';
        }

        cols.push(column);
    }

    return cols;
}

function StringBuffer() {
    this.buffer = [];
}

StringBuffer.prototype.append = function append(string) {
    this.buffer.push(string);
    return this;
};

StringBuffer.prototype.toString = function toString() {
    return this.buffer.join("");
};

$.widget("ui.dialog", $.ui.dialog, {
    _create: function () {
        this._super("_create");
        this.element.attr('originalTitle', this.originalTitle);
    }
});

$.widget("epe.Catalog", {

    options: {
        pageConfig: null,
        debug:false,
        pageName: "",
        fieldId: "",
        source: "",
        saveRequest: "",
        deleteRequest: "",
        exportRequest: "",
        mouseOver: true,
        showNew: null,
        showEdit: null,
        showDelete: null,
        showIcons: true,
        showText: true,
        showExport: false,
        encodeExport: true,
        viewOnly: false,
        //dialog options
        dialogSelector: "div.modal-form",
        dialogWidth: 500,
        dialogHeight: 'auto',
        //datatables options
        serverSide: false,
        processing: true,
        displayLength: TABLE_DISPLAY_LENGTH,
        columns: [],
        sorting: [[0, 'asc']],
        columnDefs:[],
        ordering:true,
        info: true,
        language: {},
        destroy: false,
        paginate: true,
        filter: true,
        scrollY: '',
        scrollX: '',
        scrollXInner: '',
        scrollCollapse: false,
        autoWidth: true,
        editOnDoubleClick: true,
        iDeferLoading: null,
        appendNextPrevButtons: false,
        appendNextPrevButtonsAfter: null,

        //callback functions
        validate: function () { return true; },
        rowCallback: function (nRow, aData, iDisplayIndex) { return nRow; },
        initCompleteCallBack: function (oTable, oSettings, json, options) { },
        drawCallBack: function (oTable, oSettings) { },
        selectRowCallBack: function (oTable) { },
        doubleClickCallBack: function (oTable) { },
        beforeServerDataCall: null,
        beforeLoadingTableCallBack: null,
        newEntityCallBack: null,
        editEntityCallBack: null,
        deleteEntityCallBack: null,
        saveEntityCallBack: null,
        afterSaveEntityCallBack: null,
        onErrorCallBack: null,
        beforeInitTable: null
    },

    _getCreateOptions: function () {
        if (this.options.showNew == null) {
            this.options.showNew = (typeof NEW_ACCESS == 'undefined' ? true : NEW_ACCESS);
        }

        if (this.options.showEdit == null) {
            this.options.showEdit = (typeof EDIT_ACCESS == 'undefined' ? true : EDIT_ACCESS);
        }

        if (this.options.showDelete == null) {
            this.options.showDelete = (typeof DELETE_ACCESS == 'undefined' ? true : DELETE_ACCESS);
        }

        return {};
    },

    _create: function () {
        if (this.options.pageConfig != null) {
            this.options.pageName = this.options.pageName || this.options.pageConfig.Name;
            this.options.fieldId = this.options.fieldId || this.options.pageConfig.FieldId;
            if (this.options.columns.length == 0) {
                this.options.columns = columnsDefinition(this.options.pageConfig);
            }
        }

        if (this.options.pageName != '' && this.options.source === '') {
            this.options.source = AJAX_CONTROLER_URL + '/PageInfo/GetPageEntityList?pageName=' + this.options.pageName;
        }

        if (this.options.pageName != '' && this.options.saveRequest == '') {
            this.options.saveRequest = AJAX_CONTROLER_URL + '/PageInfo/SavePageEntity?pageName=' + this.options.pageName;
        }

        if (this.options.pageName != '' && this.options.deleteRequest == '') {
            this.options.deleteRequest = AJAX_CONTROLER_URL + '/PageInfo/DeletePageEntity?pageName=' + this.options.pageName;
        }

        if (this.options.pageName != '' && this.options.exportRequest == '') {
            this.options.exportRequest = AJAX_CONTROLER_URL + '/PageInfo/GetPageEntityList?pageName=' + this.options.pageName + '&csv=true&allColumns=true';
        }

        if (this.options.pageName != '' && this.options.dialogSelector == 'div.modal-form') {
            this.options.dialogSelector = '#' + this.options.pageName + '_dialog';
        }

        if (!this.options.serverSide && exists('#' + this.options.pageName + '_filter')) {
            var _pageConfig = this.options.pageConfig;
            var dateColumns = $.grep(_pageConfig.Filter.Fields, function (field) {
                return field.FieldData.ControlProps.indexOf('date-range') != -1;
            });

            var uniqueCols = $.unique(dateColumns.map(function(col){
                return col.FieldData.FieldName.replace('FromFilter','').replace('ToFilter','');
            }));

            if (uniqueCols.length > 0) {
                $.fn.dataTableExt.afnFiltering.push(
                    function (oSettings, aData, iDataIndex) {
                        var valid = true;
                        var columns = _pageConfig.GridFields;
                        
                        for (var i = 0; i < uniqueCols.length; i++) {
                            var colName = uniqueCols[i];
                            if ($('#' + colName + 'FromFilter').val() != '' || $('#' + colName + 'ToFilter').val() != '') {
                                var dateFrom = $('#' + colName + 'FromFilter').val();
                                var dateTo = $('#' + colName + 'ToFilter').val();
                                var colIndex = getArrayIndexForKey(columns, 'ColumnName', colName); //index of the date column
                                valid = valid && filterByDate(aData, colIndex, dateFrom, dateTo);
                            }
                        }

                        return valid;
                    }
                );
            }
        }

        var options = this.options;
        var that = this;

        this._updateNoWrapFields();

        var dtOptions = {
            jQueryUI: true,
            lengthChange: false,
            pagingType: 'full_numbers',
            serverSide: options.serverSide,
            destroy: options.destroy,
            info: options.info,
            language: options.language,
            paging: options.paginate,
            scrollY: options.scrollY,
            autoWidth: options.autoWidth,
            scrollX: options.scrollX,
            scrollXInner: options.scrollXInner,
            scrollCollapse: options.scrollCollapse,
            processing: options.processing,
            pageLength: options.displayLength,
            searching: options.filter,
            ordering: options.ordering,
            rowId: options.fieldId,
            iDeferLoading: options.iDeferLoading,
            rowCallback: function (nRow, aData, iDisplayIndex) {
                return that._rowCallBack(nRow, aData, iDisplayIndex);
            },
            initComplete: function (oSettings, json) {
                this.buttonsWrapper = that._createButtons();
                options.initCompleteCallBack(that.oTable, oSettings, json, options);
            },
            drawCallback: function (oSettings) {
                if ($('#' + this.attr('id') + ' tbody tr.row_selected').length == 0) {
                    $('#' + this.attr('id') + '_wrapper button.disable').button('disable');
                } else {
                    $('#' + this.attr('id') + '_wrapper button.disable').button('enable');
                }

                options.drawCallBack(this, oSettings);
            },
            columns: options.columns,
            columnDefs: options.columnDefs,
            order: $.evalJSON($.toJSON(options.sorting))
        };

        if ($.isArray(options.source)) {
            dtOptions.data = options.source;
        } else if ($.isFunction(options.source)) {
            dtOptions.ajax = options.source;            
        } else if (typeof this.options.source === "string") {
            dtOptions.ajax = {
                url: options.source,
                data: function (data) {
                    if (options.serverSide && options.pageConfig && options.pageConfig.Filter && $('#' + options.pageName + '_filter').attr('firsttime') == 'true') {
                        var newFilter = $.page.filter.createFilter($('#' + options.pageName + '_filter'));
                        $.each(newFilter, function (key, val) {
                            if (val) {
                                var index = getArrayIndexForKey(options.pageConfig.GridFields, 'ColumnName', key);
                                if (index != -1) {
                                    data.columns[index].search.value = val;
                                }
                            }
                        });

                        $('#' + options.pageName + '_filter').Filter('setFilter', newFilter);
                    }

                    if (!jQuery.isEmptyObject(data)) {
                        var elements = $('input, select', $('#' + options.pageName + '_filter'));
                        for (var i = 0; i < elements.length; i++) {
                            var ele = $(elements[i]);
                            if (ele.attr('search-type') && ele.attr('id').indexOf('Filter') != -1) {
                                var _name = ele.attr('id').replace('Filter', '');
                                var index = getArrayIndexForKey(options.pageConfig.GridFields, 'ColumnName', _name);
                                if (index != -1) {
                                    data.columns[index].searchtype = ele.attr('search-type');
                                }
                            }
                        }                       
                    }

                    if (options.beforeServerDataCall != null && typeof (options.beforeServerDataCall) == "function") {
                        options.beforeServerDataCall(data);
                    }

                    if (jQuery.isEmptyObject(data)) {
                        return data;
                    } else {
                        return 'filterInfo=' + encodeURIComponent($.toJSON(data));
                    }
                },
                dataSrc: function (json) {
                    if (!json.aaData) {
                        json = { "iTotalRecords": 0, "iTotalDisplayRecords": 0, "aaData": [] };
                    } 

                    if (typeof options.beforeLoadingTableCallBack === 'function') {
                        options.beforeLoadingTableCallBack(json);
                    }

                    return json.aaData;
                }
            }            
        } else {
            console.error('Source is not supported, is not an array or a string.');
        }

        if (options.dialogSelector != '') {
            this._initializeDialog();
        }

        /* Creating dataTable */
        if (typeof options.beforeInitTable === 'function') {
            options.beforeInitTable(dtOptions);
        }
        if (this.options.pageConfig != null) {
            this.options.tableSelector = '#' + this.options.pageConfig.Name + '_table';
        }
        this.dataTableOptions = dtOptions;
        this.oTable = $(this.element).DataTable(dtOptions).table(0);        

        if (options.appendNextPrevButtons) {
            this._appendNextPrevButtons();
        }

        that.oTable.off('click');

        that.oTable.on('click', 'tbody tr', function () {
            if (that._isDataTableEmpty()) return;

            selectRow(that.oTable, this);
            options.selectRowCallBack(that.oTable, this);
        });

        that.oTable.off('dblclick'); //Remove all dblclick event handlers table tbody
        that.oTable.on('dblclick', 'tbody tr', function (event) {
            event.stopPropagation();
            if (that._isDataTableEmpty()) return;

            var buttonsSelector = '#' + $(this).closest('table').attr('id') + '_wrapper button.disable';
            $(buttonsSelector).button('disable');

            that.oTable.$('tr.row_selected').removeClass('row_selected').removeClass('ui-state-active');
            $(this).addClass('row_selected').addClass('ui-state-active');
            $(buttonsSelector).button('enable');

            if (options.showEdit && options.editOnDoubleClick) {
                if (null != options.editEntityCallBack && typeof (options.editEntityCallBack) == "function") {
                    if (options.viewOnly) disableDialog(options.dialogSelector);
                    options.editEntityCallBack(that.oTable, options);
                } else {
                    if (options.viewOnly) disableDialog(options.dialogSelector);
                    that.editEntity(that.oTable, options);
                }
            }

            options.doubleClickCallBack(that.oTable);
        });       
    },

    _getWrapText: function (field, aData, gridData) {
        var text = '';
        var wrapFields = $.page.getFieldProp(field, 'nowrap-fields');
        if (wrapFields) {
            var concatChar = $.page.getFieldProp(field, 'nowrap-concat') ? $.trim($.page.getFieldProp(field, 'nowrap-concat')) + ' ' : ', ';
            text = this._getText(wrapFields.split(','), aData, concatChar);
        } else {
            text = aData[gridData.ColumnName];
        }

        return text;
    },

    _getText: function (array, obj, concatChar) {
        var text = '';
        for (var i = 0; i < array.length; i++) {
            text = text + $.trim( obj[$.trim(array[i])] ) + concatChar;
        }

        text = text.substring(0, text.length - concatChar.length);
        return text;
    },

    _updateNoWrapFields: function () {
        var opts = this.options;
        if (!opts || !opts.pageConfig || !opts.pageConfig.NoWrapFields || opts.pageConfig.NoWrapFields.length <= 0) return;
        var config = opts.pageConfig;
        var fields = config.NoWrapFields;
        for (var f = 0; f < fields.length; f++) {
            var field = fields[f];
            // find grid data of field
            var gridData = $.grep(config.GridFields, function (gf, i) {
                gf.ColIndex = i;
                return gf.FieldId == field.FieldId;
            });

            field.GridData = clone(gridData[0]);
        }
    },

    _rowCallBack: function (nRow, aData, iDisplayIndex) {
        var options = this.options;
        if (options.pageConfig && options.pageConfig.NoWrapFields && options.pageConfig.NoWrapFields.length > 0) {
            var wrap = '<div class="nowrap-col" style="width:COL_WIDTH;" title="DATA">DATA</div>';
            var noWrapFields = options.pageConfig.NoWrapFields;
            for (var f = 0; f < noWrapFields.length; f++) {
                var field = noWrapFields[f];
                var gridData = field.GridData;
                var text = this._getWrapText(field, aData, gridData);

                jQuery('td:eq(' + gridData.ColIndex + ')', nRow).html(wrap.replace(/DATA/g, text).replace('COL_WIDTH', gridData.Width + 'px'));
            }
        }

        return options.rowCallback(nRow, aData, iDisplayIndex);
    },

    _createButtons: function () {
        var options = this.options;
        var id = this.element.attr('id');
        var that = this;
        var buttonsWrapper = $('<div id="' + id + '_wrapper_buttons" style="float:left;"></div>');
        $('#' + id + '_wrapper div:first').append(buttonsWrapper);

        if (options.showNew) {
            buttonsWrapper.append('<button id="new' + id + '" onclick="return false;" title="New">New</button>');

            var buttonOpts = { text: options.showText };

            if (options.showIcons) {
                buttonOpts.icons = { primary: "ui-icon-document" };
            }

            $('#new' + id).button(buttonOpts).click(function (event) {
                if (null != options.newEntityCallBack && typeof (options.newEntityCallBack) == "function") {
                    options.newEntityCallBack(that.oTable, options);
                } else {
                    that.newEntity(that.oTable, options);
                }
            });
        }

        if (options.showEdit) {
            var text = "Edit";
            if (options.viewOnly) text = "View";

            buttonsWrapper.append('<button id="edit' + id + '" onclick="return false;" class="disable" title="' + text + '">' + text + '</button>');

            var buttonOpts = { text: options.showText };

            if (options.showIcons) {
                buttonOpts.icons = { primary: "ui-icon-pencil" };
            }

            $('#edit' + id).button(buttonOpts).click(function (event) {

                if (null != options.editEntityCallBack && typeof (options.editEntityCallBack) == "function") {
                    if (options.viewOnly) disableDialog(options.dialogSelector);
                    options.editEntityCallBack(that.oTable, options);
                } else {
                    if (options.viewOnly) disableDialog(options.dialogSelector);
                    that.editEntity(that.oTable, options);
                }
            });
        }

        if (options.showDelete) {
            buttonsWrapper.append('<button id="delete' + id + '" onclick="return false;" class="disable" title="Delete">Delete</button>');

            var buttonOpts = { text: options.showText };

            if (options.showIcons) {
                buttonOpts.icons = { primary: "ui-icon-trash" };
            }

            $('#delete' + id).button(buttonOpts).click(function (event) {
                if (null != options.deleteEntityCallBack && typeof (options.deleteEntityCallBack) == "function") {
                    options.deleteEntityCallBack(that.oTable, options);
                } else {
                    if (confirm('Are you sure you want to delete this ' + $(options.dialogSelector).attr('originalTitle') + '?') == false)
                        return false;

                    that.deleteEntity(that.oTable, options);
                }
            });
        }

        if ($.isArray(options.showExport)) {
            var ul = $('<ul class="export-menu ui-corner-all" style="display:none;"></ul>').attr('id', 'export-menu-' + id);
            var length = options.showExport.length;
            for (var i = 0; i < length; i++) {
                var opt = options.showExport[i];
                ul.append('<li class="ui-corner-all"><a href="#" id="export-' + opt.toLowerCase() + '" export-type="' + opt.toLowerCase() + '" title="Export to ' + opt + '">' + opt + '</a></li>');
            }

            $('body').append(ul);
            $(ul).menu();

            $('a', ul).click(function () {
                var expType = $(this).attr('export-type');
                var _url = options.exportRequest;
                if (expType != 'csv') {
                    _url = _url + '&exportType=' + expType;
                }

                if (options.serverSide) {
                    var requestData = that._getExportRequest(options);                   
                    if (expType != 'csv') {
                        requestData.url = requestData.url + '&exportType=' + expType;
                    }
                    $.fileDownload(requestData.url, { httpMethod: 'POST', data: requestData.data });
                } else {
                    $.fileDownload(_url, { httpMethod: 'POST' });
                }                
            });

            var expbtn = $('<button id="export' + id + '" title="Export">Export</button>');
            var buttonOpts = { text: options.showText };

            if (options.showIcons) {
                buttonOpts.icons = { primary: "ui-icon-arrowthickstop-1-s", secondary: "ui-icon-triangle-1-s" };
            }

            expbtn.button(buttonOpts).click(function (event) {
                var menu = $(ul).show().position({
                    my: "left top",
                    at: "left bottom",
                    of: this
                });

                $(document).one("click", function () {
                    menu.hide();
                });

                return false;

            });

            buttonsWrapper.append(expbtn);

        } else if (options.showExport) {
            var expbtn = $('<a href="#" id="export' + id + '" title="Export to csv">Export</a>');
            var buttonOpts = { text: options.showText };

            if (options.showIcons) {
                buttonOpts.icons = { primary: "ui-icon-arrowthickstop-1-s" };
            }

            expbtn.button(buttonOpts).click(function (event) {
                if (options.serverSide) {
                    var requestData = that._getExportRequest(options);
                    $.fileDownload(requestData.url, { httpMethod: 'POST', data: requestData.data });
                } else {
                    var href = options.exportRequest;
                    $(this).attr('href', href);
                }
            });


            buttonsWrapper.append(expbtn);
        }

        $('#' + id + '_wrapper button').button();
        $('#' + id + '_wrapper button.disable').button('disable');
        $('#' + id + '_filter input').addClass('text ui-corner-all');

        this.buttonsWrapper = buttonsWrapper;
        return buttonsWrapper;
    },

    _getExportRequest: function (options) {
        var _url = options.exportRequest;
        var filterInfo = this._getFilterInfo(options);
        var requestData = this._getExportRequestData(_url);
        requestData.data += '&' + filterInfo;

        return requestData;
    },

    _getFilterInfo:function(options) {
        var _params = $('#' + options.pageName + '_table').DataTable().ajax.params() || '';
        _params = decodeURIComponent(_params);
        if (_params) {
            var paramsObj = $.evalJSON(_params.replace('filterInfo=', ''));
            paramsObj.length = -1; //setting length to -1 so it will retrieved all filtered records
            _params = this._removeUnnecessaryFilterAttributes(paramsObj);
            if (options.encodeExport) _params = encodeURIComponent(_params);
        }

        return 'filterInfo=' + _params;
    },

    _getExportRequestData: function (_url) {
        var requestData = {url : _url, data : ''};
        var newReqData = { url: '', data: '' };
        var params = requestData.url.split('?');
        if (params.length > 0) {
            var urlQuerySection = params[1];
            var requestParams = urlQuerySection.split('&');
            if (requestParams && requestParams.length > 0) {
                this._calculateNewRequestData(params[0], requestParams, newReqData);
            }

            requestData.url = newReqData.url;
            requestData.data = newReqData.data;
        }

        return requestData;
    },

    _calculateNewRequestData: function (urlPath, requestParams, newReqData) {
        for (var i = 0; i < requestParams.length; i++) {
            var paramPair = this._getRequestParamPair(requestParams[i]);
            if (POST_TYPE_PARAMS.indexOf(paramPair.key) != -1) {
                if (newReqData.data.length > 0) newReqData.data += '&';
                newReqData.data += paramPair.key + '=' + paramPair.value;
            } else {
                if (newReqData.url.length > 0) newReqData.url += '&';
                newReqData.url += paramPair.key + '=' + paramPair.value;
            }
        }

        if (newReqData.url.length > 0) newReqData.url = '?' + newReqData.url;
        newReqData.url = urlPath + newReqData.url;

        return newReqData;
    },

    _getRequestParamPair: function (requestParam) {
        var paramPair = requestParam.split('=');

        return { key: paramPair[0], value: paramPair[1] };
    },

    _removeUnnecessaryFilterAttributes: function (paramsObj) {
        for (var i = 0; i < paramsObj.columns.length; i++) {
            var col = paramsObj.columns[i];
            delete col['orderable'];
            delete col.search['regex']
        }

        delete paramsObj.search['regex']
        _params = '' + $.toJSON(paramsObj);

        return _params;
    },

    _isDataTableEmpty: function () {
        var tableId = $(this.element).attr('id');
        return exists('#' + tableId + ' td.dataTables_empty');
    },

    _initializeDialog: function () {
        var options = this.options;
        var that = this;

        var buttonsList = [];
        if (!options.viewOnly) {
            var savebutton = {
                id: 'button-save',
                text: 'Save',
                tabindex: 980,
                click: function () {
                    var bValid = true;
                    $('#' + this.id + ' input, #' + this.id + ' select').removeClass("ui-state-error");
                    var tips = $('#' + this.id + ' p.validateTips');

                    if (null != options.validate && typeof (options.validate) == "function") {
                        bValid = options.validate(tips, that._dialog);
                    }

                    if (bValid) {
                        if (null != options.saveEntityCallBack && typeof (options.saveEntityCallBack) == "function") {
                            options.saveEntityCallBack(that.oTable, options);
                        } else {
                            that.saveEntity(that.oTable, options);
                        }
                    }
                }
            };

            buttonsList.push(savebutton);
        }

        buttonsList.push({
            id: 'button-cancel',
            text: 'Cancel',
            tabindex: 990,
            click: function () {
                $(this).dialog('close');
            }
        });

        that._dialog = $(options.dialogSelector).dialog({
            autoOpen: false,
            width: options.dialogWidth,
            height: options.dialogHeight,
            modal: true,
            resizable: false,
            buttons: buttonsList,
            close: function () {
                clearDialog('#' + this.id);
            }
        });
    },

    _appendNextPrevButtons: function() {
        var that = this;
        var options = this.options;
        var appendAfter = this._getAppendAfter();
        var prev = $('<button id="' + options.pageConfig.Name + '-btn-prev" class="nav-btn" onclick="return false;" title="Move to previous record">Prev</button>');
        $(appendAfter).after(prev);
        var next = $('<button id="' + options.pageConfig.Name + '-btn-next" class="nav-btn" onclick="return false;" title="Move to next record">Next</button>');
        prev.after(next);

        $(options.tableSelector).on('draw.dt', function () { that._tableDraw(that); });
        $(next).button().click(function () { that._moveTo('next'); });
        $(prev).button().click(function () { that._moveTo('previous'); });
    },

    _toggleNextPrevButtons: function(toggleTo) {
        var name = this.options.pageConfig.Name;
        var sel = '#' + name + '-btn-prev, #' + name + '-btn-next';
        $(sel).button(toggleTo);
    },

    _getAppendAfter: function() {
        var appendAfter = $('#button-cancel', this._dialog.dialog('widget'));
        if (this.options.appendNextPrevButtonsAfter) {
            appendAfter = $(this.options.appendNextPrevButtonsAfter);
        }

        return appendAfter;
    },

    _moveTo: function (dir) {
        var tableSelector = this.options.tableSelector;
        var info = this._getMoveToInfo(dir);
        if (this.options.debug) log(info);

        if (this._isFirstRecord(info) || this._isLastRecord(info)) return; 
        if (info.index == info.limit) {
            $(tableSelector).attr(dir + 'Button', 'true');
            $(tableSelector + ' tbody tr').removeClass('row_selected').removeClass('ui-state-active');
            $(tableSelector).DataTable().page(dir).draw('page');
        } else {
            $(tableSelector + ' tbody #' + info.list[info.index][info.fieldId]).removeClass('row_selected').removeClass('ui-state-active');
            $(tableSelector + ' tbody #' + info.list[info.nextIndex][info.fieldId]).addClass('row_selected').addClass('ui-state-active');
            this._editEntity();
        }
    },

    _tableDraw: function (that) {
        var tableSelector = that.options.tableSelector;
        if ($(tableSelector).attr('nextButton') != 'true' && $(tableSelector).attr('previousButton') != 'true') {            
            return;// do nothing normal page change
        }

        var _row = $(tableSelector).attr('nextButton') == 'true' ? 'first' : 'last';
        $(tableSelector + ' tbody tr:' + _row).addClass('row_selected').addClass('ui-state-active');
        $(tableSelector).removeAttr('nextButton').removeAttr('previousButton');

        that._editEntity();
    },

    _getMoveToInfo: function(dir) {
        var options = this.options;
        if (options.debug) log(options);
        var info = $(options.tableSelector).DataTable().page.info();
        info.fieldId = options.pageConfig.FieldId;
        if ($(options.tableSelector).is(':visible')) {
            info.list = $(options.tableSelector).DataTable().rows(':visible').data();
            info.ids = $(options.tableSelector).DataTable().rows(':visible').ids();
        } else {
            info.list = $(options.tableSelector).DataTable().rows().data();
            info.ids = $(options.tableSelector).DataTable().rows().ids();
        }
        info.index = info.ids.indexOf($('#' + info.fieldId).val());
        info.dir = dir;
        info.limit = dir == 'next' ? (info.list.length - 1) : 0;
        info.nextIndex = dir == 'next' ? (info.index + 1) : info.index - 1;

        return info;
    },

    _isLastRecord: function(info) {
        return info.dir == 'next' && info.page == (info.pages - 1) && info.index == info.limit;
    },

    _isFirstRecord: function(info) {
        return info.dir == 'previous' && info.page == 0 && info.index == 0;
    },

    _editEntity: function() {
        var options = this.options;
        if (typeof options.editEntityCallBack === 'function') {
            if (options.viewOnly) disableDialog(options.dialogSelector);
            options.editEntityCallBack($(options.tableSelector).DataTable(), options);
        } else {
            if (options.viewOnly) disableDialog(options.dialogSelector);
            this.editEntity($(options.tableSelector).DataTable(), options);
        }
    },

    newEntity: function (oTable, options) {
        clearDialog('#' + this._dialog.attr('id'));
        this._setDefaultValues(options.pageConfig);

        this._dialog.dialog('option', 'title', this._dialog.attr('originalTitle') + ' [New]').dialog('open');
        $('.ui-tabs', this._dialog).tabs('option', 'active', 0);
        this._setFocusOnFirstDialogElement();

        if (this.options.debug) log(options);
        if (this.options.viewOnly) disableDialog('#' + this._dialog.attr('id'));
        if (this.options.appendNextPrevButtons) this._toggleNextPrevButtons('disable');

        return this._dialog;
    },

    editEntity: function (oTable, options, obj) {
        if (this.options.debug) log(this.options);
        var entity = obj;
        if (obj == null || typeof obj == 'undefined') {
            entity = getSelectedRowData(oTable);
            if (this.options.debug) log('editEntity obj is null');
        }

        if (this.options.debug) log(entity);
        clearDialog('#' + this._dialog.attr('id'));
        populateDialog(entity, '#' + this._dialog.attr('id'));
        this._setDefaultValues(options.pageConfig);

        this._dialog.dialog('option', 'title', this._dialog.attr('originalTitle') + ' [Edit]').dialog('open');
        $('.ui-tabs', this._dialog).tabs('option', 'active', 0);
        this._setFocusOnFirstDialogElement();

        if (this.options.viewOnly) disableDialog('#' + this._dialog.attr('id'));
        if (this.options.appendNextPrevButtons) this._toggleNextPrevButtons('enable');

        return entity;
    },

    deleteEntity: function (oTable, options) {
        var entity = getSelectedRowData(oTable);
        var tableSel = this.options.tableSelector;
        if (this.options.debug) log(entity);

        $.ajax({
            type: 'POST',
            url: options.deleteRequest,
            data: 'entity=' + encodeURIComponent($.toJSON(entity))
        }).done(function (json) {
            if (json.ErrorMsg == SUCCESS) {
                oTable.ajax.reload();
                $(tableSel + '_wrapper button.disable').button('disable');
            } else {
                alert(json.ErrorMsg);
            }
        }).always(function (json) {
            if (json.ErrorMsg == SESSION_EXPIRED) {
                window.location.href = LOGIN_PAGE;
                return;
            }
        });
    },

    saveEntity: function (oTable, options, obj) {
        var entity = obj;
        if (obj == null || typeof obj == 'undefined') {
            entity = getObject(options.dialogSelector);
        }

        if (this.options.debug) log(entity);
        if (this.options.debug) log(this.options);
        
        var that = this;
        var tableSel = this.options.tableSelector;

        $.ajax({
            type: 'POST',
            url: options.saveRequest,
            data: 'entity=' + encodeURIComponent($.toJSON(entity))
        }).done(function (json) {
            if (json.ErrorMsg == SUCCESS) {
                if (typeof that.options.afterSaveEntityCallBack === 'function') {
                    that.options.afterSaveEntityCallBack(oTable, options, json, entity);
                } else {
                    that._dialog.dialog('close');
                    $(tableSel + '_wrapper button.disable').button('disable');
                    $(tableSel).DataTable().ajax.reload();
                }
            } else {
                showError($(options.dialogSelector + ' p.validateTips'), json.ErrorMsg);
            }
        }).always(function (json) {
            if (json.ErrorMsg == SESSION_EXPIRED) {
                window.location.href = LOGIN_PAGE;
                return;
            }
        });
    },

    _setFocusOnFirstDialogElement: function () {
        var tab = $($('div.ui-tabs-panel', this._dialog)[0]);
        var elements = $('input:visible:first, select, textarea:visible:first', tab);
        for (var i = 0; i < elements.length; i++) {
            var ele = elements[i];
            if (ele.nodeName == 'INPUT' || ele.nodeName == 'TEXTAREA') {
                $(ele).focus();
                break;
            } else if (this._isSelectMenu(ele) && this._isSelectMenuEnable(ele)) {
                $(ele).selectmenu('widget').focus();
                break;
            }
        }
    },

    _isSelectMenu: function(ele) {
        return ele.nodeName == 'SELECT' && $(ele).hasClass('selectMenu');
    },

    _isSelectMenuEnable: function(ele) {
        var widget = $(ele).selectmenu('widget');
        return $(widget).is(':visible') && !$(widget).hasClass('ui-state-disabled');
    },

    _setDefaultValues: function(config) {
        if (!(config && config.Tabs)) return;
        var fields = [];

        for (var t = 0; t < config.Tabs.length; t++) {
            var _results = jQuery.grep(config.Tabs[t].Fields, function (field, i) {
                var _data = field.ControlProps;
                return (_data.toLowerCase().indexOf(DEFAULT_VALUE.toLowerCase()) != -1)
            });

            fields = fields.concat(_results);
        }
        
        for (var f = 0; f < fields.length; f++) {
            this._setFieldValue(fields[f]);
        }
    },

    _setFieldValue: function(field) {
        var controlPros = $.evalJSON(field.ControlProps);
        var _value = controlPros[DEFAULT_VALUE];
        if (!_value) return;

        if (startsWith(_value, 'js:')) {
            _value = _value.substring(3);
            _value = eval('(' + _value + ')');
        }

        var _field = $('#' + field.FieldName, this._dialog);

        if (field.ControlType == 'selectmenu' && $('#' + field.FieldName).hasClass('selectMenu')) {
            _field.val(_value).selectmenu('refresh');           
        } else if (field.ControlType == 'dropdownlist') {
            _field.ComboBox('value', _value);
        } else if (field.ControlType == 'checkbox') {
            _field.prop('checked', isTrue(_value));
        } else {
            _field.val(_value);
        }
    },

    reloadTable: function (url, callback) {
        if (typeof url != 'undefined' && url != null && url != '' && callback != null) {
            return this.oTable.ajax.url(url).load(callback);
        }

        if (typeof url != 'undefined' && url != null && url != '') {
            return this.oTable.ajax.url(url).load();
        }

        return this.oTable.ajax.reload();
    },

    clearTable: function () {
        this.oTable.clear().columns.adjust().draw();
        var t = this.oTable;
        return t;
    },

    addDataToTable: function (_data) {
        this.oTable.rows.add(_data).draw();
        var t = this.oTable;
        return t;
    },

    getTableOptions: function() {
        return this.dataTableOptions;
    },

    getTable: function () {
        var t = this.oTable;
        return t;
    },

    getCatalogOptions: function () {
        return this.options;
    },

    setCatalogOptions: function (_options) {
        this.options = _options;
    },

    getDialog: function () {
        return this._dialog;
    },

    getButtonSection: function () {
        return this.buttonsWrapper;
    },

    _destroy: function () {

    }

});

$.widget('epe.ComboBox', {

    options: {
        id: '',
        sortByField: '',
        valField: '',
        textField: '',
        data: '',
        error: 'this',
        addSelect: false,
        selectText: '',
        removedInvalid: true,
        selected: null,
        emptyText: '',
        //callbacks
        onLoadComplete: function () { },
        onCreateComplete: function () { },
        onLoadingOptions: null,
        onItemSelected: function (element) { },
        onErrorCallBack: null,
        sort: null,
        list: [],
        extraAttrs: '',
        cache: false
    },

    _create: function () {       
        this.prevVal = '';

        var that = this;
        if (this.options.url) {
            $.when(this._getComboData()).done(function (json) {
                if (json.aaData) {
                    that.options.list = json.aaData;
                } else {
                    log('Unable to fetch ' + that.options.error + ' list.');
                }

                that._createWrapper();
                that._loadOptions();
            });
        } else {
            this.options.onLoadComplete();
            this._createWrapper();
            if ($.isArray(this.options.list) && this.options.list.length > 0) {
                this._loadOptions();
            } else {
                this._createAutocomplete();
                this._createShowAllButton();
                this.options.onCreateComplete();
            }
        }

        this.element.hide();
    },

    _getComboData: function() {
        if (this.options.cache && (this.options.cache == true || this.options.cache == 'true')) {
            return $.getData(this.options.url);
        } else {
            return $.ajax({
                url: this.options.url,
                data: this.options.data
            });
        }
    },

    _createWrapper: function() {
        var wrapperId = this.element.attr('id') + '_combobox_wrapper';
        this.wrapper = $('<table class="custom-combobox" cellpadding="0" cellspacing="0"><tr><td class="custom-combobox-input-td"></td><td class="custom-combobox-button-td"></td></tr></table>').insertAfter(this.element);
        this.wrapper.attr('id', wrapperId);
    },

    _loadOptions: function () {
        if (this.options.onLoadingOptions != null) {
            this.options.onLoadingOptions(this.element, this.options);
        } else {
            this._loadingOptions();
        }

        this.options.onLoadComplete();
        this._createAutocomplete();
        this._createShowAllButton();
        this.options.onCreateComplete();
    },

    _loadingOptions: function () {
        this.element.empty();
        this.element.attr('load-complete', 'false');
        var list = this.options.list;
        var ddInfo = this.options;

        if (ddInfo.selected) ddInfo.selectedVal = ddInfo.selected; //copy ddInfo.selected to ddInfo.selectedVal for backward compatibility
        if (ddInfo.sortByField) ddInfo.sortBy = ddInfo.sortByField; //copy ddInfo.sortByField to ddInfo.sortBy for backward compatibility

        if (list.length <= 0) {
            this.element.append($('<option></option>').attr('value', '').text(ddInfo.emptyText));
            ddInfo.onLoadComplete();
            //return;
        }

        if (typeof ddInfo.sort === 'function') {
            list.sort(function (a, b) { return ddInfo.sort(a, b); });
        } else {
            $.page.sortList(list, ddInfo);
        }

        if (ddInfo.addSelect) {
            this.element.append($('<option></option>').attr('value', '').text(ddInfo.selectText));
        }

        for (var i = 0; i < list.length; i++) {
            var obj = list[i];        
            this.element.append($.page.createOption(obj, ddInfo));
        }

        this.element.attr('load-complete', 'true');
        this.element.addClass('combobox');
        this.prevVal = this.element.val();
    },

    _createAutocomplete: function () {
        var that = this;
        var selected = this.element.children(':selected'),
          value = selected.val() ? selected.text() : '';

        this.input = $('<input>')
          .appendTo(this.wrapper.find('td.custom-combobox-input-td'))
          .val(value)
          .attr('title', '')
          .attr('id', this.element.attr('id') + '_combobox')
          .attr('name', this.element.attr('id'))
          .attr('tabindex', this.element.attr('tabindex'))
          .attr('title', this.element.attr('title'))
          .addClass('custom-combobox-input ui-widget ui-widget-content ui-corner-left')
          .autocomplete({
              delay: 0,
              minLength: 0,
              source: $.proxy(this, '_source')
          }).blur(function () {
              //Clear select value if empty
              if ($.trim($(this).val()) == '') {
                  that.element.val('');
              }
          });

        this._on(this.input, {
            autocompleteselect: function (event, ui) {
                ui.item.option.selected = true;

                this._trigger('select', event, {
                    item: ui.item.option
                });

                if (this.prevVal != ui.item.option.value) {
                    this.element.trigger('change');
                    this.prevVal = ui.item.option.value;
                }

                that.options.onItemSelected(that.element);
            },

            autocompletechange: '_removeIfInvalid'
        });
    },

    _createShowAllButton: function () {
        var input = this.input,
          wasOpen = false;

        this.button = $('<a>')
          .attr('tabindex', this.element.attr('tabindex'))
          .tooltip()
          .appendTo(this.wrapper.find('td.custom-combobox-button-td'))
          .button({
              icons: {
                  primary: 'ui-icon-triangle-1-s'
              },
              text: false
          })
          .removeClass('ui-corner-all')
          .addClass('custom-combobox-toggle ui-corner-right')
          .mousedown(function () {
              wasOpen = input.autocomplete('widget').is(':visible');
          })
          .keydown(function (event) {
              if (event.which == 13) {
                  input.focus();

                  // Close if already visible
                  if (wasOpen) {
                      return;
                  }

                  // Pass empty string as value to search for, displaying all results
                  input.autocomplete('search', '');
              }
          })
          .click(function () {
              input.focus();

              // Close if already visible
              if (wasOpen) {
                  return;
              }

              // Pass empty string as value to search for, displaying all results
              input.autocomplete('search', '');
          });
    },

    _source: function (request, response) {
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
        response(this.element.children('option').map(function () {
            var text = $(this).text();
            if (this.value && (!request.term || matcher.test(text)))
                return {
                    label: text,
                    value: text,
                    option: this
                };
        }));
    },

    _removeIfInvalid: function (event, ui) {
        // Selected an item, nothing to do
        if (ui.item) {
            return;
        }

        var prevText = this.element.find('option:selected').text();
        var prevValue = this.element.val();
        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;

        this.element.children('option').each(function () {
            if ($(this).text().toLowerCase() === valueLowerCase) {
                this.selected = valid = true;
                return false;
            }
        });

        // Found a match, nothing to do
        if (valid) {
            return;
        }

        // Remove invalid value
         if (this.options.removedInvalid) {
            this.input
            .val(prevText)
            .attr('title', value + ' didn\'t match any item');
            

            this.element.val(prevValue);
            this._delay(function () {
                this.input.attr('title', '');
            }, 2500);
            this.input.data('ui-autocomplete').term = '';
        } else {
            // Value not found clearing drop down val
            this.element.val('');
        }
    },

    _destroy: function () {
        this.wrapper.remove();
        this.element.show();
    },

    getList: function() {
        return this.options.list;
    },

    hide: function () {
        this.wrapper.hide();
    },

    show: function () {
        this.wrapper.show();
    },

    disable:function() {
        $(this.input).prop('readonly', true);
        $(this.button).button('disable');
    },

    enable: function () {
        $(this.input).prop('readonly', false);
        $(this.button).button('enable');
    },

    value: function (val) {
        if (typeof val == 'undefined' || val == null) { //accessor
            if (!this.options.removedInvalid && (this.element.val() == null || this.element.val() == '')) {
                return this.input.val();
            }
            return this.element.val();
        } else { //mutator
            this.element.val(val);
            if (!this.options.removedInvalid && (this.element.find('option:selected').text() == null || this.element.find('option:selected').text() == '')) {
                this.input.val(val);
            } else {                          
                this.input.val(this.element.find('option:selected').text());
            }
        }
    },

    reload: function (newoptions) {
        this.element.attr('load-complete', 'false');        

        this.options.list = [];
        this.options = $.extend(this.options, newoptions);
        var that = this;
        if (this.options.url) {
            $.when(this._getComboData()).done(function (json) {
                if (json.aaData) {
                    that.options.list = json.aaData;
                } else {                    
                    log('Unable to fetch ' + that.options.error + ' list.');
                }

                that.input.val('');

                if (that.options.onLoadingOptions != null) {
                    that.options.onLoadingOptions(that.element, that.options);
                } else {
                    that._loadingOptions();
                }

                that.input.val(that.element.find('option:selected').text());

                if (typeof newoptions.onLoadComplete === 'function') {
                    newoptions.onLoadComplete();
                }
            });

            this.element.attr('load-complete', 'true');
            return;
        }

        if ($.isArray(this.options.list) && this.options.list.length >= 0) {
            this.input.val('');

            if (this.options.onLoadingOptions != null) {
                this.options.onLoadingOptions(this.element, this.options);
            } else {
                this._loadingOptions();
            }

            this.input.val(this.element.find('option:selected').text());

            if (typeof newoptions.onLoadComplete === 'function') {
                newoptions.onLoadComplete();
            }
            this.element.attr('load-complete', 'true');
            return;
        }
    }

});


$.widget('epe.Page', {

    //defaults
    options: {
        data: '',
        source: '',
        showLoading: true,
        createPageFilter: true,
        createPageTable: true,
        createPageDialog: true,
        dialogStyle: 'fieldset',
        debug: false,

        //callbacks
        onBeforeCreateFilter: function (config) { },
        onFilterInitComplete: function (config) { },
        onAfterCreateFilter: function () { },
        onFilterChange: function (filter) {},
        onBeforeCreateTable: function () { },
        onAfterCreateTable: function () { },
        onBeforeCreateDialog: function () { },
        onLoadComplete: function () { }
    },

    _create: function () {
        this.config = {};

        $(this.element).hide();
        if (this.options.showLoading) {
            this._showLoading();
            //return;
        }

        if ($.isPlainObject(this.options.source)) {
            this._createContent(this.options.source);
        } else if (typeof this.options.source === "string") {
            $.ajax({
                url: this.options.source,
                data: this.options.data,
                context: this
            }).done(function (json) {
                this._createContent(json);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                var json = eval('(' + jqXHR.responseText + ')');
                if (json.ErrorMsg) {
                    alert(json.ErrorMsg);
                    return;
                }
            }).always(function (json) {
                if (json.ErrorMsg == SESSION_EXPIRED) {
                    window.location.href = LOGIN_PAGE;
                    return;
                }
            });
        }
    },

    _createContent: function(json) {
        this.config = json;

        if (this.config.Filter) {
            var fields = this._getFilterFields(this.config);
            if (fields.length != 0) {
                this.config.Filter.Fields = fields;
            }
        }

        if (this.options.createPageFilter) {
            this.options.onBeforeCreateFilter(json);
            if (this.options.debug) console.time('_createFilter');
            this._createFilter(json);
            if (this.options.debug) console.timeEnd('_createFilter');
            this.options.onAfterCreateFilter(json);
        }

        if (this.options.createPageTable) {
            this.options.onBeforeCreateTable(json);
            if (this.options.debug) console.time('_createTable');
            this._createTable(json);
            if (this.options.debug) console.timeEnd('_createTable');
            this.options.onAfterCreateTable(json);
        }

        if (this.options.createPageDialog) {
            this.options.onBeforeCreateDialog(json);
            if (this.options.debug) console.time('_createDialog');
            this._createDialog(json);
            if (this.options.debug) console.timeEnd('_createDialog');
        }

        if (this.config.Filter && this.options.createPageFilter) {
            this._initFilter(json);           
        }  else {
            $(this.element).show();
            this.options.onLoadComplete(json);

            if (this.options.showLoading) {
                this.loading.remove();
            }
        }                       
    },

    _showLoading: function () {
        this.loading = $('<div id="loading" style="height:500px;">Loading, please wait...</div>');
        $(this.element).after(this.loading);

        var target = document.getElementById('loading');
        var spinner = new Spinner(spinOpts).spin(target);
    },

    _createTable: function (config) {
        var html = new StringBuffer();
        var fields = config.GridFields;

        fields.sort(function (a, b) {
            var a1 = parseInt(a['ColumnOrder']), b1 = parseInt(b['ColumnOrder']);
            if (a1 == b1) return 0;
            return a1 > b1 ? 1 : -1;
        });

        var length = fields.length;
        html.append('<tr>');
        for (var i = 0; i < length; i++) {
            html.append('<th align="left">').append(fields[i].ColumnLabel).append('</th>');
        }
        html.append('</tr>');

        var table = $('<table cellpadding="0" cellspacing="0" border="0" class="display" id="' + config.Name + '_table"><thead></thead><tbody></tbody></table>');
        $('thead', table).append(html.toString());

        this.table = table;
        $(this.element).append(table);
    },

    _createFilter: function (config) {
        if (!config.Filter) return; //No filter specified        
        var filter = config.Filter;
        var cols = filter.FilterCols;

        var html = new StringBuffer();
        html.append('<tr><td colspan="').append(cols).append('" style="font-weight: bold;color: #2779aa;padding-bottom:10px;padding-top:5px;">' + filter.FilterText +'</td>');
        html.append('<td colspan="').append(cols).append('" style="font-weight: bold;color: #2779aa;padding-bottom:10px;padding-top:5px;padding-right:5px;" align="right">');

        if (filter.ShowClear.toLowerCase() == 'true') {
            html.append('<button id="clearFilter" onclick="return false;" title="Clear Filter">Clear</button>');
        }

        html.append('</td></tr>');

        var tr = new StringBuffer();
        var labelWidth = ((100 / parseInt(cols)) * 0.3) + '%';
        var eleWidth = ((100 / parseInt(cols)) * 0.7) + '%';

        var controlFields = { dropDownFields: [], dateFields: [], selectMenuFields: [], multiSelectFields: [] };

        var length = filter.Fields.length;
        for (var i = 0; i < length; i++) {
            var field = filter.Fields[i];

            tr.append('<td width="').append(labelWidth).append('">').append(field.FieldData.Label).append('</td>');
            tr.append('<td width="').append(eleWidth).append('">').append(this._getFieldHTML(field.FieldData, controlFields)).append('</td>');

            if (((i + 1) % cols) == 0 || (i + 1) >= length) {
                html.append('<tr class="columns-').append(cols).append('">').append(tr.toString()).append('</tr>');
                tr = new StringBuffer();
            }
        }
       
        var table = $('<table id="' + config.Name + '_filter" width="100%" cellpadding="1" cellspacing="0" border="0" class="filter-form ui-widget ui-widget-content ui-corner-all" style="padding : 5px;"><tbody></tbody></table>');
        $('tbody', table).append(html.toString());

        if (this.options.filterSelector) {
            $(this.options.filterSelector).append(table);
        } else {
            $('h2').after(table);
        }

        var controlPropFields = jQuery.grep(filter.Fields, function (f) {
            return (f.FieldData.ControlProps);
        });

        var l = controlPropFields.length;
        for (var p = 0; p < l; p++) {
            var field = controlPropFields[p];
            var controlProps = field.FieldData.ControlProps;
            if (controlProps) {
                try { // Try to parse controlprops            
                    var props = controlProps && $.evalJSON(controlProps);
                    $.each(props, function (key, val) {
                        if (key != 'colSpan') {
                            var ele = $('#' + field.FieldData.FieldName, table);
                            if (ele.is('div')) { //element is wrap in a div, usually date elements
                                $('input', ele).attr(key, val).prop(key, val);
                            } else {
                                ele.attr(key, val).prop(key, val);
                            }
                        }
                    });
                } catch (e) { /* not able to parse props*/ }
            }
        }

        table.attr('firsttime', 'true');
        this.filter = table;
    },

    _createDialog: function (config) {
        var dialog = $('<div id="' + config.Name + '_dialog" title="' + config.Title + '" style="display:none;" class="modal-form"><p class="validateTips ui-corner-all"></p></div>');

        var tabsEle = $('<div id="' + config.Name + '_dialogtabs"><ul></ul></div>');
        var idFields = [];        
        var controlFields = {
            dropDownFields: [],
            dateFields: [],
            selectMenuFields: [],
            multiSelectFields: [],
            noWrapFields:[]
        };

        var tabs = config.Tabs;
        for (var i = 0; i < tabs.length; i++) {
            var _tabId = $.trim(tabs[i].TabName.replace(/ /g, '')) + 'Tab';
            $('ul', tabsEle).append('<li id="' + _tabId + '"><a href="#tabs-' + (i + 1) + '">' + tabs[i].TabName + '</a></li>');

            var tabContent = null;
            if (this.options.dialogStyle.toLowerCase() == 'fieldset') {
                tabContent = this._getTabContent(tabs[i], controlFields, idFields, i);
            } else if (this.options.dialogStyle.toLowerCase() == 'table') {
                tabContent = this._getTableStyleTabContent(tabs[i], controlFields, idFields, i);
            } else {//default
                tabContent = this._getTabContent(tabs[i], controlFields, idFields, i);
            }
            
            $(tabsEle).append(tabContent);
        }

        $(dialog).append(tabsEle);
        if (idFields.length > 0) {
            config.FieldId = idFields[0].FieldName;
        }

        $('body').append(dialog);
        $('#' + config.Name + '_dialogtabs', dialog).tabs();

        for (var d = 0; d < controlFields.dropDownFields.length; d++) {
            if (controlFields.dropDownFields[d].DropDownInfo == null || controlFields.dropDownFields[d].DropDownInfo == '') {
                continue;
            }

            try {
                // Try to load the combobox the new way
                var _options = $.page.getDDInfoOptions(controlFields.dropDownFields[d]);
                $('#' + controlFields.dropDownFields[d].FieldName, dialog).ComboBox(_options);
            } catch (e) {
                // if fail try the old way
                $('#' + controlFields.dropDownFields[d].FieldName, dialog).ComboBox({
                    url: controlFields.dropDownFields[d].DropDownInfo, removedInvalid: true, addSelect: true, selectText: '',
                    valField: "Value", textField: "Text", error: controlFields.dropDownFields[d].Label, cache: false
                });
            }
        }

        for (var s = 0; s < controlFields.selectMenuFields.length; s++) {
            var field = controlFields.selectMenuFields[s];
            if (!field.DropDownInfo) {
                continue;
            }

            $.page.loadSelectMenu(dialog, field);

            if (this._isReadOnly(field)) {
                $('#' + field.FieldName, dialog).selectmenu('disable');
            }
        }

        for (var m = 0; m < controlFields.multiSelectFields.length; m++) {
            var field = controlFields.multiSelectFields[m];
            if (!field.DropDownInfo) {
                continue;
            }

            $.page.loadMultiSelect(dialog, field);

            if (this._isReadOnly(field)) {
                $('#' + field.FieldName, dialog).multiselect('disable');
            }
        }

        for (var dt = 0; dt < controlFields.dateFields.length; dt++) {
            var field = controlFields.dateFields[dt];
            if (field.ControlType == 'hidden') continue;

            var _dateFormat = 'mm/dd/yy';
            var _timeFormat = 'HH:mm:ss';
    
            var dateFormatConfigValue = $.page.getFieldProp(field, 'date-format'); //controlPros['date-format'];
            if (dateFormatConfigValue)
                _dateFormat = dateFormatConfigValue;
          

            if (field.ControlType == 'timepicker') {            
                            
                var timeFormatConfigValue = $.page.getFieldProp(field, 'time-format');  //controlPros['time-format'];
                if (timeFormatConfigValue)
                    _timeFormat = timeFormatConfigValue;
                $('#' + field.FieldName, dialog).datetimepicker({
                    showButtonPanel: true,
                    showOn: 'button',
                    timeFormat: _timeFormat,
                    dateFormat: _dateFormat
                }).next('button').text('').button({
                    icons: {
                        primary: 'ui-icon-calendar'
                    },
                    text: false
                });
            } else {
                $('#' + field.FieldName, dialog).datepicker({
                    showButtonPanel: true,
                    showOn: 'button',
                    dateFormat: _dateFormat
                }).next('button').text('').button({
                    icons: {
                        primary: 'ui-icon-calendar'
                    },
                    text: false
                });
            }

            
            if ( this._isReadOnly(field) ) {
                $('#' + field.FieldName, dialog).next('button').button('disable');
            }
        }

        this._initMoneyControls(config, dialog);

        config.NoWrapFields = controlFields.noWrapFields;
        this.dialog = dialog;
    },

    _initMoneyControls: function (config, dialog) {
        if (maskMoneyScriptLoaded()) {
            $('input.money', dialog).maskMoney(MASK_MONEY_DEFAULT_OPTS);
        }        
    },

    _initFilter: function (config) {
        var that = this;
        $(this.filter).Filter({
            pageConfig: config, initCompleteCallBack: function (json) {
                $(that.element).show();

                that.options.onFilterInitComplete(json);

                that.options.onLoadComplete(json);

                if (that.options.showLoading) {
                    that.loading.remove();
                }

            }, onFilterChangeCallBack: function (filter) {
                that.options.onFilterChange(filter);
            }
        });
    },

    _getFilterFields : function(config) {
        if (this.options.debug) console.time('_getFilterFields');
        var fields = [];

        if (config.Filter && config.Filter.Fields && config.Filter.Fields.length > 0) {
            var length = config.Filter.Fields.length;
            for (var i = 0; i < length; i++) {
                var field = {};

                var fieldId = config.Filter.Fields[i].FieldId;

                // find grid data of field
                var gridData = $.grep(config.GridFields, function (gf, i) {
                    return gf.FieldId == fieldId;
                });

                field.GridData = gridData && $.evalJSON($.toJSON(gridData[0]));

                var tabslength = config.Tabs.length;
                for (var t = 0; t < tabslength; t++) {
                    var tab = config.Tabs[t];

                    // find field data of field in tabs
                    var fieldData = $.grep(tab.Fields, function (f, i) {
                        return f.FieldId == fieldId;
                    });

                    if (fieldData.length > 0) {
                        field.FieldData = $.evalJSON($.toJSON(fieldData[0]));
                        break;
                    }
                }

                if (!field.GridData && !field.FieldData) {
                    console.error('Filter field[' + fieldId + '] not found in GridFields or Tab[].Fields.');
                    return [];
                    break;
                }

                if ($.page.common.isDateField(field.FieldData)) {
                    var isDateRage = this._getFieldProp(field.FieldData, 'filter-type') && this._getFieldProp(field.FieldData, 'filter-type') == 'date-range';
                    if (isDateRage) {
                        var from = $.evalJSON($.toJSON(field)); //cloning field
                        from.GridData.ColumnName = from.GridData.ColumnName + 'FromFilter';
                        from.FieldData.FieldName = from.FieldData.FieldName + 'FromFilter'
                        from.FieldData.Label = from.FieldData.Label + ' From:';
                        fields.push(from);

                        field.GridData.ColumnName = field.GridData.ColumnName + 'To';
                        field.FieldData.FieldName = field.FieldData.FieldName + 'To';
                        field.FieldData.Label = 'To';
                    }
                }
                
                field.FieldData.FieldName = field.GridData.ColumnName + 'Filter';
                field.GridData.ColumnName = field.GridData.ColumnName + 'Filter';
                field.FieldData.Label = field.FieldData.Label + ':';

                fields.push(field);
            }
        }

        if (this.options.debug) console.timeEnd('_getFilterFields');
        return fields;
    },

    _getTabContent: function (tab, controlFields, idFields, index) {
        var tabContent = $('<div id="tabs-' + (index + 1) + '"><table width="100%" cellspacing="0" cellpadding="0"><tbody><tr></tr></tbody></div>');

        //Creating columns
        var cols = tab.Cols;
        var colWidth = 100 / cols;
        for (var c = 0; c < cols; c++) {
            var colName = tab.TabName.replace(/ /g, '') + '_Col_' + c;
            $('tr', tabContent).append('<td id="' + colName + '" valign="top" width="' + colWidth + '%"><fieldset class="columns-' + cols + '"></fieldset></td>');
        }

        // filtering id fields
        var tabFields = tab.Fields;

        var idsInTab = jQuery.grep(tab.Fields, function (f) {
            return (f.IsId == 'True');
        });

        for (var i = 0; i < idsInTab.length; i++) {
            idFields.push(idsInTab[i]);
        }

        var length = tabFields.length;
        for (var f = 0; f < length; f++) {
            var colNum = f % cols;
            var colName = tab.TabName.replace(/ /g, '') + '_Col_' + colNum;

            if (tabFields[f].ControlType != 'hidden') {
                var label = '<label for="' + tabFields[f].FieldName + '">' + tabFields[f].Label;
                if (tabFields[f].Required == 'True') {
                    label += '<font color="red">*</font>';
                }
                label += ' :</label>';

                $('#' + colName + ' fieldset', tabContent).append(label);
            }
            $('#' + colName + ' fieldset', tabContent).append(this._getFieldContent(tabFields[f], controlFields));
        }

        return tabContent;
    },

    _getTableStyleTabContent: function (tab, controlFields, idFields, index) {
        var html = new StringBuffer();
        html.append('<table width="100%" cellspacing="0" cellpadding="0" class="table-style"><tbody>');

        var tabFields = tab.Fields;

        var idsInTab = jQuery.grep(tab.Fields, function (f) {
            return (f.IsId == 'True');
        });

        for (var i = 0; i < idsInTab.length; i++) {
            idFields.push(idsInTab[i]);
        }

        var fields = jQuery.grep(tab.Fields, function (f) {
            return (f.ControlType != 'hidden');
        });

        var count = 0;
        var length = fields.length;
        var lastRowAddedAtCount = 0;
        var labels = new StringBuffer();
        var elements = new StringBuffer();
        for (var f = 0; f < length; f++) {
            var field = fields[f];
            var colSpan = this._fieldColspan(field);
            var colWidth = 100 / tab.Cols;

            if (colSpan == null) {
                count++;
            } else {
                colWidth = colWidth * parseInt(colSpan);

                if (((count + parseInt(colSpan)) - parseInt(lastRowAddedAtCount)) > parseInt(tab.Cols)) {
                    this._appendRows(html, tab, labels, elements);

                    labels = new StringBuffer();
                    elements = new StringBuffer();

                    lastRowAddedAtCount = parseInt(lastRowAddedAtCount) + parseInt(tab.Cols);
                    count = parseInt(lastRowAddedAtCount) + parseInt(colSpan);
                } else {
                    count += parseInt(colSpan);
                }                
            }

            this._appendLabelColumn(labels, colWidth, colSpan, field);
            this._appendElementColumn(elements, colWidth, colSpan, field, controlFields);
            
            if (count % tab.Cols == 0 || f >= length - 1) {
                this._appendRows(html, tab, labels, elements);

                labels = new StringBuffer();
                elements = new StringBuffer();
                lastRowAddedAtCount = count;
            }
        }

        html.append('</tbody></table>');
        html.append(this._getHiddenFieldsHTML(tab, controlFields));
       
        var tabContent = $('<div id="tabs-' + (index + 1) + '"></div>');        
        tabContent.html(html.toString());

        this._applyControlProps(tab, tabContent, controlFields);

        return tabContent;
    },

    _appendRows: function(html, tab, labels, elements) {
        html.append('<tr class="columns-').append(tab.Cols).append('">').append(labels.toString()).append('</tr>');
        html.append('<tr class="columns-').append(tab.Cols).append('">').append(elements.toString()).append('</tr>');
    },

    _appendLabelColumn: function(labels, colWidth, colSpan, field) {
        labels.append('<td width="').append(colWidth).append('%"');

        if (colSpan != null) {
            labels.append(' colspan="').append(colSpan).append('"');
        }

        labels.append('><label for="').append(field.FieldName).append('">').append(field.Label);
        if (field.Required == 'True') {
            labels.append('<font color="red">*</font>');
        }
        labels.append(' :</label></td>');
    },

    _appendElementColumn: function (elements, colWidth, colSpan, field, controlFields) {
        elements.append('<td valign="top" width="').append(colWidth).append('%"');
        if (colSpan != null) {
            elements.append(' colspan="').append(colSpan).append('"');
        }
        elements.append('>')
        elements.append(this._getFieldHTML(field, controlFields)).append('</td>');
    },

    _applyControlProps: function (tab, tabContent, controlFields) {
        var controlPropFields = jQuery.grep(tab.Fields, function (f) {
            return (f.ControlProps);
        });

        var l = controlPropFields.length;
        for (var p = 0; p < l; p++) {
            var field = controlPropFields[p];
            var ele = $('#' + field.FieldName, tabContent);
            this._applyFieldProps(field, ele, controlFields);
        }
    },

    _applyFieldProps: function (field, ele, controlFields) {
        var controlProps = field.ControlProps;
        if (controlProps) {
            try { // Try to parse controlprops            
                var props = controlProps && $.evalJSON(controlProps);
                $.each(props, function (key, val) {
                    if (key.toLowerCase() == 'nowrap') {
                        controlFields.noWrapFields.push(clone(field));
                    }

                    //if element is wrap in a div, usually date elements
                    ele = $(ele).is('div') ? $('input', ele) : $(ele);

                    if (key.toLowerCase() == 'class') {
                        $(ele).addClass(val);
                    } else if (key == 'colSpan' || key == DEFAULT_VALUE) {
                        //do nothing
                    } else {
                        $(ele).attr(key, val).prop(key, val);
                    }
                });
            } catch (e) { /* not able to parse props*/ }
        }
    },

    _getHiddenFieldsHTML: function (tab, controlFields) {
        var hiddens = new StringBuffer();
        var hiddenFields = jQuery.grep(tab.Fields, function (f) {
            return (f.ControlType == 'hidden');
        });

        var length = hiddenFields.length;
        for (var f = 0; f < length; f++) {
            var field = hiddenFields[f];
            hiddens.append(this._getFieldHTML(field, controlFields));
        }

        return hiddens.toString();
    },

    _getFieldHTML: function (field, controlFields) {
        var html = '';
        var name = field.FieldName;
        var controlType = field.ControlType;

        if (controlType == 'selectmenu') {
            controlFields.selectMenuFields.push(field);
            html = '<select name="' + name + '" id="' + name + '" class="ui-widget-content ui-corner-all"></select>';
        } else if (controlType == 'hidden') {
            html = '<input type="hidden" name="' + name + '" id="' + name + '"/>';
        } else if ($.page.common.isDateField(field)) {
            controlFields.dateFields.push(field);
            html = '<div><input type="text" name="' + name + '" id="' + name + '" class="text ui-widget-content ui-corner-all" /></div>';
        } else if (controlType == 'inputbox') {
            html = '<input type="text" name="' + name + '" id="' + name + '" class="text ui-widget-content ui-corner-all" />';
        } else if (controlType == 'dropdownlist') {
            controlFields.dropDownFields.push(field);
            html = '<select name="' + name + '" id="' + name + '" class="ui-widget-content ui-corner-all"></select>';
        } else if (controlType == 'multiselect') {
            controlFields.multiSelectFields.push(field);
            html = '<select name="' + name + '" id="' + name + '" class="ui-widget-content ui-corner-all" multiple="multiple" size="1"></select>';
        } else if (controlType == 'checkbox') {
            html = '<input type="checkbox" name="' + name + '" id="' + name + '" class="ui-widget-content ui-corner-all" />';
        } else if (controlType == 'multiline') {
            html = '<textarea rows="3" name="' + name + '" id="' + name + '" class="text ui-widget-content ui-corner-all" ></textarea>';
        } else {
            //default
            html = '<input type="text" name="' + name + '" id="' + name + '" class="text ui-widget-content ui-corner-all" />';
        }
       
        return html;
    },

    _getFieldContent: function (field, controlFields) {
        var ele = $(this._getFieldHTML(field, controlFields));
        this._applyFieldProps(field, ele, controlFields);

        return ele;
    },

    _fieldColspan: function(field) {
        return this._getFieldProp(field, 'colSpan');
    },

    _getFieldProp: function (field, prop) {
        return $.page.getFieldProp(field, prop);
    },

    _isReadOnly : function (field) {
        var readonly = this._getFieldProp(field, 'readonly');
        return readonly && (readonly == 'true' || readonly == true);
    },

    getConfig: function () {
        return this.config;
    },

    getTable: function () {
        return this.table;
    },

    getDialog: function () {
        return this.dialog;
    },

    getFilter: function () {
        return this.filter;
    },

    _destroy: function () {
        //TODO: implement destroy
    }

});

$.widget('epe.Filter', {
    //defaults
    options: {
        debug:false,
        pageConfig: null,
        initCompleteCallBack: function (config) { },
        onFilterChangeCallBack: function (filter) { }
    },

    _create: function () {
        if (!this.options.pageConfig) return;

        var that = this;        
        var config = this.options.pageConfig;

        var selectMenus = $.map(config.Filter.Fields, function (f, i) {
            return f.FieldData.ControlType == 'selectmenu' ? '#' + f.GridData.ColumnName : null;
        });

        var ddlMenus = $.map(config.Filter.Fields, function (f, i) {
            return f.FieldData.ControlType == 'dropdownlist' ? f.FieldData : null;
        });

        var multiselects = $.map(config.Filter.Fields, function (f, i) {
            return f.FieldData.ControlType == 'multiselect' ? f.FieldData : null;
        });

        var _filterDateFormat = 'mm/dd/yy';
        var _filterTimeFormat = 'HH:mm:ss';
        
        $.page.initSelectMenu(selectMenus.join(','));
        this._initComboBoxes(ddlMenus);
        this._initMultiSelects(multiselects);

        var length = config.Filter.Fields.length;
        var promises = [];
        for (var s = 0; s < length; s++) {
            var f = config.Filter.Fields[s];
            if (f.FieldData.ControlType == 'selectmenu') {
                var promise = $.page.loadSelectMenu($(this.element), f.FieldData);
                promises.push(promise);
            } else if (f.FieldData.ControlType == 'dropdownlist') {
                var promise = this._initComboBox(f.FieldData);
                promises.push(promise);
            } else if (f.FieldData.ControlType == 'multiselect') {
                var promise = $.page.loadMultiSelect($(this.element), f.FieldData);
                promises.push(promise);
            } else if ($.page.common.isDateField(f.FieldData)) {
               
                var dateFormatConfigValue = $.page.getFieldProp(f.FieldData, 'date-format');
                if (dateFormatConfigValue)
                    _filterDateFormat = dateFormatConfigValue;

                if (f.FieldData.ControlType == 'timepicker') {
                
                    var timeFormatConfigValue = $.page.getFieldProp(f.FieldData, 'time-format');  //controlPros['time-format'];
                    if (timeFormatConfigValue)
                        _filterTimeFormat = timeFormatConfigValue;
                
                    $('#' + f.GridData.ColumnName, $(this.element)).datetimepicker({
                        showButtonPanel: true,
                        showOn: 'button',
                        timeFormat: _filterTimeFormat,
                        dateFormat: _filterDateFormat,
                        onClose: function () {
                            that._filterChange();
                        }
                    }).next('button').text('').button({
                        icons: {
                            primary: 'ui-icon-calendar'
                        },
                        text: false
                    });

                    $('#' + f.GridData.ColumnName, $(this.element)).addClass('hasTimePicker');
                } else {
                    $('#' + f.GridData.ColumnName, $(this.element)).datepicker({
                        showButtonPanel: true,
                        showOn: 'button',
                        dateFormat: _filterDateFormat,
                    }).next('button').text('').button({
                        icons: {
                            primary: 'ui-icon-calendar'
                        },
                        text: false
                    });
                }                
            }
        }

        $('#clearFilter', this.element).button({ icons: { primary: 'ui-icon-cancel' } }).click(function () {        
            that.clear();
            that._filterChange();
        });

        $('select.selectMenu', this.element).selectmenu({
            change: function (event, ui) { that._filterChange(); }
        });

        if (multiselectScriptLoaded()) {
            $('select.multiselect', this.element).multiselect({
                close: function () {
                    that._filterChange();
                }
            });
        }

        $('input[type=text]', this.element).change(function () {
            that._filterChange();
        }).keydown(function () {
            if ((event.type == 'keydown' && event.keyCode == 13)) {
                that._filterChange();
                event.preventDefault();
            }
        });

        $('input.hasTimePicker', this.element).off('change');

        var that = this;
        //raise init complete
        if (promises.length == 0) {
            this._FILTER = this._createFilter(this.element);

            if (this.options.debug) console.log('Filter = ' + $.toJSON(this._FILTER));
            that._setDefaultValues(that.options.pageConfig);
            that.options.initCompleteCallBack(that.options.pageConfig);
        } else {
            $.when.apply($, promises).done(function () {
                that._FILTER = that._createFilter(that.element);
                if (that.options.debug) console.log('Filter = ' + $.toJSON(that._FILTER));
                that._setDefaultValues(that.options.pageConfig);
                that.options.initCompleteCallBack(that.options.pageConfig);
            });
        }
    },

    _filterChange: function () {        
        if (this._FILTER == null) this._FILTER = {}; //not yet initialize, setting filter to empty object
        var newFilter = this._createFilter(this.element);
        if ($.toJSON(this._FILTER) == $.toJSON(newFilter)) return; // no changes in filter

        $('#' + this.options.pageConfig.Name + '_filter').attr('firsttime', 'false');//change flag to reset server params
        this._FILTER = newFilter;
        var config = this.options.pageConfig;
        var columns = config.GridFields;
        var oTable = $('#' + config.Name + '_table').DataTable();

        var uniqueCols = [];
        var ctlOptions = $('#' + config.Name + '_table').Catalog('getTableOptions');

        if (!ctlOptions.bServerSide && exists('#' + this.options.pageConfig.Name + '_filter')) {
            var dateColumns = $.grep(config.Filter.Fields, function (field) {
                return field.FieldData.ControlProps.indexOf('date-range') != -1;
            });

            uniqueCols = $.unique(dateColumns.map(function (col) {
                return col.FieldData.FieldName.replace('FromFilter', '').replace('ToFilter', '');
            }));
        }

        $.each(this._FILTER, function (key, val) {
            var index = getArrayIndexForKey(columns, 'ColumnName', key);
            if (index != -1 && uniqueCols.indexOf(key) == -1) oTable.columns(index).search(val);
        });
        
        oTable.draw();

        this.options.onFilterChangeCallBack(newFilter);
    },

    _createFilter : function() {
        return $.page.filter.createFilter(this.element);
    },

    _initComboBoxes: function (fields) {
        if (!fields) return;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            $('#' + field.FieldName).empty();
            $('#' + field.FieldName).append($('<option selected></option>').attr('value', 'Loading...').text('Loading...'));

            var _options = $.page.getDDInfoOptions(field);
            $('#' + field.FieldName, this.element).ComboBox(_options);

            var that = this;
            $('#' + field.FieldName, this.element).change(function () { that._filterChange(); });
        }
    },

    _initComboBox: function (field) {
        var that = this;
        var ddInfo = $.evalJSON(field.DropDownInfo);
        var _options = $.page.getDDInfoOptions(field);
        if (_options.cache) {
            return $.when($.getData(_options.url)).done(function (json) {
                $('#' + field.FieldName, that.element).ComboBox('reload', _options);
            });
        } else {
            return $.ajax({
                url: _options.url,
            }).done(function (json) {
                $('#' + field.FieldName, that.element).ComboBox('reload', _options);
            });
        }
    }, 

    _initMultiSelects: function (fields) {
        if (!fields) return;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var ddInfo = $.evalJSON(field.DropDownInfo);
            $.page.initMultiselect($('#' + field.FieldName), ddInfo);
        }
    },

    _setDefaultValues: function (config) {
        if (!(config && config.Filter && config.Filter.Fields)) return;
        var fields = [];

        var _results = jQuery.grep(config.Filter.Fields, function (field, i) {
            var _data = field.FieldData.ControlProps;
            return (_data.toLowerCase().indexOf(FILTER_DEFAULT_VALUE.toLowerCase()) != -1)
        });

        fields = fields.concat(_results);
        for (var f = 0; f < fields.length; f++) {
            this._setFieldValue(fields[f]);
        }
    },

    _setFieldValue: function (_field) {
        var field = _field.FieldData;
        var controlPros = $.evalJSON(field.ControlProps);
        var _value = controlPros[FILTER_DEFAULT_VALUE];
        if (!_value) return;

        if (startsWith(_value, 'js:')) {
            _value = _value.substring(3);
            _value = eval('(' + _value + ')');
        }

        var _field = $('#' + field.FieldName);

        if (field.ControlType == 'selectmenu' && $('#' + field.FieldName).hasClass('selectMenu')) {
            _field.val(_value).selectmenu('refresh');
        } else if (field.ControlType == 'dropdownlist') {
            _field.ComboBox('value', _value);
        } else if (field.ControlType == 'checkbox') {
            _field.prop('checked', isTrue(_value));
        } else {
            _field.val(_value);
        }
    },

    clear: function() {
        $('input,select', this.element).val('');
        $('select.selectMenu', this.element).selectmenu('refresh', true);
        $('select[firstoptionval]', this.element).each(function () {
            $(this).val($(this).attr('firstoptionval')).selectmenu('refresh', true);
        });

        if (multiselectScriptLoaded()) {
            $('select.multiselect', this.element).each(function (ele) {
                $(this).multiselect('uncheckAll');
                $.page.refreshMultiselect($(this));
            });
        }
    },

    refresh: function() {
        this._FILTER = {};
        this._filterChange();
    },

    setFilter: function(_newFilter) {
        this._FILTER = _newFilter;
    },

    getFilter: function () {
        return this._FILTER;
    },

    _destroy: function () {
        //TODO: implement destroy
    }
});

$.page = {};

$.page.common = {};

$.page.common.isDateField = function (field) {
    return (field.Type.indexOf('date') != -1 || field.Type.indexOf('time') != -1) && field.ControlType != 'hidden';
}

$.page.getFieldProp = function (field, prop) {
    var controlProps = field.ControlProps;
    if (controlProps) {
        try { // Try to parse controlprops
            var props = controlProps && $.evalJSON(controlProps);
            if (props[prop]) return props[prop];
        } catch (e) { /* not able to parse props*/ }
    }

    return null;
}

$.page.initSelectMenu = function (selector) {
    $(selector).addClass('selectMenu').attr('load-complete', 'false');
    $(selector).empty().append($('<option></option>').attr('value', '').text('Loading..'));
    $(selector).selectmenu().selectmenu("menuWidget").addClass("select-menu-overflow");
}

$.page.initMultiselect = function (element, ddInfo) {
    var _header = (ddInfo.header && ddInfo.header == true) ? true : false;

    element.addClass('multiselect').attr('load-complete', 'false').empty();
    element.append($('<option></option>').attr('value', '').text('Loading..'));

    if (ddInfo.filter && ddInfo.filter == true) {
        element.multiselect({ header: _header }).multiselectfilter();
    } else {
        element.multiselect({ header: _header });
    }
    
    element.multiselect('getButton').width('92.5%').css('padding-top', '0.4em').css('padding-bottom', '0.4em');
    element.multiselect('widget').width(element.multiselect('getButton').width());

    return element; //returns element to allow method concatenation
}

$.page.loadSelectMenu = function (dialog, selectMenu) {
    var ddInfo = $.evalJSON(selectMenu.DropDownInfo);    
    var element = $('#' + selectMenu.FieldName, dialog);
    
    if(!element.hasClass('selectMenu')) {
        element.addClass('selectMenu').attr('load-complete', 'false').empty();
        element.append($('<option></option>').attr('value', '').text('Loading..')).selectmenu();
    }
    element.selectmenu('setOptions', ddInfo);
    if (ddInfo.cache != null && (ddInfo.cache == true || ddInfo.cache == 'true')) {
        return $.Deferred(function( dfd ) {
            $.when($.getData(ddInfo.url)).done(function (json) {
                element.selectmenu('setData', json.aaData || []);
                $.page.createSelectMenuOptions(element, json, ddInfo);
                dfd.resolve();
            });
        }).promise();        
    }


    return $.Deferred(function( dfd ) {
        $.ajax({
            url: ddInfo.url,
        }).done(function (json) {
            element.selectmenu('setData', json.aaData || []);
            $.page.createSelectMenuOptions(element, json, ddInfo);
            dfd.resolve();
        });
    }).promise();
}

$.page.loadMultiSelect = function (dialog, multiSelect) {
    var ddInfo = $.evalJSON(multiSelect.DropDownInfo);
    var element = $('#' + multiSelect.FieldName, dialog);
    
    if (!element.hasClass('multiselect')) {
        $.page.initMultiselect($('#' + multiSelect.FieldName), ddInfo);
    }

    if (ddInfo.cache != null && (ddInfo.cache == true || ddInfo.cache == 'true')) {
        return $.Deferred(function (dfd) {
            $.when($.getData(ddInfo.url)).done(function (json) {
                $.page.createSelectOptions(element, json, ddInfo);
                $.page.refreshMultiselect(element);
                dfd.resolve();
            });
        }).promise();
    }

    return $.Deferred(function (dfd) {
        $.ajax({
            url: ddInfo.url,
        }).done(function (json) {
            $.page.createSelectOptions(element, json, ddInfo);
            $.page.refreshMultiselect(element);
            dfd.resolve();
        });
    }).promise();
}

$.page.createSelectMenuOptions = function (element, json, ddInfo) {    
    var _defaultddInfo = { addEmptyOption: true };
    ddInfo = $.extend(_defaultddInfo, ddInfo);
    if (($.isArray(json) && json.length > 0) || (json.aaData && json.aaData.length > 0)) {
        $.page.createSelectOptions(element, json, ddInfo);

        //adding empty option at the begining of the list
        if (ddInfo.addEmptyOption) {
            var firstOptionValue = '';
            if (ddInfo.firstOptionVal) {
                firstOptionValue = ddInfo.firstOptionVal;
                element.attr('firstOptionVal', ddInfo.firstOptionVal);
            }

            $('<option>').attr('value', firstOptionValue).insertBefore(element.find('option:first'));
            if (!ddInfo.selectedVal && !ddInfo.selectedText) {
                element.find('option:first').attr('selected', 'selected');
            }
        }
        
        element.selectmenu('refresh').selectmenu('menuWidget').addClass('select-menu-overflow');
        element.attr('load-complete', 'true');

        if (jQuery.isFunction(ddInfo.onChange)) {
            element.selectmenu({
                change: function (event, ui) {
                    ddInfo.onChange();
                }
            });
        }

        if (jQuery.isFunction(ddInfo.onCompleted)) {
            ddInfo.onCompleted();
        }
    } else {
        element.empty().attr('load-complete', 'true');
        element.append($('<option>').attr('value', '')).selectmenu('refresh');
    }
}

$.page.createSelectOptions = function (element, json, ddInfo) {
    var list = $.isArray(json) ? json : json.aaData;

    $.page.sortList(list, ddInfo);

    element.empty();
    var length = list.length;
    for (var i = 0; i < length; i++) {
        element.append($.page.createOption(list[i], ddInfo));
    }
}

$.page.createOption = function (obj, ddInfo) {
    var option = $('<option></option>');
    var text = $.page.getOptionText(obj, ddInfo);

    if ((ddInfo.selectedText && ddInfo.selectedText.toUpperCase() == obj[ddInfo.textField].toUpperCase()) ||
            (ddInfo.selectedVal && ddInfo.selectedVal == obj[ddInfo.valField])) {
        option.attr('selected', 'true');
    }
    
    $.page.setOptionExtraAttr(option, obj, ddInfo);

    return option.attr('value', obj[ddInfo.valField]).text(text);
}

$.page.getOptionText = function (obj, ddInfo) {
    var text = obj[ddInfo.textField];

    if ($.isArray(ddInfo.textField) || ddInfo.textField.indexOf(',') != -1) {
        text = '';
        var concatChar = ddInfo.concatChar ? ddInfo.concatChar + ' ' : ', ';
        var array = $.isArray(ddInfo.textField) ? ddInfo.textField : ddInfo.textField.split(',');
        for (var t = 0; t < array.length; t++) {
            text = text + $.trim(obj[array[t]]) + concatChar;
        }

        text = text.substring(0, text.length - concatChar.length);
    }

    return $.trim(text);
}

$.page.setOptionExtraAttr = function (option, obj, ddInfo) {
    if (ddInfo.extraAttrs) {
        var attrs = ddInfo.extraAttrs.split(',');
        for (var a = 0; a < attrs.length; a++) {
            var attr = attrs[a];
            option.attr(attr, obj[attr]);
        }
    }
}

$.page.getDDInfoOptions = function (field) {
    var _defaultOpts = {
        url: '', removedInvalid: true, addSelect: true, selectText: '', sortByField: '',
        valField: '', textField: '', error: field.Label,
        cache: false
    };

    var ddInfo = $.evalJSON(field.DropDownInfo);
    return $.extend(_defaultOpts, ddInfo);
}

$.page.sortList = function (list, ddInfo) {
    var sortInfo = {};
    sortInfo.sortField = ddInfo.textField;
    sortInfo.sortType = 'TEXT';
    sortInfo.sortDir = 'ASC';

    if (!_isNullOrEmpty(ddInfo.sortBy)) {
        sortInfo.sortField = ddInfo.sortBy;
    }

    if (!_isNullOrEmpty(ddInfo.sortType)) {
        sortInfo.sortType = ddInfo.sortType;
    }

    if (!_isNullOrEmpty(ddInfo.sortDir)) {
        sortInfo.sortDir = ddInfo.sortDir;
    }

    list.sort(function (a, b) {
        return $.page.sortItems(a, b, sortInfo);
    });
}

$.page.sortItems = function (a, b, sortInfo) {
    var a1 = a[sortInfo.sortField], b1 = b[sortInfo.sortField];
    if (sortInfo.sortType.toUpperCase() == 'DATE') {
        a1 = new Date(a1);
        b1 = new Date(b1);
    } else if (sortInfo.sortType.toUpperCase() == 'INT') {
        a1 = parseInt(a1);
        b1 = parseInt(b1);
    } else {
        var array = sortInfo.sortField.split(',');
        a1 = '', b1 = '';
        for (var i = 0; i < array.length; i++) {
            a1 += a[array[i]];
            b1 += b[array[i]];
        }
    }

    if (a1 == b1) return 0;

    if (sortInfo.sortDir.toUpperCase() == 'DESC') {
        return a1 < b1 ? 1 : -1;
    }

    return a1 > b1 ? 1 : -1;
}

$.page.refreshMultiselect = function (element) {
    element.selectedIndex = -1;
    element.multiselect('refresh');
    //TODO: move this to css
    element.multiselect('getButton').width('92.5%').css('padding-top', '0.4em').css('padding-bottom', '0.4em');
    element.multiselect('widget').width(element.multiselect('getButton').width());
    element.addClass('multiselect').attr('load-complete', 'true');
    return element;
}

$.page.filter = {};

$.page.filter.createFilter = function (filterEle) {
    var filter = {};

    $('input[type=text], select.selectMenu, input:checkbox, select.combobox, input[type=hidden], select.multiselect', filterEle).each(function (index) {
        if ($(this).attr('id').indexOf('Filter') != -1) {
            var key = $(this).attr('id').replace('Filter', '');
            if ($(this).hasClass('multiselect')) {
                $.page.filter.setMultiSelectVal(filter, this);
            } else if ($(this).attr('filter-type') == 'text') {
                filter[key] = $.trim($('option:selected', $(this)).text());
            } else if ($(this).attr('filter-type') == 'date-range') {
                $.page.filter.setDateRangeFilterVal(filter, this);
            } else {
                filter[key] = $.trim($(this).val());
            }

            if ($(this).hasClass('multiselect') && filter[key]) {
                filter[key] = 'LIST_' + filter[key];
            }
        }
    });

    return filter;
}

$.page.filter.setDateRangeFilterVal = function (filter, ele) {
    var _id = $(ele).attr('id').replace('From', '').replace('To', '').replace('Filter', '');
    if ($.trim($('#' + _id + 'FromFilter').val()) != '' || $.trim($('#' + _id + 'ToFilter').val()) != '') {
        filter[_id] = $.trim($('#' + _id + 'FromFilter').val()) + '_RANGE_' + $.trim($('#' + _id + 'ToFilter').val());
    } else {
        filter[_id] = '';
    }    
}

$.page.filter.setMultiSelectVal = function (filter, ele) {
    var _id = $(ele).attr('id').replace('Filter', '');
    if ($(ele).attr('filter-type') == 'text') {

        filter[_id] = $.map($('#' + $(ele).attr('id')).multiselect('getChecked'), function (opt) {
            return $.trim($(opt).next('span').html());
        }).join(',');

    } else {

        filter[_id] = $.map($('#' + $(ele).attr('id')).multiselect('getChecked'), function (opt) {
            return $(opt).val();
        }).join(',');

    }
}

$.page.filter.getFilterField = function (config, fieldName) {
    for (var i = 0; i < config.Filter.Fields.length; i++) {
        var field = config.Filter.Fields[i].FieldData;
        if (field.FieldName == fieldName) {
            return field;
        }
    }
}

$.widget('ui.selectmenu', $.ui.selectmenu, {
    _create: function () {
        this._super();
        this._setTabIndex();
    },
    _setTabIndex: function () {
        this.button.attr('tabindex',
            this.options.disabled ? -1 :
            this.element.attr('tabindex') || 0);
    },
    _setOption: function (key, value) {
        this._super(key, value);
        if (key === 'disabled') {
            this._setTabIndex();
        }
    },
    setData: function (_list) {
        //mutator
        this.list = _list;
    },
    getData: function () {
        //accessor
        return this.list;
    },
    setOptions: function (_opts) {
        //mutator
        this.ddinfo = _opts;
    },
    getOptions: function () {
        //accessor
        return this.ddinfo;
    }
});

function getSelectmenuId(_selecmenu, _text) {
    var _items = $(_selecmenu).selectmenu('getData');

    for (var i = 0; i < _items.length; i++) {
        var item = _items[i];
        if (item.Text == _text) {
            return item.ItemId;
        }
    }

    return '';
}