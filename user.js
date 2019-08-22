// ==UserScript==
// @name         Sketchfab Editor Presets
// @namespace    http://sketchfab.com/
// @version      0.29
// @updateURL    https://raw.githubusercontent.com/PadreZippo/sketchfab-editor-presets/master/user.js
// @downloadURL  https://raw.githubusercontent.com/PadreZippo/sketchfab-editor-presets/master/user.js
// @description  Save/use presets in Sketchfab Editor
// @author       Maurice Svay, James Green
// @match        https://sketchfab.com/models/*/edit*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_info
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    if (!areModelsAvailable()) {
        console.error('Sketchfab Editor Presets: editorModels are not available in this version of Sketchfab.');
        return;
    }

    var lightingGroupReady = false;
    observeDOM( document.body, function () {
        var lightingGroup = $('#LightsGroup .button-widget');
        if ( lightingGroup.length ) {
            if ( lightingGroupReady === false ) {
                lightingGroupReady = true;
                onReady();
            }
        }
    } );
})();

function onReady() {
    var presets = PresetStore.getAll();
    var materials = MaterialStore.getAll();

    renderContainerUI();
    renderPresetsUI(presets);
    renderMaterialsUI(materials);

    test();
}

/**
 * Container UI
 ******************************************************************************/

function renderContainerUI() {

    var version = GM_info.script.version;
    var containerUIState = {
        expanded: GM_getValue( 'ui_expanded', true )
    };

    var tpl = `
        <style type="text/css">
        .editor-view {
            width: calc(100% - 41px);
        }
        .editor-view.right-panel-expanded {
            width: calc(100% - 301px);
        }
        .right-panel {
            display: flex;
            position:absolute;
            right: 0;
            width: 41px;
            height: 100%;
            background: #595959;
            padding-top: 55px;
        }
        .right-panel-expanded {
            width: 301px;
        }

        .right-panel-toolbar {
            flex-basis: 40px;
            order: 1;
            flex: none;
            background: #444;
            border-left: 1px solid #000;
        }
            .right-panel-toolbar button {
                display: block;
                width: 40px;
                height: 40px;
                line-height: 40px;
                padding: 0;
                appearance: none;
                border: 0;
                border-bottom: 1px solid #000;
                background: transparent;
                color: #FFF;
                outline: 0;
            }
            .right-panel-toolbar button:hover {
                background: #555;
            }

        .editor-presets{
            display: none;
            flex: 1 1 auto;
            color: #fff;
            border-left: 1px solid #000;
        }
        .editor-presets-active {
            display: block;
        }
        .editor-presets{ padding: 15px; overflow: auto; }
        .editor-presets-list, .editor-materials-list{border-top: 1px solid #4d4d4d;margin-top: 15px; font-size:13px; margin-bottom: 8px;}
        .editor-presets-list .fa, .editor-materials-list .fa {font-size: 14px;}

        .editor-presets-item{display:flex; align-items: center; color: #fff; border-bottom: 1px solid #4d4d4d; cursor:pointer; min-height: 48px;}
        .editor-presets-item:hover{background: rgba(255,255,255,.1);}

        .editor-presets-item-preview{width: 48px; height: 48px; display:inline-block; background: #222; margin-left: 8px; flex: none; text-align: center; line-height:48px; border-radius: 2px;}
        .edition-presets-item-name{flex: 1; padding-left: 8px; overflow: hidden; text-overflow: ellipsis;}

        .delete-preset:hover,.delete-material:hover{color: #CC211F;}
        .delete-preset {opacity: 0;}

        .download-preset{margin: 0 8px; opacity: 0;}
        .download-preset:hover{color: #1CAAD9;}
        .editor-presets-item:hover .delete-preset,
        .editor-presets-item:hover .download-preset{opacity: 1}

        .delete-material{opacity:0; margin-right: 8px}
        .editor-presets-item:hover .delete-material{opacity:1;}

        .editor-presets-tabs{display: flex; margin: -15px -15px 15px -15px;}
        .editor-presets-tab{text-align:center;padding:8px;flex:1;font-size:14px; font-family:"Titillium Web", sans-serif; text-transform: uppercase;border-bottom: 4px solid transparent; background:#333}
        .editor-presets-tab.active{border-bottom: 4px solid #1CAAD9;}
        .editor-presets-tabcontent{display:none;}
        .editor-presets-tabcontent.active{display:block;}

        .editor-presets-list-actions {
            float: left;
            padding-left: 8px;
        }
        .editor-presets-list-actions .btn-textified {
            font-size: 13px;
            color: #888888;
        }
        .editor-presets-list-actions .btn-textified:hover {
            color: #ffffff;
        }

        .editor-presets-footer {
            color: #888;
            text-align: right;
            font-size: 11px;
            line-height: 22px;
        }
        </style>

        <div class="right-panel">
            <div class="right-panel-toolbar">
                <button data-action="toggle-panel" class="help">
                <i class="fa fa-sliders"></i>
                <div class="tooltip tooltip-left">Presets</div>
                </button>
            </div>
            <div class="editor-presets">
                <div class="editor-presets-tabs">
                    <a href="#presets-settings" class="editor-presets-tab active">Presets</a>
                    <a href="#presets-materials" class="editor-presets-tab">Materials</a>
                </div>

                <div class="editor-presets-tabcontent active" id="presets-settings">
                </div>

                <div class="editor-presets-tabcontent" id="presets-materials">
                </div>

                <div class="editor-presets-footer">
                    <small>v ${version}</small>
                </div>
            </div>
        </div>
    `;

    $('.editor-view').after(tpl);

    function renderContainerState() {
        if ( containerUIState.expanded ) {
            $('.editor-view').addClass('right-panel-expanded');
            $('.right-panel').addClass('right-panel-expanded');
            $('.editor-presets').addClass('editor-presets-active');
        } else {
            $('.editor-view').removeClass('right-panel-expanded');
            $('.right-panel').removeClass('right-panel-expanded');
            $('.editor-presets').removeClass('editor-presets-active');
        }
    }

    $('button[data-action="toggle-panel"]').on('click', function(){
        containerUIState.expanded = !containerUIState.expanded;
        GM_setValue( 'ui_expanded', containerUIState.expanded );
        renderContainerState();
    });
    renderContainerState();

    $('.editor-presets-tabs').on('click', '.editor-presets-tab', function(e) {
        e.preventDefault();
        $('.editor-presets-tab').removeClass('active');
        $('.editor-presets-tabcontent').removeClass('active');
        $(e.currentTarget).addClass('active');
        var tabId = $(e.currentTarget).attr('href');
        $(tabId).addClass('active');
    });
}

