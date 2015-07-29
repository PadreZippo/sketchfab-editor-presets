// ==UserScript==
// @name          Sketchfab Post-Process Presets
// @namespace     https://github.com/PadreZippo/post-processing-presets-sketchfab
// @version       0.0.3
// @updateURL     https://raw.githubusercontent.com/PadreZippo/post-processing-presets-sketchfab/master/user.js
// @downloadURL   https://raw.githubusercontent.com/PadreZippo/post-processing-presets-sketchfab/master/user.js
// @description   Stores post-processing presets
// @include       https://sketchfab.com/models/*/edit
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_listValues
// @grant         GM_deleteValue
// ==/UserScript==

console.log('Editor extras injected');
console.log('Custom presets: ' + GM_listValues());

/**
 * https://github.com/gamtiq/extend
 ******************************************************************************/

(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require, exports, module);
    }
    else if(typeof define === 'function' && define.amd) {
        define(['require', 'exports', 'module'], factory);
    }
    else {
        var req = function(id) {return root[id];},
            exp = root,
            mod = {exports: exp};
        root['extend'] = factory(req, exp, mod);
    }
}(this, function(require, exports, module) {
    /**
     * @module extend
     */

    /**
     * Inherit one class (constructor function) from another by using prototype inheritance.
     * Based on <code>extend</code> method from YUI library.
     * <br>
     * Set the following static fields for child class:
     * <ul>
     * <li><code>superconstructor</code> - reference to parent class
     * <li><code>superclass</code> - reference to <code>prototype</code> of parent class
     * </ul>
     *
     * @param {Function} SubClass
     *      Child class that will inherit.
     * @param {Function} ParentClass
     *      Parent class.
     * @return {Function}
     *      Modified child class.
     */
    function extend(SubClass, ParentClass) {
        "use strict";
        function F() {}
        F.prototype = ParentClass.prototype;
        SubClass.prototype = new F();
        SubClass.prototype.constructor = SubClass;
        SubClass.superclass = ParentClass.prototype;
        SubClass.superconstructor = ParentClass;
        return SubClass;
    }

    /**
     * Test whether the specified class is inherited from another.
     *
     * @param {Function} subClass
     *      The class that should be tested.
     * @param {Function} parentClass
     *      The parent class.
     * @return {Boolean}
     *      <code>true</code>, if <code>subClass</code> is inherited from <code>parentClass</code>,
     *      otherwise <code>false</code>.
     * @author Denis Sikuler
     * @see suifw#extend
     */
    extend.isSubclass = function isSubclass(subClass, parentClass) {
        "use strict";
        if (typeof parentClass === "function" && typeof subClass === "function") {
            var superClass = subClass;
            while (superClass = superClass.superconstructor) {
                if (superClass === parentClass) {
                    return true;
                }
            }
        }
        return false;
    };

    // Exports

    module.exports = extend;

    return extend;
}));

/**
 * Presets
 ******************************************************************************/

