import Vue from "vue";
import axios from "axios";

const guarntee = {
    namespaced: true,
    state: () => ({
        guarntees: [],
        guarntee_state: "done",
        table_loading: false,
        guarnteeQuery: "",
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
        guarntees_success(state, guarntees) {
            state.guarntees.splice(0, state.guarntees.length)
            guarntees.forEach(element => {
                state.guarntees.push(element)
            });
            state.guarntee_state = "done"
            state.table_loading = false
        },

        guarntees_request(state) {
            state.guarntee_state = "loading";
        },
        guarntees_error(state) {
            state.guarntee_state = "error";
        },
        add_guarntee_success(state, guarntee) {
            state.guarntees.unshift(guarntee);
            state.guarntee_state = "done";
            state.table_loading = false;
            console.log(guarntee);
        },
        guarntee_edit_success(state, guarntee) {
            let index = state.guarntees.findIndex((e) => e.id == guarntee.id);
            Vue.set(state.guarntees, index, guarntee);
            state.guarntee_state = "done";
            state.table_loading = false;
        },


    },
    actions: {
        async resetFields({ state }) {
            state.guarntee_state = "done";
            state.table_loading = false;
            state.params = {
                dropdown: true,
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getGuarntees({ commit, state, dispatch, rootState }) {
            if (state.guarntee_state != "done") return -1;
            state.table_loading = true;
            let data = state.params;
            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;
            let query = "";
            if (
                state.guarnteeQuery != undefined &&
                state.guarnteeQuery != null &&
                state.guarnteeQuery.length > 0
            ) query = `&query=${state.guarnteeQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_guarantees" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('guarntees_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("guarntees_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },

        async addGuarntee({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("guarntees_request");
                axios({
                    url: `${rootState.server}` + "/api/add_guarantees",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_guarntee_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("guarntees_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            });
        },

        // async editguarntee({ commit, state, dispatch, rootState }, data) {
        //     state.table_loading = true
        //     return new Promise((resolve, reject) => {
        //         commit("guarntees_request");
        //         axios({
        //             url: `${rootState.server}` + "/api/edit_guarntee",
        //             data: data,
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             method: "PUT",
        //         }).then(resp => {
        //             state.table_loading = false
        //             commit("guarntee_edit_success", resp.data.result[0])
        //             dispatch(
        //                 "snackbarToggle",
        //                 { toggle: true, text: resp.data.message },
        //                 { root: true }
        //             );
        //             resolve(resp);
        //         }).catch((err) => {
        //             state.table_loading = false;
        //             commit("guarntees_error");
        //             dispatch(
        //                 "snackbarToggle",
        //                 { toggle: true, text: err.response.data.message },
        //                 { root: true }
        //             );

        //             console.warn(err);
        //         });
        //     });
        // },







    }

}
export default guarntee;