/**
 * Presets UI
 ******************************************************************************/
function renderPresetsUI( presets ) {

    var tpl = `
        <button class="button btn-secondary btn-small" data-action="save-preset">Save preset</button>
        <ul class="editor-presets-list"></ul>
        <div class="editor-presets-list-actions">
            <label class="button btn-textified btn-small import-preset" data-action="import-preset" for="preset-input">Import file</label>
            <input type="file" id="preset-input" style="display:none;"/>
            <button class="button btn-textified btn-small refresh-presets" data-action="refresh-presets">Refresh</button>
        </div>
    `;

    $('#presets-settings').html(tpl);
    renderPresetList(presets);

    $('[data-action="save-preset"]').on('click', function(e) {
        e.preventDefault();
        openPopup();
    });

    $('[data-action="refresh-presets"]').on('click', function(e){
        e.preventDefault();
        console.log('Refresh presets');
        var presets = PresetStore.getAll();
        console.log(presets);
        renderPresetList(presets);
    });

    $( '#preset-input' ).on( 'change', function( e ) {
        e.preventDefault();
        var file = e.originalEvent.target.files[0];
        var name = file.name.replace( '.json', '' );
        $( '#preset-input' ).val( '' );

        loadJson( file, function( err, json ){

            if ( err ) {
                alert( 'This file is not valid' );
                return;
            }

            var isValid = json.hasOwnProperty( 'settings' ) && json.hasOwnProperty( 'name' );

            if ( isValid ) {
                PresetStore.saveAs( json.settings, json.name );
                var updatedCollection = PresetStore.getAll();
                renderPresetList( updatedCollection );
            } else {
                alert( 'This file is not valid' );
            }
        } );
    } );

    $( '.editor-presets-list' ).on( 'click', '.editor-presets-item', function( e ) {
        var $target = $( e.currentTarget );
        var name = $target.attr( 'data-name' );

        var preset = PresetStore.getByName( name );
        if ( preset ) {
            // @FIXME the following code should be async
            Scene.applyPreset( preset );
            Scene.createBackup();
        }
    } );

    // Live preview
    $( '.editor-presets-list' ).on( 'mouseenter', function( e ) {
        Scene.createBackup();
    } );

    $( '.editor-presets-list' ).on( 'mouseleave', function( e ) {
        Scene.deleteBackup();
    } );

    $( '.editor-presets-list' ).on( 'mouseleave', '.editor-presets-item-preview', function(e) {
        Scene.restoreBackup();
    } );

    $( '.editor-presets-list' ).on( 'mouseenter', '.editor-presets-item-preview', function( e ) {
        var $target = $( e.currentTarget );
        var name = $target.attr( 'data-name' );
        var preset = PresetStore.getByName( name );
        if ( preset ) {
            Scene.previewPreset( preset );
        }
    } );

    $( '.editor-presets-list' ).on( 'click', '.download-preset', function( e ) {
        e.stopPropagation();
        var $target = $( e.currentTarget );
        var name = $target.attr( 'data-name' );

        var preset = PresetStore.getByName( name );
        downloadJson( preset, name );
    } );

    $( '.editor-presets-list' ).on( 'click', '.delete-preset', function( e ) {
        e.stopPropagation();
        var $target = $( e.currentTarget );
        var name = $target.attr( 'data-name' );
        PresetStore.deleteByName( name );

        var updatedCollection = PresetStore.getAll();
        renderPresetList( updatedCollection );
    } );
}