function buildPresets() {

    // Default Presets
    var presets = [

            // No Filters
            {
                "name": "No Filters",
                "settings": {
                    "sharpen": {
                        "enable": false,
                        "factor": 0
                    },
                    "chromaticAberration": {
                        "enable": false,
                        "factor": 0
                    },
                    "vignette": {
                        "enable": false,
                        "amount": 0,
                        "hardness": 0
                    },
                    "bloom": {
                        "enable": false,
                        "threshold": 0,
                        "factor": 0,
                        "radius": 0
                    },
                    "toneMapping": {
                        "enable": false,
                        "method": "linear",
                        "exposure": 0,
                        "brightness": 0,
                        "contrast": 0,
                        "saturation": 0
                    },
                    "colorBalance": {
                        "enable": false,
                        "low": [0, 0, 0],
                        "mid": [0, 0, 0],
                        "high": [0, 0, 0],
                    }
                }
            },
            //Flat
            {
                "name": "Flat",
                "settings": {
                    "sharpen": {
                        "enable": true,
                        "factor": 0
                    },
                    "chromaticAberration": {
                        "enable": true,
                        "factor": 0
                    },
                    "vignette": {
                        "enable": true,
                        "amount": 0,
                        "hardness": 0
                    },
                    "bloom": {
                        "enable": true,
                        "threshold": 0,
                        "factor": 0,
                        "radius": 0
                    },
                    "toneMapping": {
                        "enable": true,
                        "method": "linear",
                        "exposure": 0,
                        "brightness": 0,
                        "contrast": 0,
                        "saturation": 0
                    },
                    "colorBalance": {
                        "enable": true,
                        "low": [0, 0, 0],
                        "mid": [0, 0, 0],
                        "high": [0, 0, 0],
                    }
                }
            },

            // 3D scan enhance
            {
                "name": "3D Scan Enhance",
                "settings": {
                    "sharpen": {
                        "enable": true,
                        "factor": 20
                    },
                    "chromaticAberration": {
                        "enable": false,
                        "factor": 0
                    },
                    "vignette": {
                        "enable": false,
                        "amount": 0,
                        "hardness": 0
                    },
                    "bloom": {
                        "enable": false,
                        "threshold": 0,
                        "factor": 0,
                        "radius": 0
                    },
                    "toneMapping": {
                        "enable": true,
                        "method": "linear",
                        "exposure": 10,
                        "brightness": 10,
                        "contrast": 30,
                        "saturation": 20
                    },
                    "colorBalance": {
                        "enable": false,
                        "low": [0, 0, 0],
                        "mid": [0, 0, 0],
                        "high": [0, 0, 0],
                    }
                }
            },

            // Black & white
            {
                "name": "Black & White",
                "settings": {
                    "sharpen": {
                        "enable": false,
                        "factor": 0
                    },
                    "chromaticAberration": {
                        "enable": false,
                        "factor": 0
                    },
                    "vignette": {
                        "enable": false,
                        "amount": 0,
                        "hardness": 0
                    },
                    "bloom": {
                        "enable": false,
                        "threshold": 0,
                        "factor": 0,
                        "radius": 0
                    },
                    "toneMapping": {
                        "enable": true,
                        "method": "filmic",
                        "exposure": 0,
                        "brightness": 0,
                        "contrast": 0,
                        "saturation": -100
                    },
                    "colorBalance": {
                        "enable": false,
                        "low": [0, 0, 0],
                        "mid": [0, 0, 0],
                        "high": [0, 0, 0],
                    }
                }
            },

            // Vintage
            {
                "name": "Vintage",
                "settings": {
                    "sharpen": {
                        "enable": false,
                        "factor": 0
                    },
                    "chromaticAberration": {
                        "enable": false,
                        "factor": 0
                    },
                    "vignette": {
                        "enable": true,
                        "amount": 35,
                        "hardness": 90
                    },
                    "bloom": {
                        "enable": true,
                        "threshold": 100,
                        "factor": 10,
                        "radius": 100
                    },
                    "toneMapping": {
                        "enable": true,
                        "method": "reinhard",
                        "exposure": 0,
                        "brightness": 50,
                        "contrast": -30,
                        "saturation": -60
                    },
                    "colorBalance": {
                        "enable": true,
                        "low": [0, 0, -2],
                        "mid": [40, 0, -20],
                        "high": [0, 0, -30],
                    }
                }
            },

            // The Matrix
            {
                "name": "The Matrix",
                "settings": {
                    "sharpen": {
                        "enable": true,
                        "factor": 30
                    },
                    "chromaticAberration": {
                        "enable": true,
                        "factor": 100
                    },
                    "vignette": {
                        "enable": true,
                        "amount": 35,
                        "hardness": 90
                    },
                    "bloom": {
                        "enable": true,
                        "threshold": 100,
                        "factor": 10,
                        "radius": 100
                    },
                    "toneMapping": {
                        "enable": true,
                        "method": "linear",
                        "exposure": 30,
                        "brightness": 0,
                        "contrast": 0,
                        "saturation": 30
                    },
                    "colorBalance": {
                        "enable": true,
                        "low": [0, 100, 0],
                        "mid": [0, 100, 0],
                        "high": [0, 100, 0],
                    }
                }
            },

            // Hollywood
            {
                "name": "Hollywood",
                "settings": {
                    "sharpen": {
                        "enable": true,
                        "factor": 20
                    },
                    "chromaticAberration": {
                        "enable": true,
                        "factor": 10
                    },
                    "vignette": {
                        "enable": true,
                        "amount": 0,
                        "hardness": 0
                    },
                    "bloom": {
                        "enable": true,
                        "threshold": 10,
                        "factor": 20,
                        "radius": 50
                    },
                    "toneMapping": {
                        "enable": true,
                        "method": "filmic",
                        "exposure": 20,
                        "brightness": 0,
                        "contrast": 20,
                        "saturation": 20
                    },
                    "colorBalance": {
                        "enable": true,
                        "low": [-1, -0.6, 0],
                        "mid": [0, 0, 0],
                        "high": [30, 15, -10],
                    }
                }
            },

            // Washed out
            {
                "name": "Washed Out",
                "settings": {
                    "sharpen": {
                        "enable": false,
                        "factor": 0
                    },
                    "chromaticAberration": {
                        "enable": false,
                        "factor": 0
                    },
                    "vignette": {
                        "enable": false,
                        "amount": 0,
                        "hardness": 0
                    },
                    "bloom": {
                        "enable": false,
                        "threshold": 0,
                        "factor": 0,
                        "radius": 0
                    },
                    "toneMapping": {
                        "enable": true,
                        "method": "reinhard",
                        "exposure": 0,
                        "brightness": 100,
                        "contrast": -65,
                        "saturation": -60
                    },
                    "colorBalance": {
                        "enable": true,
                        "low": [-0.5, -0.5, 2],
                        "mid": [0, 0, 0],
                        "high": [0, 0, 0],
                    }
                }
            }
        ],

        // Stored presets
        userValues = GM_listValues();

    if (userValues.length) {
        for (var i = 0; i < userValues.length; i++) {
            var presetName = userValues[i];
            presets.push(JSON.parse(GM_getValue(presetName)));
        }
    }

    return presets;
}

