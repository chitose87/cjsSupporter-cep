/* globals document, window, JSON, require, CSInterface, CSEvent, SystemPath, VulcanInterface, VulcanMessage */

import Vue from "vue";
import PanelComponent from "./components/Panel.vue";
import fl from "./fl";
import * as Promise from "promise";

declare const themeManager: any;

interface Window {
    fs: any;
    e: any;
}

// window.e = function (js: string) {
//     fl.CSIF.evalScript(
//         js, function (res: any) {
//             console.log(res);
//         }
//     );
// };
export const fs: any = eval("require('fs')");
export const path: any = eval("require('path')");

// export const cheerio: any = eval("require('cheerio')");

class Main {
    static instance: Main;
    static version: string = "v0.0.3";
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
                PanelComponent
            }
        });
        this.panel = <PanelComponent>this.appVue.$refs.panel;

        try {
            themeManager.init();
            fl.CSIF.evalScript("fl.trace('CreateJs Supporter " + Main.version + "')");
            console.log('CreateJs Supporter v0.0.3');
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
                dom?dom.name:"reject";
            `),
            fl.run(`dom?dom.path:"reject"`),
            fl.run(`dom?dom.exportPublishProfileString():"reject"`)
        ])
            .then((args) => {
                this.panel.flaName = args[0];
                this.panel.flaPath = args[1].replace(this.panel.flaName, "");
                // window.v = args[2];
                console.log(args[2], args[2].match(/name="filename"*>(.+).js/)[1])
                this.panel.targetPath = (/.xfl/.test(this.panel.flaName) ? "../" : "") + args[2].match(/name="filename"*>(.+).js/)[1] + ".js";
                console.log("this.panel.targetPath", this.panel.targetPath);
                this.setOptions();
            })
            .catch(() => {
                // this.panel.flaData = {};
                // fl.CSIF.evalScript("fl.trace(dom.exportPublishProfileString())");

                this.emptyOptions()
            });
    }

    setOptions() {
        console.log("setOptions");
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
                // if (!_flaData.targetPath) {
                //     // no setting
                //     _flaData.targetPath = this.panel.flaName.replace(/(.*)fla/, "$1js")
                // }
                Vue.set(this.panel, "flaData", _flaData);
                // this.panel.targetPathUpdate();
                this.panel.ssListUpdate();
                this.panel.startWatch();
            });
    }

    emptyOptions() {
        console.log("emptyOptions");
        // this.panel.target = "";
    }
}

new Main();
