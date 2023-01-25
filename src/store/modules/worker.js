import Vue from "vue";
import axios from "axios";

const worker = {
    namespaced: true,
    state: () => ({
        workers: [],
        worker_actions: [],
        worker_state: "done",
        table_loading: false,
        workerQuery: "",
        selected_object: {},
        isEdit: false,
        pageCount: 1,
        // params: {
        //     page: 1,
        //     itemsPerPage: 10,
        // },
        params: {
            dropdown: true,
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 3,
        },
    }),
    getters: {},
    mutations: {

        worker_dropdown_success(state, workers) {

            state.table_loading = false;
            if (workers.length == 0) {
                state.worker_state = "finished";
                if (state.params.page > 1)
                    state.params.page = state.params.page - 1;
                return;
            }
            state.params.page = state.params.page + 1;
            workers.forEach((worker) => {
                state.workers.push(worker);
            });
            state.worker_state = "done";
        },
        workers_success(state, workers) {
            state.workers.splice(0, state.workers.length)
            workers.forEach(element => {
                state.workers.push(element)
            });
            state.worker_state = "done"
            state.table_loading = false
        },
        show_actions(state, worker) {
            state.worker_actions.push(worker);
            // Object.assign(state.worker_actions, worker)
            console.log(state.worker_actions)
            console.log(worker)
        },
        workers_request(state) {
            state.worker_state = "loading";
        },
        workers_error(state) {
            state.worker_state = "error";
        },
        add_worker_success(state, worker) {
            state.workers.push(worker);
            state.worker_state = "done";
            state.table_loading = false;
            console.log(worker);
        },
        worker_edit_success(state, worker) {
            let index = state.workers.findIndex((e) => e.id == worker.id);
            Vue.set(state.workers, index, worker);
            state.worker_state = "done";
            state.table_loading = false;
        },
        delete_worker(state, worker) {
            let index = state.workers.findIndex((e) => e.id == worker.id);
            state.workers.splice(index, 1)
            state.worker_state = "done";
            state.table_loading = false;
        },
    },
    actions: {
        async resetFields({ state }) {
            state.worker_state = "done";
            // state.workers = [];
            state.worker_actions = [];
            state.table_loading = false;
            // state.params = {
            //     dropdown: true,
            //     page: 1,
            //     itemsPerPage: 10,
            // };
            state.params = {
                dropdown: true,
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 3,
            };
        },
        async getWorkers({ commit, state, dispatch, rootState }) {
            if (state.worker_state != "done") return -1;
            state.table_loading = true;
            let data = state.params;
            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;
            let query = "";
            if (
                state.workerQuery != undefined &&
                state.workerQuery != null &&
                state.workerQuery.length > 0
            ) query = `&query=${state.workerQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_workers" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;

                    if (data.dropdown == false) {
                        commit('workers_success', resp.data.result)
                        dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    } else {
                        commit("worker_dropdown_success", resp.data.result);
                    }


                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("workers_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },

        async addWorker({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("workers_request");
                axios({
                    url: `${rootState.server}` + "/api/add_worker",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_worker_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("workers_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            });
        },

        async editWorker({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("workers_request");
                axios({
                    url: `${rootState.server}` + "/api/edit_worker",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("worker_edit_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("workers_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },

        async deleteWorker({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("workers_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_worker",
                    data: { worker_id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_worker", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("workers_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async showActions({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            let worker_id = ""
            if (data != undefined || data != null) {
                worker_id = "?worker_id=" + data.id
            } else {
                worker_id = ""
            }
            return new Promise((resolve) => {
                commit("workers_request");
                axios({
                    url: `${rootState.server}` + "/api/show_actions_worker" + worker_id,
                    method: "get",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit('show_actions', resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("workers_error");
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
export default worker;
