/* globals document, window, JSON, require, CSInterface, CSEvent, SystemPath, VulcanInterface, VulcanMessage */

import Vue from "vue";
import HelloDecoratorComponent from "./components/HelloDecorator.vue";
import PanelComponent from "./components/Panel.vue";
import fl from "./fl";
import * as Promise from "promise";

declare const themeManager: any;

interface Window {
    fs: any;
    e: any;
}

window.e = function (js: string) {
    fl.CSIF.evalScript(
        js, function (res: any) {
            console.log(res);
        }
    );
};
export const fs: any = eval("require('fs')");
// export const che: any = eval("require('cheerio')");

class Main {
    static instance: Main;
    appVue: Vue;
    panel: PanelComponent;

    constructor() {
        Main.instance = this;
        this.appVue = new Vue({
            el: "#app",
            data: {name: "World"},
            methods: {
                reload: function () {
                    window.location.reload();
                },
                flaDataClear: function () {
                    /*
                    fl.run(`
                    fl.getDocumentDOM().removeDataToDocument("${fl.SAVE_NAME}");
                    `)*/
                }
            },
            components: {
                PanelComponent,
                HelloDecoratorComponent
            }
        });
        this.panel = <PanelComponent>this.appVue.$refs.panel;

        try {
            themeManager.init();
            fl.CSIF.evalScript("fl.trace('CreateJs Supporter v0.0.1')");
            console.log('CreateJs Supporter v0.0.1');
            // CSIF.addEventListener("com.adobe.events.flash.selectionChanged", func);
            fl.CSIF.addEventListener("com.adobe.events.flash.documentChanged", (e: any) => this.documentChanged(e));
            // CSIF.addEventListener("com.adobe.events.flash.timelineChanged", func);
            // CSIF.addEventListener("com.adobe.events.flash.documentSaved", func);
            // CSIF.addEventListener("com.adobe.events.flash.documentOpened", func);
            // CSIF.addEventListener("com.adobe.events.flash.documentClosed", func);
            // CSIF.addEventListener("com.adobe.events.flash.documentNew", func);
            // CSIF.addEventListener("com.adobe.events.flash.layerChanged", func);
            // CSIF.addEventListener("com.adobe.events.flash.frameChanged", func);
            // // CSIF.addEventListener("com.adobe.events.flash.mouseMove", func);
            // CSIF.addEventListener("com.adobe.events.flash.prePublish", func);
            // CSIF.addEventListener("com.adobe.events.flash.postPublish", func);

            this.documentChanged(null);

            // function func(e: any = null) {
            //     console.log(e);
            // }
        } catch (e) {
            console.log(e);
        }
    }

    documentChanged(e: any) {
        console.log("documentChanged");


        Promise.all([
            fl.run(`
                var dom=fl.getDocumentDOM();
                dom?dom.path:"reject";
            `),
            fl.run(`dom.name`)])
            .then((args) => {
                this.panel.flaName = args[1];
                this.panel.flaPath = args[0].replace(this.panel.flaName, "");
                this.setOptions();
            })
            .catch(() => {
                // this.panel.flaData = {};
                this.emptyOptions()
            });
    }

    setOptions() {
        fl.flaDataJsonGet()
            .then((flaDataJson: string) => {
                console.log("flaData", flaDataJson);
                let _flaData: any;
                try {
                    _flaData = JSON.parse(flaDataJson);
                } catch (e) {
                }
                if (!_flaData) _flaData = {};

                if (!_flaData.ssList || !_flaData.ssList[0]) {
                    _flaData.ssList = [];
                }
                if (!_flaData.targetPath) {
                    // no setting
                    _flaData.targetPath = this.panel.flaName.replace(/(.*)fla/, "$1js")
                }
                Vue.set(this.panel, "flaData", _flaData);
                this.panel.targetPathUpdate();
                this.panel.ssListUpdate();
            });
    }

    emptyOptions() {
        console.log("emptyOptions")
        // this.panel.target = "";
    }
}

new Main();