function renderPresetList( presetCollection ) {
    var items = presetCollection.map(function(preset){
        return `
            <li class="editor-presets-item" data-name="${preset.name}">
                <span class="edition-presets-item-name" title="${preset.name}">${preset.name}</span>
                <span class="download-preset" data-name="${preset.name}" title="Download"><i class="fa fa-download"></i></span>
                <span class="delete-preset" data-name="${preset.name}" title="Delete"><i class="fa fa-trash-o"></i></span>
                <span class="editor-presets-item-preview" data-name="${preset.name}" title="Preview"></span>
            </li>`;
    }).join('');
    $('.editor-presets-list').html(items);
}

/**
 * Materials tab
 ******************************************************************************/
function renderMaterialsUI( materials ) {
    var tpl = `
        <button class="button btn-secondary btn-small" data-action="save-material">Save material</button>
        <ul class="editor-materials-list"></ul>
    `;
    $( '#presets-materials' ).html( tpl );
    renderMaterialsList( materials );

    $( '.editor-presets [data-action="save-material"]' ).on( 'click', function( e ) {
        e.preventDefault();
        var currentMaterialName = Scene.getSelectedMaterialName();

        Scene.getMaterialByName( currentMaterialName ).then(function( materialSettings ){
            var newName = window.prompt( 'Save materials as', currentMaterialName );
            if ( $.trim( newName ) !== '') {
                MaterialStore.saveAs( materialSettings, newName );
                renderMaterialsList( MaterialStore.getAll() );
            }
        });

    } );

    $('.editor-materials-list').on( 'click', '.editor-presets-item', function( e ) {
        var $target = $( e.currentTarget );
        var name = $target.attr( 'data-name' );
        var material = MaterialStore.getByName( name );
        if ( material ) {
            var selectedMaterialName = Scene.getSelectedMaterialName();
            console.log('Updating material', selectedMaterialName, material);
            Scene.updateMaterialByName( selectedMaterialName, material );
        }
    } );

    $( '.editor-materials-list' ).on( 'click', '.delete-material', function( e ) {
        e.stopPropagation();
        var $target = $( e.currentTarget );
        var name = $target.attr( 'data-name' );
        MaterialStore.deleteByName( name );
        renderMaterialsList( MaterialStore.getAll() );
    } );
}

