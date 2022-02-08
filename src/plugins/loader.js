import Vue from 'vue';

class Loader {
    constructor() {
        this.VM = new Vue({
            data: () => ({
                status: false
            }),
        });
    }
    get state() {
        return this.VM.$data;
    }
    show() {
        this.VM.$data.status = true;
    }
    hide() {
        this.VM.$data.status = false;
    }
}

const loader = {
    Store: Loader,
    install (Vue, options) {
        Vue.mixin({
            beforeCreate() {
                this.$loading = options.store;
            }
        });
    },

};
export default loader;