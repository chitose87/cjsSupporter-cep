<template lang="pug">
    #Panel
        .info
        table.settings
            tr.watch
                th Watch
                td
                    input#hoge(type="checkbox",v-model="watch")
                td

            tr.target
                th Target
                td
                    input(type="text",v-model="flaData.targetPath",@keyup="targetPathUpdate")
                td(v-bind:data-status="targetPathStatus")

            tr.list
                td(colspan=2)
                    p List of Sheets to be merged
                    table
                        tr
                            th path
                            th
                            th
                            th

                        tr(v-for="item in flaData.ssList")
                            td
                                input(type="text",placeholder="http://",v-model="item.path",@keyup="ssListUpdate")
                            td(v-bind:data-status="item.status")

            tr.deploy(data-js="deploy")
                th Deploy
                td
                    button.topcoat-button.hostFontSize Deploy
</template>
<style lang="scss" scoped>
    //success
    [data-status="200"]:before {
        content: '200';
        color: green;
    }

    //Found
    [data-status="302"]:before {
        content: '302';
        color: green;
    }

    //Bad Request
    [data-status="400"]:before {
        content: '400';
        color: red;
    }

    //Not Found
    [data-status="404"]:before {
        content: '404';
        color: red;
    }

</style>
<script lang="ts">
    /* globals document, window, JSON, require, CSInterface, CSEvent, SystemPath, VulcanInterface, VulcanMessage */

    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import fl from "../fl";
    import {fs} from "../index";

    declare const SystemPath: any;

    @Component
    export default class Panel extends Vue {
        flaData: any = {};
        target: string = "hoge";
        flaPath: string = "";
        flaName: string = "";
        targetPathStatus: number = 404;

        private watcher: any;
        private timeoutId: number;

        private updateOption() {
            fl.flaDataUpdate(this.flaData);
        }

        targetPathUpdate() {

            if (this.watcher) this.watcher.close();

            let path = this.flaPath + "/" + this.flaData.targetPath;
            try {
                this.targetPathStatus = 200;
                fs.accessSync(path);
                let id = 0;
                this.watcher = fs.watch(path, () => {
                    clearTimeout(id);
                    id = setTimeout(() => this.onTargetUpdate(), 500);
                });
            } catch (e) {
                this.targetPathStatus = 404;
                fl.run(`fl.trace('Not Found:${path}')`);
            }

            this.updateOption();
        }

        ssListUpdate() {
            let ssList: any[] = this.flaData.ssList;

            if (ssList.length == 0 || ssList[ssList.length - 1].path != "") {
                ssList.push({path: "", status: 0});
            }

            for (let item: any of ssList) {
                if (item.path == "") {
                    item.status = 0;
                } else if (!item.path.match(/\.(json)$/i)) {
                    item.status = 400;
                } else {
                    let path = this.flaPath + "/" + item.path;
                    try {
                        item.status = 200;
                        fs.accessSync(path);
                    } catch (e) {
                        item.status = 404;
                        fl.run(`fl.trace('Not Found:${path}')`);
                    }
                }
            }

            this.updateOption();
        }

        onTargetUpdate() {
            console.log("onTargetUpdate");
            // check founded
            if (this.targetPathStatus != 200) {
                return fl.run(`fl.trace('Targetの設定に問題があります。')`);
            }
            let ssList: any[] = this.flaData.ssList;
            for (let item: any of ssList) {
                if (item.status > 0 && item.status != 200) {
                    return fl.run(`fl.trace('スプライトシートの設定に問題があります。')`);
                }
            }

            let targetPath = this.flaPath + "/" + this.flaData.targetPath;
            let targetJs: string = fs.readFileSync(targetPath, 'utf8');
            if (targetJs.indexOf("// Converted with cjsSupporter") >= 0) {
                return fl.run(`fl.trace('cjsSupporter Converted')`);
            }

            // all ready
            let _ssMetadata = [];
            window.targetJs = targetJs;
            let _manifest = eval(targetJs.match(/manifest: ([^\]]+)/)[1] + "]");

            try {
                for (let item: any of ssList) {
                    // a sprite sheet
                    if (item.status == 0) continue;
                    let ssJson: any = JSON.parse(
                        fs.readFileSync(
                            this.flaPath + "/" + item.path
                            , 'utf8')
                            .match(/{([^?]+)/)[0]
                    );
                    let result = {
                        name: ssJson.meta.image.match(/(.*)(?:\.([^.]+$))/)[1],
                        frames: []
                    };
                    let index = 0;
                    for (let key in ssJson.frames) {
                        // a frame
                        let _name = key.match(/(.*)(?:\.([^.]+$))/)[1];
                        let frame = ssJson.frames[key];
                        result.frames.push([frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h]);

                        let s = targetJs.indexOf(`.${_name} = function`);
                        s = targetJs.indexOf(`{`, s) + 1;
                        let e = targetJs.indexOf(`new cjs.Rectangle(`, s);
                        e = targetJs.indexOf(`;`, e) + 1;
                        targetJs = targetJs.replace(targetJs.substring(s, e),
                            `
this.spriteSheet = ss["${result.name}"];
this.gotoAndStop(${index});
}).prototype = p = new cjs.Sprite();
`);
                        // splice manifest
                        _manifest.some((v: any) => {
                            if (v.id == _name) {
                                _manifest.splice(_manifest.indexOf(v), 1);
                                return true;
                            }
                        });
                        index++;
                    }
                    _ssMetadata.push(result);
                    _manifest.push({
                        src: ssJson.meta.image
                        , id: result.name
                    })
                }
                targetJs = "// Converted with cjsSupporter\n\r"
                    + targetJs.replace(/ssMetadata([^;]+)/, "ssMetadata = " + JSON.stringify(_ssMetadata))
                        .replace(/manifest: ([^\]]+)]/, "manifest: " + JSON.stringify(_manifest));

                // write
                fs.writeFileSync(targetPath, targetJs);
            } catch (e) {
                console.log(e);
            }
        }

        set watch(v: boolean) {
        }
    }
</script>