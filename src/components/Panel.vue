<template lang="pug">
    #Panel
        .info
        table.settings
            tr.watch
                th Watch
                td
                    input#hoge(type="checkbox",v-model="watch")

            tr.target
                th Target
                td
                    input(type="text",v-model="flaData.targetPath",@keyup="targetPathUpdate")

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
                            td
                                button() <
                            td
                                button() >
                            td
                                button() ×

            tr.deploy(data-js="deploy")
                th Deploy
                td
                    button.topcoat-button.hostFontSize Deploy
</template>
<style lang="scss" scoped>

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

        private watcher: any;

        private updateOption() {
            fl.flaDataUpdate(this.flaData);
        }

        targetPathUpdate() {
            if (this.watcher) this.watcher.close();

//            let fs = eval("require('fs')");
            let path = this.flaPath + this.flaData.targetPath;
            try {
                fs.accessSync(path);
                let id = 0;
                this.watcher = fs.watch(path, () => {
                    clearTimeout(id);
                    id = setTimeout(() => this.onTargetUpdate(), 500);
                });
            } catch (e) {
                console.log("not file", path);
            }

            this.updateOption();
        }

        ssListUpdate() {
            let ssList: any[] = this.flaData.ssList;
            if (ssList.length == 0 || ssList[ssList.length - 1].path != "") {
                ssList.push({path: ""});
            }
            this.updateOption();
        }

        onTargetUpdate() {
            let v = fs.readFileSync(this.flaPath + this.flaData.targetPath, 'utf8');
            console.log(v);
        }

        set watch(v: boolean) {
        }
    }
</script>