// Delete GM values
function deletePreset() {

    var keys = GM_listValues(),
        preset = $('select[name="presets"] option:selected').text();

    if (keys.indexOf(preset) != -1) {
        GM_deleteValue(preset);
        loadPresets();
    } else {
        console.log('preset name mismatch during delete');
    }
}

function exportPreset() {
    var presets = buildPresets(),
        preset = $('select[name="presets"] option:selected').text();

    for ( var i = 0; i < presets.length; i++ ) {
        if (presets[i].name == preset) {
            prompt('Preset JSON:', JSON.stringify(presets[i]));
            break;
        }
    }
}

function importPreset () {
    var preset = prompt('Preset JSON?'),
        presetOBJ = JSON.parse(preset);

    if(presetOBJ.hasOwnProperty('name') && presetOBJ.hasOwnProperty('settings')) {
        GM_setValue(presetOBJ.name, preset);
        loadPresets();
    } else {
        console.log('preset not formatted correctly');
    }

}

function applyPreset(index) {

    var presets = buildPresets(),
        preset = presets[index].settings;

    $widgets = $('#PostProcessGroup > .widget-wrapper > .inner > .vertical-widget > .widget-wrapper > .children > .widget');

    $widgets.each(function(index) {
        switch (index) {
            case 0:
                sharpen($(this), preset.sharpen.enable, preset.sharpen.factor);
                break;
            case 1:
                chromaticAberration($(this), preset.chromaticAberration.enable, preset.chromaticAberration.factor);
                break;
            case 2:
                vignette($(this), preset.vignette.enable, preset.vignette.amount, preset.vignette.hardness);
                break;
            case 3:
                bloom($(this), preset.bloom.enable, preset.bloom.threshold, preset.bloom.factor, preset.bloom.radius);
                break;
            case 4:
                toneMapping($(this), preset.toneMapping.enable, preset.toneMapping.method, preset.toneMapping.exposure, preset.toneMapping.brightness, preset.toneMapping.contrast, preset.toneMapping.saturation);
                break;
            case 5:
                colorBalance($(this), preset.colorBalance.enable, preset.colorBalance.low, preset.colorBalance.mid, preset.colorBalance.high);
        }
    });
}

