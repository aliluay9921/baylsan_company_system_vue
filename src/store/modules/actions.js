import Vue from "vue";
import axios from "axios";

const actions = {
    namespaced: true,
    state: () => ({
        logs: [],
        log_state: "done",
        table_loading: false,
        logQuery: "",
        filter: {},
        pageCount: 1,
        params: {
            dropdown: true,
            page: 1,
            itemsPerPage: 50,
        },
    }),
    getters: {},
    mutations: {
        logs_success(state, logs) {
            state.logs.splice(0, state.logs.length)
            logs.forEach(element => {
                state.logs.push(element)
            });
            state.log_state = "done"
            state.table_loading = false
        },

        logs_request(state) {
            state.log_state = "loading";
        },
        logs_error(state) {
            state.log_state = "error";
        },
        withdraw_box(state, sale) {
            state.logs.unshift(sale);
            state.log_state = "done";
            state.table_loading = false;
            console.log(sale);
        },
    },
    actions: {
        async resetFields({ state }) {
            state.log_state = "done";
            state.table_loading = false;
            state.params = {
                dropdown: true,
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getLogs({ commit, state, dispatch, rootState }) {
            if (state.log_state != "done") return -1;
            state.table_loading = true;
            let data = state.params;
            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;
            let query = "";
            var filter = "";
            if (Object.keys(state.filter).length != 0)
                filter = "&filter=" + JSON.stringify(state.filter);
            if (
                state.logQuery != undefined &&
                state.logQuery != null &&
                state.logQuery.length > 0
            ) query = `&query=${state.logQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_logs" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query + filter,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('logs_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("logs_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },

        async withdrawFromBox({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("logs_request");
                axios({
                    url: `${rootState.server}` + "/api/withdraw_from_box",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("withdraw_box", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("logs_error");
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
        //         commit("logs_request");
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
        //             commit("logs_error");
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
                commit("logs_request");
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
                    commit("logs_error");
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
export default actions;
