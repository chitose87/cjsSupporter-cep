<template lang="pug">
    #Panel
        table.settings(cellspacing="1px")

            //tr.hostBorderShadow
                th Target：
                td
                    input(type="text",v-model="flaData.targetPath",@keyup="targetPathUpdate")
                td(v-bind:data-status="targetPathStatus")

            tr.hostBorder
                th Merge list：
                td(colspan=2).p-0
                    table
                        tr(v-for="item in flaData.ssList")
                            td(width="auto")
                                input(type="text",placeholder="./${Sprite Sheet}.json",v-model="item.path",@keyup="ssListUpdate")
                            td(width="3em")(v-bind:data-status="item.status")

            tr.hostBorder
                th(width="auto") Watch：
                td(width="auto")
                    input#hoge(type="checkbox",v-model="isWatch")
                td(width="3em")

            tr.hostBorder
                th Deploy：
                td
                    button.topcoat-button.hostFontSize(v-on:click="deploy") Deploy
                td(width="3em")
        .info
            a(v-on:click="openBrowser('https://www.adobeexchange.com/creativecloud.details.100252.html')") [addon page]
            a(v-on:click="openBrowser('https://github.com/chitose87/cjsSupporter-cep')") [github project]

</template>
<style lang="scss" scoped>
    #Panel {
        padding: 1em 0;
    }

    .hostBorder {
        > * {
            position: relative;
            &:before, &:after {
                content: "";
                display: block;
                position: absolute;
                width: 100%;
                height: 1px;
                left: 0;
            }
            &:before {
                bottom: 1px;
            }
            &:after {
                bottom: 0;
            }
        }
    }

    .info {
        padding: 1em;
        a {
            color: dimgray;
            text-decoration: none;
            cursor: pointer;
            margin-right: 1em;
        }
    }

    table {
        width: 100%;
        border-collapse: collapse;
        tr {
            padding: 0 0.5em;
            position: relative;
            &:before {
                content: "";
                display: block;
                height: 1px;
                /*background-color: red;*/
                position: absolute;
                width: 100%;
            }
        }
        th, td {
            padding: 0.75em 0.5em calc(0.75em + 2px);
            vertical-align: top;
        }
        th {
            text-align: right;
            font-weight: normal;
        }
        td {
            text-align: left;
        }
    }

    input[type="text"] {
        width: 100%;
    }

    .p-0 {
        padding: 0;
    }

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
    import {fs, path} from "../index";

    declare const SystemPath: any;

    @Component
    export default class Panel extends Vue {
        flaData: any = {};
        target: string = "hoge";
        flaPath: string = "";
        flaName: string = "";
        targetPath: string = "";
        targetPathStatus: number = 404;

        private watcher: any;
        private timeoutId: number;

        private updateOption() {
            fl.flaDataUpdate(this.flaData);
        }

        startWatch() {
            console.log("startWatch");
            if (this.watcher) this.watcher.close();
            let path = fs.realpathSync(this.flaPath + "/" + this.targetPath);
            try {
                this.targetPathStatus = 200;
                fs.accessSync(path);
                let id = 0;
                this.watcher = fs.watch(path, () => {
                    clearTimeout(id);
                    id = setTimeout(() => {
                        if (!this.isWatch) return;
                        this.deploy();
                    }, 500);
                });
            } catch (e) {
                this.targetPathStatus = 404;
                fl.run(`fl.trace('Not Found:${path}')`);
            }

//            this.updateOption();
        }

        ssListUpdate() {
            console.log("ssListUpdate");
            let ssList: any[] = this.flaData.ssList;

            for (let i = ssList.length - 1; i >= 0; i--) {
                let item: any = ssList[i];
                if (item.path == "") {
                    // empty item > delete
                    ssList.splice(i, 1);
                } else if (!item.path.match(/\.(json)$/i)) {
                    // not json file
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
            if (ssList.length == 0 || ssList[ssList.length - 1].path != "") {
                ssList.push({path: "", status: 0});
            }

            this.updateOption();
        }

        deploy() {
            console.log("deploy");
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

            let targetFullPath = fs.realpathSync(this.flaPath + "/" + this.targetPath);
            let targetDir = targetFullPath.match(/^.*\\/)[0];
//            console.log("targetFullPath", targetFullPath);
            let targetJs: string = fs.readFileSync(targetFullPath, 'utf8');
            if (targetJs.indexOf("// Converted with cjsSupporter") >= 0) {
                return fl.run(`fl.trace('cjsSupporter Converted')`);
            }

            // all ready
            let _ssMetadata = [];
//            window.targetJs = targetJs;
            let _manifest = eval(targetJs.match(/manifest: ([^\]]+)/)[1] + "]");

            try {
                for (let item: any of ssList) {
                    // a sprite sheet
                    if (item.status == 0) continue;
                    let jsonPath = fs.realpathSync(this.flaPath + "/" + item.path);
                    let jsonDir = jsonPath.match(/^.*\\/)[0];
                    let ssJson: any = JSON.parse(
                        fs.readFileSync(jsonPath, 'utf8')
                            .match(/{([^?]+)/)[0]
                    );
                    let result: any = {
                        name: ssJson.meta.image.match(/(.*)(?:\.([^.]+$))/)[1],
                        frames: []
                    };
                    let index = 0;
                    for (let key: string in ssJson.frames) {
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
                        src: path.relative(targetDir, jsonDir).replace(/\\/g, "/") + "/" + ssJson.meta.image
                        , id: result.name
                    })
                }
                targetJs = "// Converted with cjsSupporter\n\r"
                    + targetJs.replace(/ssMetadata([^;]+)/, "ssMetadata = " + JSON.stringify(_ssMetadata))
                        .replace(/manifest: ([^\]]+)]/, "manifest: " + JSON.stringify(_manifest));

                // write
                fs.writeFileSync(targetFullPath, targetJs);
            } catch (e) {
                console.log(e);
            }
        }

        set isWatch(v: boolean) {
            this.flaData.isWatch = v;
            this.updateOption();
        }

        get isWatch(): boolean {
            return this.flaData.isWatch;
        }

        openBrowser(url: string) {
            let rootDir = "/";
            let processPath = "/usr/bin/open";
            let isWindows = window.navigator.platform.toLowerCase().indexOf("win") > -1;
            if (isWindows) {
                rootDir = fl.CSIF.getSystemPath(SystemPath.COMMON_FILES).substring(0, 3);
                processPath = rootDir + "Windows/explorer.exe";
            }
            window.cep.process.createProcess(processPath, url);
        }
    }
</script>