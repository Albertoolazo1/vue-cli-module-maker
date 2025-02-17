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
const nombre = "${respuestas.nameSingular}"; // Nombre en singular del objeto

export const use${respuestas.nameData}Store = defineStore("${respuestas.nameData}", {
    actions: {
        // Acción para mostrar los registros
        async showRecords(itemRequest: any) {
            const mutateLoading = CONTROLLER.concat("mutateLoadingListar");
            const actionSuccess = CONTROLLER.concat("successListar");
            let mensajeError = "Ocurrió un error al obtener los datos (" + nombre + "),";

            this.$store.commit(mutateLoading, true, { root: true });
            this.$store.dispatch('alert/CLEAR_ALERT', '', { root: true });

            try {
                const response = await SERVICE.showRecords(itemRequest);
                if (response.code !== 0) {
                    const { code, body, message } = response;
                    if (code > 0) {
                        if (body.length > 0) {
                            this.$store.dispatch(actionSuccess, body, { root: true });
                        } else {
                            this.$store.dispatch(actionShowAppMessage, { type: "error", text: "No hay monedas disponibles." }, { root: true });
                        }
                    } else {
                        console.error('Error-' + message);
                    }
                } else {
                    this.$store.dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                    console.error('Error with code-' + response.code + ": ", response.message);
                }
            } catch (error) {
                this.$store.dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                console.error('Exception Error:', error);
            } finally {
                this.$store.commit(mutateLoading, false, { root: true });
            }
        },

        // Acción para guardar un registro
        async saveRecord(itemRequest: any) {
            const mutateLoading = CONTROLLER.concat("mutateLoadingGuardar");
            const actionSuccess = CONTROLLER.concat("successGuardar");
            let mensajeError = "Ocurrió un error al guardar el elemento (" + nombre + "),";

            this.$store.commit(mutateLoading, true, { root: true });
            this.$store.dispatch('alert/CLEAR_ALERT', '', { root: true });

            try {
                const response = await SERVICE.saveRecord(itemRequest);
                if (response.code !== 0) {
                    const { code, message } = response;
                    if (code > 0) {
                        this.$store.dispatch(actionSuccess, {}, { root: true });
                        this.$store.dispatch(actionShowAppMessage, { type: "success", text: "Guardado correctamente." }, { root: true });
                    } else {
                        console.error('Error-' + message);
                    }
                } else {
                    this.$store.dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                    console.error('Error with code-' + response.code + ": ", response.message);
                }
            } catch (error) {
                this.$store.dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                console.error('Exception Error:', error);
            } finally {
                this.$store.commit(mutateLoading, false, { root: true });
            }
        },

        // Acción para actualizar un registro
        async updateRecord(itemRequest: any) {
            const mutateLoading = CONTROLLER.concat("mutateLoadingGuardar");
            const actionSuccess = CONTROLLER.concat("successGuardar");
            let mensajeError = "Ocurrió un error al guardar el elemento (" + nombre + "),";

            this.$store.commit(mutateLoading, true, { root: true });
            this.$store.dispatch('alert/CLEAR_ALERT', '', { root: true });

            try {
                const response = await SERVICE.updateRecord(itemRequest);
                if (response.code !== 0) {
                    const { code, message } = response;
                    if (code > 0) {
                        this.$store.dispatch(actionSuccess, {}, { root: true });
                        this.$store.dispatch(actionShowAppMessage, { type: "success", text: "Guardado correctamente." }, { root: true });
                    } else {
                        console.error('Error-' + message);
                    }
                } else {
                    this.$store.dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                    console.error('Error with code-' + response.code + ": ", response.message);
                }
            } catch (error) {
                this.$store.dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                console.error('Exception Error:', error);
            } finally {
                this.$store.commit(mutateLoading, false, { root: true });
            }
        },

        // Acción para eliminar un registro
        async deleteRecord(itemRequest: any) {
            const mutateLoading = CONTROLLER.concat("mutateLoadingEliminar");
            const actionSuccess = CONTROLLER.concat("successEliminar");
            let mensajeError = "Ocurrió un error al eliminar el elemento (" + nombre + "),";

            this.$store.commit(mutateLoading, true, { root: true });
            this.$store.dispatch('alert/CLEAR_ALERT', '', { root: true });

            try {
                const response = await SERVICE.deleteRecord(itemRequest);
                if (response.code !== 0 || response.status === 204) {
                    this.$store.dispatch(actionSuccess, {}, { root: true });
                    this.$store.dispatch(actionShowAppMessage, { type: "success", text: "Eliminado correctamente." }, { root: true });
                } else {
                    this.$store.dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                    console.error('Error with code-' + response.code + ": ", response.message);
                }
            } catch (error) {
                this.$store.dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                console.error('Exception Error:', error);
            } finally {
                this.$store.commit(mutateLoading, false, { root: true });
            }
        },

        // Solo select genérico
        async showRecordsSelect(itemRequest: any) {
            const mutateLoading = CONTROLLER.concat("mutateLoadingObtenerSelect");
            const actionSuccess = CONTROLLER.concat("successObtenerListaSelect");
            let mensajeError = "Ocurrió un error al llenar la lista desplegable (" + nombre + "),";

            this.$store.commit(mutateLoading, true, { root: true });
            this.$store.dispatch('alert/CLEAR_ALERT', '', { root: true });

            try {
                const response = await SERVICE.showRecords(itemRequest);
                if (response.code !== 0) {
                    const { code, body, message } = response;
                    if (code > 0) {
                        if (body.length > 0) {
                            this.$store.dispatch(actionSuccess, body, { root: true });
                        } else {
                            this.$store.dispatch(actionShowAppMessage, { type: "error", text: "No hay información que mostrar." }, { root: true });
                        }
                    } else {
                        console.error('Error-' + message);
                    }
                } else {
                    this.$store.dispatch(actionShowSystemAlert, mensajeError + " verifique la información e inténtelo de nuevo.", { root: true });
                    console.error('Error with code-' + response.code + ": ", response.message);
                }
            } catch (error) {
                this.$store.dispatch(actionShowSystemAlert, mensajeError + " inténtelo de nuevo más tarde.", { root: true });
                console.error('Exception Error:', error);
            } finally {
                this.$store.commit(mutateLoading, false, { root: true });
            }
        },
    },
});
`;
}

// Función para construir el contenido del archivo del controlador
function buildFileContentController(respuestas) {
    return `import { defineStore } from 'pinia';