/**
 * Widgets manipulation
 ******************************************************************************/

function Group($el){
    this.$el = $el;
}
Group.prototype.getName = function() {
    return this.$el.children('.widget-wrapper').children('.header').children('.label').text();
}
Group.prototype.isEnabled = function(){
    return this.$el.hasClass('active');
};
Group.prototype.enable = function(){
    if (!this.isEnabled()) {
        this.$el.find('.state').trigger('click');
    }
};
Group.prototype.disable = function(){
    if (this.isEnabled()) {
        this.$el.find('.state').trigger('click');
    }
};

function NumberSlider($el) {
    this.$el = $el;
}
NumberSlider.prototype.getValue = function() {
    return this.$el.find('.number-widget input.value').val();
}
NumberSlider.prototype.setValue = function(value) {
    this.$el.find('.number-widget input.value').val(value).trigger('change');
}

function ImageNumberSlider($el) {
    this.$el = $el;
}
extend(ImageNumberSlider, NumberSlider);
ImageNumberSlider.prototype.getColor = function() {
    return this.$el.find('.selectbox .panels .panel:last-child .value').val();
}
ImageNumberSlider.prototype.setColor = function(rgbString) {
    if (rgbString.length < 6) {
        return;
    }
    if (rgbString.indexOf('#') === -1) {
        rgbString = '#' + rgbString;
    }
    rgbString = rgbString.toUpperCase();
    this.$el.find('.selectbox .panels .panel:last-child .value').val(rgbString).trigger('change');
}

function enableGroup(group) {
    if (!group.hasClass('active')) {
        group.find('.state').trigger('click');
    }
}

function ToggleButton($el) {
    this.$el = $el;
}
ToggleButton.prototype.getValue = function() {
    var $active = this.$el.find('.option.active');
    return $active.attr('data-value');
}
ToggleButton.prototype.getValues = function() {
    var values = []
    $.map(this.$el.find('.option'), function(el, i){
        values.push($(el).attr('data-value'));
    });
    return values;
}
ToggleButton.prototype.setValue = function(value) {
    if (this.getValue() !== String(value)) {
        this.$el.find('.option[data-value="' + value + '"]').trigger('click');
    }
}

function Checkbox($el) {
    this.$el = $el;
}
Checkbox.prototype.isChecked = function(){
    var value = this.$el.hasClass('active');
    return value;
}
Checkbox.prototype.check = function() {
    if (!this.isChecked()) {
        this.$el.find('.state').trigger('click');
    }
}
Checkbox.prototype.uncheck = function() {
    if (this.isChecked()) {
        this.$el.find('.state').trigger('click');
    }
}
Checkbox.prototype.setValue = function(checked) {
    checked = !!checked;
    if (checked) {
        this.check();
    } else {
        this.uncheck();
    }
}

function disableGroup(group) {
    if (group.hasClass('active')) {
        group.find('.state').trigger('click');
    }
}

function setValueNumberedSlider(numberedSlider, value) {
    var $input = numberedSlider.find('input.value');
    $input.val(value).trigger('change');
}

function clamp(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}

function isGroupEnabled(groupWidget) {
    return groupWidget.hasClass('active');
}

function getSliderValue(numberedSlider) {
    return numberedSlider.find('input.value').val();
}


/**
 *
 ******************************************************************************/