function renderMaterialsList( materials ) {
    var out = materials.map( function( material ) {
        return `
            <li class="editor-presets-item" data-name="${material.name}">
                <span class="edition-presets-item-name">${material.name}</span>
                <span class="delete-material" data-name="${material.name}"><i class="fa fa-trash-o"></i></span>
            </li>
        `;
    } ).join('');

    $('.editor-materials-list').html( out );
}

/**
 * Popup
 ******************************************************************************/
function openPopup() {
    var $editor = $('.editor');
    var $popupContainer = $('<div class="popup-wrapper"></div>');
    $editor.append($popupContainer);

    var list = [];
    function renderNode( node, depth ) {
        if (typeof node === 'function') {
            return;
        } else {
            list.push('<ul>');
            for (var children in node) {
                var padding = new Array(depth + 1).join( '-' );
                list.push('<li class="node"><label><input type="checkbox" value="' + children + '"> '+ children +'</label>');
                renderNode( node[children], depth+1 );
                list.push('</li>');
            }
            list.push('</ul>');
        }
    }
    renderNode(settings, 0);
    var settingsList = list.join('');

    var popupTpl = `
        <div class="popup popup-presets" style="height:auto">
        <div class="popup-header">
            <div class="popup-name">Save preset</div>
            <div class="popup-actions"><a class="popup-action-close"></a></div>
        </div>
        <div class="popup-content">
        <style>.popup-presets li{padding-left: 1em; margin: 4px;} .popup-footer{padding: 20px;}</style>
        <div style="padding-bottom: 20px;">
            <button class="button btn-secondary" data-action="presets-select-all">Select all</button>
            <button class="button btn-secondary" data-action="presets-select-none">Select none</button>
        </div>
        ${settingsList}
        </div>
        <form class="popup-footer">
            <label style="color:white">Name:</label>
            <input type="text" value="Sketchfab-preset" name="preset-name" style="border-radius:3px; border: 0; padding: 4px;">
            <button type="submit" class="button btn-primary" data-action="presets-save">Save Preset</button>
        </form>
        </div
    `;

    $popupContainer.append(popupTpl);

    var $close = $popupContainer.find('.popup-action-close');
    $close.one('click', closePopup);

    $popupContainer.on('change', 'input[type="checkbox"]', function(e) {
        var $checkbox = $(e.currentTarget);

        var isChecked = $checkbox.is(':checked');

        // Auto-check subtree
        var $currentNode = $checkbox.closest( 'li.node' );
        var $subTree = $currentNode.find( 'ul' );
        if ( $subTree.length ) {
            $subTree.find('input[type="checkbox"]').prop('checked', isChecked);
        }

        // Auto-check parent checkbox
        var $parentNode = $currentNode.parents( 'li.node' );
        var checkedCount = 0;
        var uncheckedCount = 0;
        if ( $parentNode.length !== 0 ) {
            var $subNodes = $parentNode.find( 'ul input[type="checkbox"]' );
            for ( var i=0; i<$subNodes.length; i++ ) {
                if ( $($subNodes[i]).is( ':checked' ) ) {
                    checkedCount++;
                } else {
                    uncheckedCount++;
                }
            }

            $parentNode.find('input[type="checkbox"]').first()
                .prop('checked', checkedCount !== 0 )
                .prop('indeterminate', ( checkedCount !== 0 && uncheckedCount !== 0 ) );
        }
    });

    var $btnSelectAll = $popupContainer.find('[data-action="presets-select-all"]');
    $btnSelectAll.on('click', function(e){
        e.preventDefault();
        $popupContainer.find('input[type="checkbox"]').prop('checked', true).prop('indeterminate', false);
    });
    //$popupContainer.find('input[type="checkbox"]').prop('checked', true).prop('indeterminate', false);

    var $btnSelectNone = $popupContainer.find('[data-action="presets-select-none"]');
    $btnSelectNone.on('click', function(e){
        e.preventDefault();
        $popupContainer.find('input[type="checkbox"]').prop('checked', false).prop('indeterminate', false);
    });

    var $saveForm = $popupContainer.find('.popup-footer');
    $saveForm.on( 'submit', function( e ) {
        e.preventDefault();

        // Get selected checkboxes
        var $checkboxes = $popupContainer.find( 'input[type="checkbox"]' );
        var selected = [];
        $checkboxes.each(function(){
            if ( $( this ).prop( 'checked' ) ) {
                selected.push( this.value );
            }
        });

        if (selected.length !== 0) {
            // Save selected settings
            var name = $.trim( $( 'input[name="preset-name"]' ).val() );
            if ( name === '' ) {
                name = 'sketchfab-preset';
            }

            Scene.extractSettings( selected ).then( function( settings ) {
                PresetStore.saveAs( settings, name );

                //Refresh list
                var updatedCollection = PresetStore.getAll();
                renderPresetList( updatedCollection );
                closePopup();
            } ).catch( function( error ) {
                alert( 'Error: Can not save preset' );
            } );
        } else {
            alert('You need to select settings to save as preset.');
        }
    } );
}