import ${respuestas.nameClass} from "@/models${respuestas.pathClass}";

const DATA = "${respuestas.nameData}";

export const use${respuestas.nameClass}Store = defineStore("${respuestas.nameClass}", {
    state: () => ({
        item: new ${respuestas.nameClass}(),
        lista: [] as ${respuestas.nameClass}[],
        loadingListar: false,
        loadingGuardar: false,
        loadingEliminar: false,
        showFormAgregar: false,
        listaSelect: [] as ${respuestas.nameClass}[],
        loadingSelect: false,
    }),

    actions: {
        async showRecords(itemRequest: any) {
            await this.$store.dispatch(DATA + "/showRecords", itemRequest);
        },

        async saveRecord(itemRequest: any) {
            await this.$store.dispatch(DATA + "/saveRecord", itemRequest);
        },

        async updateRecord(itemRequest: any) {
            await this.$store.dispatch(DATA + "/updateRecord", itemRequest);
        },

        async deleteRecord(itemRequest: any) {
            await this.$store.dispatch(DATA + "/deleteRecord", itemRequest);
        },

        async showRecordsSelect(itemRequest: any) {
            await this.$store.dispatch(DATA + "/showRecordsSelect", itemRequest);
        },
    },

    getters: {
        getLista: (state) => state.lista,
        getItem: (state) => state.item,
        getListaSelect: (state) => state.listaSelect,
        getLoadingListar: (state) => state.loadingListar,
        getLoadingGuardar: (state) => state.loadingGuardar,
        getLoadingEliminar: (state) => state.loadingEliminar,
        getLoadingSelect: (state) => state.loadingSelect,
        getShowFormAgregar: (state) => state.showFormAgregar,
    },
});
`;
}


// Exportando las funciones para ser utilizadas en otros archivos
module.exports = {
    buildFileData,
    buildFileController,
    buildFileContentData,
    buildFileContentController,
};
