import Vue from "vue";
import HelloDecoratorComponent from "./components/HelloDecorator.vue";

let v = new Vue({
    el: "#app",
    template: `
    <div>
        Name: <input v-model="name" type="text">
        <h1>Hello Decorator Component</h1>
        <hello-decorator-component :name="name" :initialEnthusiasm="3" />
        </div>
    `,
    data: {name: "World"},
    components: {
        HelloDecoratorComponent
    }
});