function closePopup() {
    var $popupContainer = $('.popup-wrapper');
    $popupContainer.remove();
}

/**
 * Settings
 ******************************************************************************/

function getSettingByKey( key ) {
    return new Promise(function(resolve, reject) {
        editorModels[key].getJSON().then(function(result){
            var out = {};
            out[ key ] = result;
            resolve( out );
        }).catch(function(error){
            reject(error);
        });
    });
}

var settings = {
    'Shading': function(){
        return getSettingByKey('shadingStyle');
    },
    'Orientation': function(){
        return getSettingByKey('orientation');
    },
    'Lighting': {
        'Environment': function(){
            return getSettingByKey('environment');
        },
        'Lights': function(){
            return getSettingByKey('lighting');
        },
    },
    /*
    'Camera': {
        'Position': function(){
            return getSettingByKey('manipulator');
        },
        'FOV': function(){
            return getSettingByKey('fov');
        },
    },
    */
    'Post-processing': function(){
        return getSettingByKey('postProcess');
    },
    'Background': function(){
        return getSettingByKey('background');
    }
};

/**
 * Import/Export
 ******************************************************************************/
function loadJson( file, callback ) {
    var reader = new FileReader();
    reader.onload = function( evt ) {
        var importedData;
        try {
            importedData = JSON.parse( evt.srcElement.result );
            console.log( 'JSON loaded', importedData );
            window.requestAnimationFrame( function(){
                callback( null, importedData );
            } );
        } catch (e) {
            window.requestAnimationFrame( function(){
                callback( 'File is not valid', null );
            } );
        }
    };
    reader.readAsText( file );
}

function downloadJson( json, filename ) {
    console.log( 'Exporting JSON', json );
    var text = JSON.stringify(json, null, 4);
    var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename + '.json';
    a.click();
}

/**
 * PresetStore
 ******************************************************************************/