function sharpen(groupWidget, isEnabled, factor) {

    isEnabled = Boolean(isEnabled);
    factor = clamp(factor, 0, 100);

    if (isEnabled) {
        enableGroup(groupWidget);
    } else {
        disableGroup(groupWidget);
    }

    setValueNumberedSlider(groupWidget.find('.numbered-slider-widget'), factor);
}

function chromaticAberration(groupWidget, isEnabled, factor) {

    isEnabled = Boolean(isEnabled);
    factor = clamp(factor, 0, 100);

    if (isEnabled) {
        enableGroup(groupWidget);
    } else {
        disableGroup(groupWidget);
    }

    setValueNumberedSlider(groupWidget.find('.numbered-slider-widget'), factor);
}

function vignette(groupWidget, isEnabled, amount, hardness) {

    isEnabled = Boolean(isEnabled);
    amount = clamp(amount, 0, 100);
    hardness = clamp(hardness, 0, 100);

    if (isEnabled) {
        enableGroup(groupWidget);
    } else {
        disableGroup(groupWidget);
    }

    sliders = groupWidget.find('.numbered-slider-widget');
    setValueNumberedSlider($(sliders[0]), amount);
    setValueNumberedSlider($(sliders[1]), hardness);
}

function bloom(groupWidget, isEnabled, threshold, intensity, radius) {

    isEnabled = Boolean(isEnabled);
    threshold = clamp(threshold, 0, 100);
    intensity = clamp(intensity, 0, 100);
    radius = clamp(radius, 0, 100);

    if (isEnabled) {
        enableGroup(groupWidget);
    } else {
        disableGroup(groupWidget);
    }

    sliders = groupWidget.find('.numbered-slider-widget');
    setValueNumberedSlider($(sliders[0]), threshold);
    setValueNumberedSlider($(sliders[1]), intensity);
    setValueNumberedSlider($(sliders[2]), radius);
}

function toneMapping(groupWidget, isEnabled, type, exposure, brightness, contrast, saturation) {

    isEnabled = Boolean(isEnabled);
    exposure = clamp(exposure, -100, 100);
    brightness = clamp(brightness, -100, 100);
    contrast = clamp(contrast, -100, 100);
    saturation = clamp(saturation, -100, 100);

    if (isEnabled) {
        enableGroup(groupWidget);
    } else {
        disableGroup(groupWidget);
    }

    var buttons = groupWidget.find('.togglebutton-widget li[title]');
    switch (type) {
        case 'linear':
            $(buttons[0]).trigger('click');
            break;
        case 'reinhard':
            $(buttons[1]).trigger('click');
            break;
        case 'filmic':
            $(buttons[2]).trigger('click');
            break;
    }

    sliders = groupWidget.find('.numbered-slider-widget');
    setValueNumberedSlider($(sliders[0]), exposure);
    setValueNumberedSlider($(sliders[1]), brightness);
    setValueNumberedSlider($(sliders[2]), contrast);
    setValueNumberedSlider($(sliders[3]), saturation);
}

function colorBalance(groupWidget, isEnabled, low, mid, high) {

    isEnabled = Boolean(isEnabled);
    if (isEnabled) {
        enableGroup(groupWidget);
    } else {
        disableGroup(groupWidget);
    }

    var buttons = groupWidget.find('.togglebutton-widget li[title]');

    $(buttons[0]).trigger('click');
    sliders = groupWidget.find('.numbered-slider-widget');
    setValueNumberedSlider($(sliders[0]), low[0]);
    setValueNumberedSlider($(sliders[1]), low[1]);
    setValueNumberedSlider($(sliders[2]), low[2]);

    $(buttons[1]).trigger('click');
    setValueNumberedSlider($(sliders[0]), mid[0]);
    setValueNumberedSlider($(sliders[1]), mid[1]);
    setValueNumberedSlider($(sliders[2]), mid[2]);

    $(buttons[2]).trigger('click');
    setValueNumberedSlider($(sliders[0]), high[0]);
    setValueNumberedSlider($(sliders[1]), high[1]);
    setValueNumberedSlider($(sliders[2]), high[2]);
}

