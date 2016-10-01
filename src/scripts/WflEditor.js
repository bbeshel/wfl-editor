"use strict";

var $      = wfl.jquery;
var scenes = require('./scenes');
var tools  = require('./tools');

class WflEditor {
    constructor() {
        this.worldSubwindow  = document.querySelector("#world-subwindow");
        this.canvasDomObject = document.querySelector("#world-canvas");
        this.worldEditor     = wfl.create(this.canvasDomObject);
        this.animationId     = 0;
        this.prevUpdateTime  = 0;

        // Set main editor's iniital scene
        this.worldEditorScene = new scenes.WorldEditorScene(
            this.canvasDomObject,
            this.worldEditor.mouse,
            this.worldEditor.keyboard
        );
        this.worldEditor.setScene(this.worldEditorScene);

        this.initTools();

        // Resize main editor's canvas when window resizes
        $(window).on("resize", () => this.onResize());

        // Give canvas its initial size
        this.onResize();
    }

    initTools() {
        this.initEditorTools();
        this.initComponentTools();
        this.initWorldTools();
    }

    initEditorTools() {
        var editorTools = $(".tool", "#tool-bar-subwindow");

        // Add listeners to each tool so they can be clicked and used
        for (let tool of editorTools) {
            $(tool).on("click", () => {
                this._selectTool(tool, "#tool-bar-subwindow");

                var toolId        = "#" + $(tool).attr("id");
                var currentScene  = this.worldEditor.getScene();
                currentScene.tool = new tools.list[toolId](currentScene);
            });
        }

        // Select the first editor tool
        if (editorTools.length > 0) $(editorTools[0]).click();
    }

    initComponentTools() {
        var componentTools = $(".tool", "#component-iconwindow");

        // Add listeners to each tool so they can be clicked and used
        for (let tool of componentTools) {
            $(tool).on("click", () => {
                this._selectTool(tool, "#component-iconwindow");
            });
        }

        // Select the first component tool
        if (componentTools.length > 0) $(componentTools[0]).click();
    }

    initWorldTools() {
        var worldTools = $(".tool", "#world-iconwindow");

        // Add listeners to each tool so they can be clicked and used
        for (let tool of worldTools) {
            $(tool).on("click", () => {
                this._selectTool(tool, "#world-iconwindow");
            });
        }

        // Select the first component tool
        if (worldTools.length > 0) $(worldTools[0]).click();
    }

    onResize(e) {
        var style   = window.getComputedStyle(this.worldSubwindow, null);
        var width   = parseInt(style.getPropertyValue("width"));
        var height  = parseInt(style.getPropertyValue("height"));
        var padding = parseInt(style.getPropertyValue("padding"));

        this.canvasDomObject.width  = width  - padding * 2;
        this.canvasDomObject.height = height - padding * 2;
    }

    /**
     * Deselects all tools in a given context, then selects the given tool
     */
    _selectTool(tool, context) {
        if (context) {
            $(".tool-selected", context).removeClass("tool-selected");
        }

        $(tool).addClass("tool-selected");
    }
}

module.exports = WflEditor;