var PresetStore = {

    prefix: 'preset_',

    getByName: function( name ) {
        var key = PresetStore.prefix + name;
        var preset = GM_getValue( key, null );
        return preset;
    },

    getAll: function() {
        var keys = GM_listValues();
        var presets = [];
        var key;
        for ( var i=0; i<keys.length; i++ ) {
            key = keys[i];
            if ( key.indexOf(PresetStore.prefix) === 0 ) {
                presets.push( GM_getValue( key, null ) );
            }
        }
        return presets;
    },

    saveAs: function( settings, name ) {
        var key = PresetStore.prefix + name;
        var preset = {
            name: name,
            createdAt: +new Date(),
            settings: settings
        };
        console.log( 'Saving preset', name, preset );
        GM_setValue( key, preset );
        return key;
    },

    deleteByName: function( name ) {
        var key = PresetStore.prefix + name;
        GM_deleteValue(key);
    }
};

/**
 * MaterialStore
 ******************************************************************************/
var MaterialStore = {

    prefix: 'material_',

    getByName: function( name ) {
        var key = MaterialStore.prefix + name;
        return GM_getValue( key, null );
    },

    saveAs: function( settings, name ) {
        var key = MaterialStore.prefix + name;
        var material = {
            name: name,
            createdAt: +new Date(),
            settings: settings
        };
        console.log( 'Saving material', material );
        GM_setValue( key, material );
        return key;
    },

    deleteByName: function( name ) {
        var key = MaterialStore.prefix + name;
        GM_deleteValue(key);
        console.log( 'Material ' + name + ' has been deleted' );
    },

    getAll: function() {
        var keys = GM_listValues();
        var materials = [];
        var material;
        var key;
        for ( var i=0; i<keys.length; i++ ) {
            key = keys[i];
            if ( key.indexOf( MaterialStore.prefix ) === 0 ) {
                material = GM_getValue( key, null );
                if ( material ) {
                    materials.push( material );
                }
            }
        }
        return materials;
    }
};

/**
 * Scene
 ******************************************************************************/