/**
 * Get data from widgets
 ******************************************************************************/

function getPreset() {
    var preset = {};
    $widgets = $('#PostProcessGroup > .widget-wrapper > .inner > .vertical-widget > .widget-wrapper > .children > .widget');
    $widgets.each(function(index) {
        switch (index) {
            case 0:
                preset.sharpen = getSharpen($(this));
                break;
            case 1:
                preset.chromaticAberration = getChromaticAberration($(this));
                break;
            case 2:
                preset.vignette = getVignette($(this));
                break;
            case 3:
                preset.bloom = getBloom($(this));
                break;
            case 4:
                preset.toneMapping = getToneMapping($(this));
                break;
            case 5:
                preset.colorBalance = getColorBalance($(this));
        }
    });

    return preset;
}

function savePreset() {
    var newPresetName = prompt('new preset name?'),
        preset = {
            "name": newPresetName,
            "settings": getPreset()
        };

    GM_setValue(newPresetName, JSON.stringify(preset));
    loadPresets();
}

function getTypeValue(groupWidget) {
    var active = groupWidget.find('.togglebutton-widget .option.active');
    var values = {
        'default': 'linear',
        'reinhard': 'reinhard',
        'filmic': 'filmic'
    };
    return values[active.attr('data-value')];
}

function getSharpen(groupWidget) {
    return {
        enable: isGroupEnabled(groupWidget),
        factor: getSliderValue(groupWidget.find('.numbered-slider-widget'))
    };
}

function getChromaticAberration(groupWidget) {
    return {
        enable: isGroupEnabled(groupWidget),
        factor: getSliderValue(groupWidget.find('.numbered-slider-widget'))
    };
}

function getVignette(groupWidget) {
    var sliders = groupWidget.find('.numbered-slider-widget');
    return {
        enable: isGroupEnabled(groupWidget),
        amount: getSliderValue($(sliders[0])),
        hardness: getSliderValue($(sliders[1]))
    };
}

function getBloom(groupWidget) {
    var sliders = groupWidget.find('.numbered-slider-widget');
    return {
        enable: isGroupEnabled(groupWidget),
        threshold: getSliderValue($(sliders[0])),
        intensity: getSliderValue($(sliders[1])),
        radius: getSliderValue($(sliders[2]))
    };
}

function getToneMapping(groupWidget) {
    var sliders = groupWidget.find('.numbered-slider-widget');
    return {
        enable: isGroupEnabled(groupWidget),
        type: getTypeValue(groupWidget),
        exposure: getSliderValue($(sliders[0])),
        brightness: getSliderValue($(sliders[1])),
        contrast: getSliderValue($(sliders[2])),
        saturation: getSliderValue($(sliders[3])),
    };
}

function getColorBalance(groupWidget) {
    var sliders = groupWidget.find('.numbered-slider-widget');
    var buttons = groupWidget.find('.togglebutton-widget li[title]');
    $(buttons[0]).trigger('click');
    var low = [
        getSliderValue($(sliders[0])),
        getSliderValue($(sliders[1])),
        getSliderValue($(sliders[2]))
    ];
    $(buttons[1]).trigger('click');
    var mid = [
        getSliderValue($(sliders[0])),
        getSliderValue($(sliders[1])),
        getSliderValue($(sliders[2]))
    ];
    $(buttons[2]).trigger('click');
    var high = [
        getSliderValue($(sliders[0])),
        getSliderValue($(sliders[1])),
        getSliderValue($(sliders[2]))
    ];

    return {
        enable: isGroupEnabled(groupWidget),
        low: low,
        mid: mid,
        high: high
    };
}



/**
 * Extras injection
 ******************************************************************************/

