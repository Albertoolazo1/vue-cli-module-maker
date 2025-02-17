// Importando los módulos necesarios
const fs = require('fs'); // Requerido para interactuar con el sistema de archivos
const { handleSaveFile } = require('.'); // Importa la función auxiliar para guardar archivos

// Función para construir el archivo de datos
function buildFileData(respuestas) {
    // Crear el contenido del archivo data
    const fileContentData = buildFileContentData(respuestas);
    handleSaveFile(respuestas.pathFiles, respuestas.fileNameData, fileContentData); // Guardar el archivo de datos
}

// Función para construir el archivo del controlador
function buildFileController(respuestas) {
    // Crear el contenido del archivo controller
    const fileContentController = buildFileContentController(respuestas);
    handleSaveFile(respuestas.pathFiles, respuestas.fileNameController, fileContentController); // Guardar el archivo del controlador
}

// Función para construir el contenido del archivo de datos
function buildFileContentData(respuestas) {
    return `import { ${respuestas.nameService} } from '@/_services';

const SERVICE = ${respuestas.nameService}; // Servicio a utilizar
const CONTROLLER = "${respuestas.nameController}/"; // Ruta del controlador
const actionShowAppMessage = "app/showAppMessage"; // Acción para mostrar mensajes de la app
const actionShowSystemAlert = "alert/SHOW_ERROR_ALERT"; // Acción para mostrar alertas del sistema
const nombre = "${respuestas.nameSingular}" // Nombre en singular del objeto

const actions = {
    // Acción para mostrar los registros
    showRecords({ dispatch, commit }, itemRequest) {
        const mutateLoading = CONTROLLER.concat("mutateLoadingListar");
        const actionSuccess = CONTROLLER.concat("successListar");

        let mensajeError = "Ocurrió un error al obtener los datos (" + nombre + "),";
        commit(mutateLoading, true, { root: true });
        dispatch('alert/CLEAR_ALERT', '', { root: true });

        SERVICE.showRecords(itemRequest)
            .then(
                response => {
                    if (response.code != 0) {
                        const { code, body, message } = response;

                        if (code > 0) {
                            if (body.length > 0) {
                                dispatch(actionSuccess, body, { root: true });
                            } else {
                                dispatch(actionShowAppMessage, { type: "error", text: "No hay monedas disponibles." }, { root: true });
                            }
                        } else {
                            console.error('Error-' + message);
                        }
                    } else {
                        dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                        console.error('Error with code-' + response.code + ": ", response.message);
                    }
                },
                error => {
                    dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                    console.error('Exception Error:', error);
                }
            ).finally(() => {
                commit(mutateLoading, false, { root: true });
            });
    },
    // Acción para guardar un registro
    saveRecord({ dispatch, commit }, itemRequest) {
        const mutateLoading = CONTROLLER.concat("mutateLoadingGuardar");
        const actionSuccess = CONTROLLER.concat("successGuardar");

        let mensajeError = "Ocurrió un error al guardar el elemento (" + nombre + "),";

        commit(mutateLoading, true, { root: true });
        dispatch('alert/CLEAR_ALERT', '', { root: true });

        SERVICE.saveRecord(itemRequest)
            .then(
                response => {
                    if (response.code != 0) {
                        const { code, message } = response;

                        if (code > 0) {
                            dispatch(actionSuccess, {}, { root: true });
                            dispatch(actionShowAppMessage, { type: "success", text: "Guardado correctamente." }, { root: true });
                        } else {
                            console.error('Error-' + message);
                        }
                    } else {
                        dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                        console.error('Error with code-' + response.code + ": ", response.message);
                    }
                },
                error => {
                    dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                    console.error('Exception Error:', error);
                }
            ).finally(() => {
                commit(mutateLoading, false, { root: true });
            });
    },
    // Acción para actualizar un registro
    updateRecord({ dispatch, commit }, itemRequest) {
        const mutateLoading = CONTROLLER.concat("mutateLoadingGuardar");
        const actionSuccess = CONTROLLER.concat("successGuardar");

        let mensajeError = "Ocurrió un error al guardar el elemento (" + nombre + "),";

        commit(mutateLoading, true, { root: true });
        dispatch('alert/CLEAR_ALERT', '', { root: true });

        SERVICE.updateRecord(itemRequest)
            .then(
                response => {
                    if (response.code != 0) {
                        const { code, message } = response;

                        if (code > 0) {
                            dispatch(actionSuccess, {}, { root: true });
                            dispatch(actionShowAppMessage, { type: "success", text: "Guardado correctamente." }, { root: true });
                        } else {
                            console.error('Error-' + message);
                        }
                    } else {
                        dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                        console.error('Error with code-' + response.code + ": ", response.message);
                    }
                },
                error => {
                    dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                    console.error('Exception Error:', error);
                }
            ).finally(() => {
                commit(mutateLoading, false, { root: true });
            });
    },
    // Acción para eliminar un registro
    deleteRecord({ dispatch, commit }, itemRequest) {
        const mutateLoading = CONTROLLER.concat("mutateLoadingEliminar");
        const actionSuccess = CONTROLLER.concat("successEliminar");

        let mensajeError = "Ocurrió un error al eliminar el elemento (" + nombre + "),";

        commit(mutateLoading, true, { root: true });
        dispatch('alert/CLEAR_ALERT', '', { root: true });

        SERVICE.deleteRecord(itemRequest)
            .then(
                response => {
                    if (response.code != 0) {
                        const { code, message } = response;

                        if (code > 0) {
                            dispatch(actionSuccess, {}, { root: true });
                            dispatch(actionShowAppMessage, { type: "success", text: "Eliminado correctamente." }, { root: true });
                        } else {
                            console.error('Error-' + message);
                        }
                    } if (response.status === 204) {
                        dispatch(actionSuccess, {}, { root: true });
                        dispatch(actionShowAppMessage, { type: "success", text: "Eliminado correctamente." }, { root: true });
                    } else {
                        dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                        console.error('Error with code-' + response.code + ": ", response.message);
                    }
                },
                error => {
                    dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                    console.error('Exception Error:', error);
                }
            ).finally(() => {
                commit(mutateLoading, false, { root: true });
            });
    },

    // Solo select genérico
    showRecordsSelect({ dispatch, commit }, itemRequest) {
        const mutateLoading = CONTROLLER.concat("mutateLoadingObtenerSelect");
        const actionSuccess = CONTROLLER.concat("successObtenerListaSelect");

        let mensajeError = "Ocurrió un error al llenar la lista desplegable (" + nombre + "),";

        commit(mutateLoading, true, { root: true });
        dispatch('alert/CLEAR_ALERT', '', { root: true });

        SERVICE.showRecords(itemRequest)
            .then(
                response => {
                    if (response.code != 0) {
                        const { code, body, message } = response;

                        if (code > 0) {
                            if (body.length > 0) {
                                dispatch(actionSuccess, body, { root: true });
                            } else {
                                dispatch(actionShowAppMessage, { type: "error", text: "No hay información que mostrar." }, { root: true });
                            }
                        } else {
                            console.error('Error-' + message);
                        }
                    } else {
                        dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                        console.error('Error with code-' + response.code + ": ", response.message);
                    }
                },
                error => {
                    dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                    console.error('Exception Error:', error);
                }
            ).finally(() => {
                commit(mutateLoading, false, { root: true });
            });
    },
}

export const ${respuestas.nameData} = {
    namespaced: true,
    actions,
}`;
}