var Scene = {

    settingsBackup: null,

    /**
     * getSelectedMaterialName
     * Get the name of the currently selected material
     *
     * @return {string} selectedMaterialName
     */
    getSelectedMaterialName: function() {
        return $('#MaterialSelect .selection').attr('title');
    },

    /**
     * getMaterialByName
     * Get a scene material by its name
     *
     * @param {string} name Material name to retrieve
     * @return {Promise} materialPromise
     */
    getMaterialByName: function( name ) {
        return new Promise(function( resolve, reject ){
            Scene.getAllMaterials().then(function( materials ){
                for (var uid in materials) {
                    if (materials[uid].name === name) {
                        resolve( materials[uid] );
                        return;
                    }
                }
                reject('Material not found');
            }).catch(reject);
        });
    },

    /**
     * getMaterialIndex
     * Get an index of scene materials, with uid and name only
     *
     * @return {Array} materialIndex Array of material objects with uid and name
     */
    getMaterialsIndex: function() {
        return $( '#MaterialSelect li.option' ).map( function() {
            return {
                name: this.getAttribute( 'title' ),
                uid: this.getAttribute( 'data-value' )
            };
        } ).get();
    },

    /**
     * getAllMaterials
     * Get all materials from the scene
     *
     * @return {Promise} materialsPromise
     */
    getAllMaterials: function() {
        return editorModels.material.getJSON();
    },

    /**
     * updateMaterialByName
     * Update a material
     *
     * @param {string} name
     * @param {object} newMaterial
     * @return {Promise} updatePromise
     */
    updateMaterialByName( name, newMaterial ) {
        var materials = Scene.getMaterialsIndex();
        var out = {};

        for (var i=0; i<materials.length; i++) {
            if (materials[i].name === name) {
                out[materials[i].uid] = newMaterial.settings;
            }
        }

        console.log('New materials', out);
        var promise = editorModels.material.setJSON( out );
        promise.catch( function( error ){
            console.error( error );
        } );

        return promise;
    },

    /**
     * extractSettings
     * Extract settings from scene (except materials)
     *
     * @param {array} select Array of selected subsettings
     * @return {Promise} settingsPromise
     */
    extractSettings: function( selected ) {
        if ( !selected ) {
            selected = [
                'Shading',
                'Orientation',
                'Lighting', 'Environment', 'Lights',
                //'Camera', 'Position', 'FOV',
                'Post-processing', 'Background'
            ];
        }

        // Recursively get partial settingPromises for selection
        var partialSettings = [];
        function getSettingForNode(node) {
            if (typeof node === 'function') {
                partialSettings.push(node.call(this));
            } else {
                for (var children in node) {
                    if (_.indexOf(selected, children) !== -1) {
                        getSettingForNode(node[children]);
                    }
                }
            }
        }
        getSettingForNode( settings );

        return new Promise(function(resolve, reject) {
            Promise.all( partialSettings ).then( function( result ) {
                var out = {};
                for (var i=0;i<result.length; i++) {
                    _.assign(out, result[i]);
                }
                resolve( out );
            } ).catch( reject );
        });
    },

    /**
     * applyPreset
     * Apply a preset to the scene
     *
     * @param {object} preset
     * @retrun {Promise} applyPromise
     */
    applyPreset: function( preset ) {
        console.log('Applying preset: ', preset);
        var promise;
        var settings = preset.settings;
        for ( var prop in settings ) {
            if ( editorModels.hasOwnProperty( prop ) ) {
                var setting = settings[prop];
                console.log('setJSON with cloned data');
                var clonedSetting = JSON.parse(JSON.stringify(setting));
                promise = editorModels[prop].setJSON( clonedSetting );
                promise.catch( function( error ){
                    console.error( error );
                } );
            }
        }

        return promise;
    },

    previewPreset: function( preset ) {
        if ( Scene.settingsBackup ) {
            console.log( 'Previewing' );
            Scene.applyPreset( Scene.settingsBackup );
            Scene.applyPreset( preset );
        }
    },

    createBackup: function() {
        Scene.extractSettings().then( function( settings ){
            console.log( 'Backing up settings', settings );
            Scene.settingsBackup = {
                name: 'Automatic Backup',
                createdAt: +new Date(),
                settings: settings
            };
        } );
    },

    deleteBackup: function() {
        console.log( 'Deleting backup' );
        Scene.settingsBackup = null;
    },

    restoreBackup: function() {
        if ( Scene.settingsBackup ) {
            console.log( 'Restoring backup' );
            Scene.applyPreset( Scene.settingsBackup );
        }
    }

};

/**
 * Utilities
 ******************************************************************************/
function areModelsAvailable() {
    return (typeof unsafeWindow.editorModels !== 'undefined');
}

function observeDOM ( obj, callback ) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var eventListenerSupported = window.addEventListener;

    if ( MutationObserver ) {
        // define a new observer
        var obs = new MutationObserver( function ( mutations, observer ) {
            if ( mutations[ 0 ].addedNodes.length || mutations[ 0 ].removedNodes.length )
                callback();
        } );
        // have the observer observe foo for changes in children
        obs.observe( obj, {
            childList: true,
            subtree: true
        } );
    } else if ( eventListenerSupported ) {
        obj.addEventListener( 'DOMNodeInserted', callback, false );
        obj.addEventListener( 'DOMNodeRemoved', callback, false );
    }
}

function test() {
    /*
    console.debug('Materials index', Scene.getMaterialsIndex());
    console.debug('Selected material', Scene.getSelectedMaterialName());
    Scene.getMaterialByName('floor').then(function(material){
        console.debug('"floor" material', material);
    });
    Scene.getAllMaterials().then(function(materials){
        console.debug('All materials', materials);
    });
    Scene.extractSettings().then(function(settings){
        console.debug('All settings', settings);
    });
    Scene.extractSettings(['Camera','Position']).then(function(settings){
        console.debug('Camera position', settings);
    });
    */
}