// source: http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
var observeDOM = (function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback) {
        if (MutationObserver) {
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer) {
                if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe(obj, {
                childList: true,
                subtree: true
            });
        } else if (eventListenerSupported) {
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

var postProcessGroupReady = false;
observeDOM(document.body, function() {
    var postProcessGroup = $('#PostProcessGroup');
    if (postProcessGroup.length) {

        if (postProcessGroupReady === false) {
            onPostProcessReady();
            postProcessGroupReady = true;
        }

    }
});

function onPostProcessReady() {
    $container = $('#PostProcessGroup > .widget-wrapper > .inner');

    $container.prepend([
        '<div style="padding: 5px 0">',
        '<select name="presets" style="width: Calc(60% + 5px);">',
        '</select>',
        '</div>',
        '<button style="margin-bottom: 5px; margin-right: 5px; width: 30%" class="button btn-primary btn-medium" id="savePreset" type="button">Save</button>',
        '<button style="margin-bottom: 5px; margin-right: 5px; width: 30%" class="button btn-danger btn-medium" id="deletePreset" type="button">Delete</button>',
        '<br>',
        '<button style="margin-bottom: 15px; margin-right: 5px; width: 30%" class="button btn-medium" id="exportPreset" type="button">Export</button>',
        '<button style="margin-bottom: 15px; margin-right: 5px; width: 30%" class="button btn-medium" id="importPreset" type="button">Import</button>'
    ].join(''));

    $presetDropdown = $('select[name="presets"]');
    loadPresets();

    $saveButton = $('#savePreset');
    $saveButton.on('click', savePreset);

    $deleteButton = $('#deletePreset');
    $deleteButton.on('click', deletePreset);

    $exportButton = $('#exportPreset');
    $exportButton.on('click', exportPreset);

    $importButton = $('#importPreset');
    $importButton.on('click', importPreset);

    $container.on('change', 'select', function(e) {
        var value = $(e.currentTarget).val();
        if (value !== '') {
            applyPreset(parseInt(value, 10));
        }
    });
}

function loadPresets() {
    var presets = buildPresets();
    $presetDropdown.empty();
    $presetDropdown.append('<option value="">Select preset</option>');
    for (var i = 0; i < presets.length; i++) {
        $presetDropdown.append('<option value="' + i + '">' + presets[i].name + '</option>');
    }
}

/**
 * Inject Materials extras
 ******************************************************************************/
var materialsPanelReady = false;
observeDOM(document.body, function() {
    var panel = $('[data-panel="materials"] .group-widget');
    if (panel.length) {

        if (materialsPanelReady === false) {
            onMaterialsReady();
            materialsPanelReady = true;
        }

    }
});

function onMaterialsReady() {
    $container = $('[data-panel="materials"] > .vertical-widget > .widget-wrapper > .children');
    $container.prepend([
        '<div style="padding:5px">',
        '<button class="button btn-medium" id="exportMaterial" type="button">Export</button>',
        '</div>'
    ].join(''));

    $('#exportMaterial').on('click', exportMaterial);
}

function collectWidgetValues($el) {

    var groupWidget = new Group($el);

    var toggleButtonValues = [];
    var checkboxValues = [];
    var sliderValues = [];

    var typeElements = $el.find('.togglebutton-widget');
    typeElements.each(function(i, element){
        var typeWidget = new ToggleButton($(element));
        toggleButtonValues.push(typeWidget.getValue());
    });

    var checkboxElements = $el.find('.checkbox-widget');
    checkboxElements.each(function(i, element){
        var checkboxWidget = new Checkbox($(element));
        checkboxValues.push(checkboxWidget.isChecked());
    });

    var sliderElements = $el.find('.numbered-slider-widget');
    sliderElements.each(function(i, element){
        var sliderWidget = new NumberSlider($(element));
        sliderValues.push(sliderWidget.getValue());
    });

    var sliderImageElements = $el.find('.slidered-image-widget');
    sliderImageElements.each(function(i, element){
        var sliderImageWidget = new ImageNumberSlider($(element));
        sliderValues.push(sliderImageWidget.getValue());
        sliderValues.push(sliderImageWidget.getColor());
    });

    return {
        enabled: true,
        toggleButtonValues: toggleButtonValues,
        checkboxValues: checkboxValues,
        sliderValues: sliderValues
    }
}

function exportMaterial() {


    var groups = [
        function pbrMaps($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'workflow': widgetValues.toggleButtonValues[0],

                'baseValue': widgetValues.sliderValues[0],
                'baseColor': widgetValues.sliderValues[1],

                'metalnessValue': widgetValues.sliderValues[2],
                'metalnessColor': widgetValues.sliderValues[3],

                'specularF0Value': widgetValues.sliderValues[4],
                'specularF0Color': widgetValues.sliderValues[5],

                'albedoValue': widgetValues.sliderValues[6],
                'albedoColor': widgetValues.sliderValues[7],

                'specularValue': widgetValues.sliderValues[8],
                'specularColor': widgetValues.sliderValues[9]
            }
        },
        function pbrSpecularGlossiness($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'channelType': widgetValues.toggleButtonValues[0],

                'roughnessValue': widgetValues.sliderValues[0],
                'roughnessColor': widgetValues.sliderValues[1],

                'glossinessValue': widgetValues.sliderValues[2],
                'glossinessColor': widgetValues.sliderValues[3]
            }
        },
        function diffuse($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'enabled': widgetValues.enabled,

                'diffuseValue': widgetValues.sliderValues[0],
                'diffuseColor': widgetValues.sliderValues[1]
            }
        },
        function specular($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'enabled': widgetValues.enabled,

                'specularValue': widgetValues.sliderValues[0],
                'specularColor': widgetValues.sliderValues[1],

                'glossinessValue': widgetValues.sliderValues[2],
                'glossinessColor': widgetValues.sliderValues[3]
            }
        },
        function normalBump($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'enabled': widgetValues.enabled,

                'channelType': widgetValues.toggleButtonValues[0],
                'invertY': widgetValues.checkboxValues[0],

                'normalValue': widgetValues.sliderValues[0],
                'normalColor': widgetValues.sliderValues[1],

                'bumpValue': widgetValues.sliderValues[2],
                'bumpColor': widgetValues.sliderValues[3],
            }
        },
        function lightmap($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'enabled': widgetValues.enabled,

                'lightmapValue': widgetValues.sliderValues[0],
                'lightmapColor': widgetValues.sliderValues[1],
            }
        },
        function pbrAO($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'enabled': widgetValues.enabled,

                'AOValue': widgetValues.sliderValues[0],
                'AOColor': widgetValues.sliderValues[1],

                'occludeSpecular': widgetValues.checkboxValues[0],
            }
        },
        function pbrCavity($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'enabled': widgetValues.enabled,

                'cavityValue': widgetValues.sliderValues[0],
                'cavityColor': widgetValues.sliderValues[1],
            }
        },
        function opacity($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'enabled': widgetValues.enabled,

                'channelType': widgetValues.toggleButtonValues[0],

                'opacityValue': widgetValues.sliderValues[0],
                'opacityColor': widgetValues.sliderValues[1],
            }
        },
        function emissive($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'enabled': widgetValues.enabled,

                'emissiveValue': widgetValues.sliderValues[0],
                'emissiveColor': widgetValues.sliderValues[1],
            }
        },
        function reflection($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'reflectionValue': widgetValues.sliderValues[0],
            }
        },
        function faceCulling($el){
            var widgetValues = collectWidgetValues($el);
            return {
                'cullingValue': widgetValues.toggleButtonValues[0],
            }
        }
    ];
    var groupElements = $('[data-panel="materials"] > .vertical-widget > .widget-wrapper > .children .group-widget');
    var material = {};
    groupElements.each(function(i, groupElement){
        if (typeof groups[i] === 'function') {
            material[groups[i].name] = groups[i]($(groupElement));
        }
    });
    console.log(material);
}
