import Vue from "vue";
import HelloDecoratorComponent from "./components/HelloDecorator.vue";
import PanelComponent from "./components/Panel.vue";
import fl from "./fl";
import * as Promise from "promise";

declare const CSInterface: any;
declare const themeManager: any;
declare const SystemPath: any;
declare const require: any;
const CSIF: any = new CSInterface();

// interface Window {
//     e: any;
// }
//
// window.e = function (js: string) {
//     CSIF.evalScript(
//         js, function (res: any) {
//             console.log(res);
//         }
//     );
// };

class Main {
    static instance: Main;
    appVue: Vue;
    panel: PanelComponent;

    constructor() {
        Main.instance = this;
        this.appVue = new Vue({
            el: "#app",
            // template: `
            // <div>
            //     <main-component />
            //     Name: <input v-model="name" type="text">
            //     <h1>Hello Decorator Component</h1>
            //     <hello-decorator-component :name="name" :initialEnthusiasm="3" />
            //     </div>
            // `,
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
            CSIF.evalScript("fl.trace('CreateJs Supporter v0.0.1')");
            console.log('CreateJs Supporter v0.0.1');
            // CSIF.addEventListener("com.adobe.events.flash.selectionChanged", func);
            CSIF.addEventListener("com.adobe.events.flash.documentChanged", (e: any) => this.documentChanged(e));
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
                if(!dom)"reject";
            `)])
            .then(() => this.setOptions())
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
                    _flaData.ssList = [
                        {path: ""}
                    ];
                }
                if (_flaData.targetPath) {
                    Vue.set(this.panel, "flaData", _flaData);
                } else {
                    // no setting
                    fl.run(`dom.name`)
                        .then((_name: string) => {
                            _flaData.targetPath = _name.replace(/(.*)fla/, "$1js")

                            Vue.set(this.panel, "flaData", _flaData);
                        });
                }

            });
    }

    emptyOptions() {
        // console.log(this.appVue)
        // this.panel.target = "";
    }
}

new Main();
