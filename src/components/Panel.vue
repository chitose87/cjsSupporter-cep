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
                    input(type="text",v-model="flaData.targetPath",@keyup="updateOption")

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
    import {Vue, Component, Prop, Watch} from "vue-property-decorator";
    import fl from "../fl";

    @Component
    export default class Panel extends Vue {
        flaData: any = {};
        target: string = "hoge";

        updateOption() {
            fl.flaDataUpdate(this.flaData);
        }

        ssListUpdate() {
            let ssList: any[] = this.flaData.ssList;
            if (ssList[ssList.length - 1].path != "") {
                ssList.push({path: ""});
            }
            this.updateOption();
        }

//        @Watch("target")
//        onTarget(newer, older) {
//            fl.flaDataUpdate("targetPath", newer);
//        }

        set watch(v: boolean) {

//            console.log(v);
        }

        sslist: { path: string }[] = [
            {path: "hogehoge"},
            {path: "hogehoge"},
            {path: "hogehoge"},
            {path: "hogehoge"}
        ];

//        @Prop() name: string;
//        @Prop() initialEnthusiasm: number;

//        enthusiasm = this.initialEnthusiasm;

        increment() {
//            this.enthusiasm++;
        }

        decrement() {
//            if (this.enthusiasm > 1) {
//                this.enthusiasm--;
//            }
        }

//        get exclamationMarks(): string {
//            return Array(this.enthusiasm + 1).join('!');
//        }
    }
</script>