// Función para construir el contenido del archivo del controlador
function buildFileContentController(respuestas) {
    return `import ${respuestas.nameClass} from "@/models${respuestas.pathClass}";

const DATA = "${respuestas.nameData}";

const state = {
    item: new ${respuestas.nameClass}(),
    lista: [],
    loadingListar: false,
    loadingGuardar: false,
    loadingEliminar: false,
    showFormAgregar: false,
    listaSelect: [],
    loadingSelect: false,
}

const mutations = {
    mutateLoadingListar(state, payload) { state.loadingListar = payload; },
    mutateLoadingGuardar(state, payload) { state.loadingGuardar = payload; },
    mutateLoadingEliminar(state, payload) { state.loadingEliminar = payload; },
    mutateLoadingSelect(state, payload) { state.loadingSelect = payload; },
    mutateShowFormAgregar(state, payload) { state.showFormAgregar = payload; },
    setListaSelect(state, payload) { state.listaSelect = payload; },
    setLista(state, payload) { state.lista = payload; },
}

const actions = {
    async showRecords({ dispatch, commit }, itemRequest) {
        await dispatch(DATA + "/showRecords", itemRequest, { root: true });
    },

    async saveRecord({ dispatch, commit }, itemRequest) {
        await dispatch(DATA + "/saveRecord", itemRequest, { root: true });
    },

    async updateRecord({ dispatch, commit }, itemRequest) {
        await dispatch(DATA + "/updateRecord", itemRequest, { root: true });
    },

    async deleteRecord({ dispatch, commit }, itemRequest) {
        await dispatch(DATA + "/deleteRecord", itemRequest, { root: true });
    },

    async showRecordsSelect({ dispatch, commit }, itemRequest) {
        await dispatch(DATA + "/showRecordsSelect", itemRequest, { root: true });
    },
}

const getters = {
    getLista(state) {
        return state.lista;
    },

    getItem(state) {
        return state.item;
    },

    getListaSelect(state) {
        return state.listaSelect;
    },

    getLoadingListar(state) {
        return state.loadingListar;
    },

    getLoadingGuardar(state) {
        return state.loadingGuardar;
    },

    getLoadingEliminar(state) {
        return state.loadingEliminar;
    },

    getLoadingSelect(state) {
        return state.loadingSelect;
    },

    getShowFormAgregar(state) {
        return state.showFormAgregar;
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
`;
}

// Exportando las funciones para ser utilizadas en otros archivos
module.exports = {
    buildFileData,
    buildFileController,
    buildFileContentData,
    buildFileContentController,
};
