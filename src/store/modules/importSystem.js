import Vue from "vue";
import axios from "axios";

const importSystem = {
    namespaced: true,
    state: () => ({
        sales: [],
        sale_state: "done",
        table_loading: false,
        salesQuery: "",
        selected_object: {},
        isEdit: false,
        pageCount: 1,
        params: {
            dropdown: true,
            page: 1,
            itemsPerPage: 50,
        },
    }),
    getters: {},
    mutations: {
        sales_success(state, sales) {
            state.sales.splice(0, state.sales.length)
            sales.forEach(element => {
                state.sales.push(element)
            });
            state.sale_state = "done"
            state.table_loading = false
        },

        sales_request(state) {
            state.sale_state = "loading";
        },
        sales_error(state) {
            state.sale_state = "error";
        },
        add_sale_success(state, sale) {
            state.sales.push(sale);
            state.sale_state = "done";
            state.table_loading = false;
            console.log(sale);
        },
        sale_edit_success(state, sale) {
            let index = state.sales.findIndex((e) => e.id == sale.id);
            Vue.set(state.sales, index, sale);
            state.sale_state = "done";
            state.table_loading = false;
        },
        worker_recovery_success(state, sale) {
            let index = state.sales.findIndex((e) => e.id == sale.id);
            Vue.set(state.sales, index, sale);
            state.sale_state = "done";
            state.table_loading = false;
        },
        delete_sale(state, sale) {
            let index = state.sales.findIndex((e) => e.id == sale.id);
            state.sales.splice(index, 1)
            state.sale_state = "done";
            state.table_loading = false;
        },
    },
    actions: {
        async resetFields({ state }) {
            state.sale_state = "done";
            // state.sales = [];
            state.table_loading = false;
            state.params = {
                dropdown: true,
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getSales({ commit, state, dispatch, rootState }) {
            if (state.sale_state != "done") return -1;
            state.table_loading = true;
            let data = state.params;
            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;
            let query = "";
            if (
                state.salesQuery != undefined &&
                state.salesQuery != null &&
                state.salesQuery.length > 0
            ) query = `&query=${state.salesQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_sale_process_workers" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('sales_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("sales_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },

        async addSale({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("sales_request");
                axios({
                    url: `${rootState.server}` + "/api/sale_process_worker",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_sale_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("sales_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            });
        },

        // async editWorker({ commit, state, dispatch, rootState }, data) {
        //     state.table_loading = true
        //     return new Promise((resolve, reject) => {
        //         commit("sales_request");
        //         axios({
        //             url: `${rootState.server}` + "/api/edit_worker",
        //             data: data,
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             method: "PUT",
        //         }).then(resp => {
        //             state.table_loading = false
        //             commit("worker_edit_success", resp.data.result[0])
        //             dispatch(
        //                 "snackbarToggle",
        //                 { toggle: true, text: resp.data.message },
        //                 { root: true }
        //             );
        //             resolve(resp);
        //         }).catch((err) => {
        //             state.table_loading = false;
        //             commit("sales_error");
        //             dispatch(
        //                 "snackbarToggle",
        //                 { toggle: true, text: err.response.data.message },
        //                 { root: true }
        //             );

        //             console.warn(err);
        //         });
        //     });
        // },
        async recoveryWorker({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("sales_request");
                axios({
                    url: `${rootState.server}` + "/api/worker_recovery",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("worker_recovery_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("sales_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },






    }

}
export default importSystem;
