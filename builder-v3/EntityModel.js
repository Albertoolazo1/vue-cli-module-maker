import { store } from '@/_store'; // Import the Vuex store

export default class EntityModel {

    constructor(CONTROLLER) {
        this.CONTROLLER = CONTROLLER; // Store the controller name for dispatching Vuex actions
    }

    /**
     * Dispatch an action to update item properties.
     * @param {Object} item - The item to update.
     */
    updateProperties(item) {
        store.dispatch(this.CONTROLLER.concat('/updateProperties'), item);
    }

    /**
     * Dispatch an action to fetch the list of items.
     */
    fetchList() {
        store.dispatch(this.CONTROLLER.concat('/fetch'));
    }

    /**
     * Dispatch an action to save a new item.
     */
    save() {
        store.dispatch(this.CONTROLLER.concat('/save'));
    }

    /**
     * Dispatch an action to update an existing item.
     * @param {Object} item - The item to update.
     */
    update(item) {
        store.dispatch(this.CONTROLLER.concat('/update'), item);
    }

    /**
     * Dispatch an action to delete an item, with a confirmation prompt.
     * @param {Object} item - The item to delete.
     */
    delete(item) {
        store.dispatch('app/showConfirmDelete', {
            title: "Delete?",
            description: "Are you sure you want to delete this item?",
            callback: () => {
                // If confirmed, dispatch delete action
                store.dispatch(this.CONTROLLER.concat('/delete'), item);
            },
        });
    }

    /**
     * Toggle the visibility of the "Add Form" in the UI.
     * @param {boolean} value - True to show, false to hide.
     */
    toggleShowAddForm(value) {
        store.dispatch(this.CONTROLLER.concat('/toggleShowAddForm'), value);
    }

    /**
     * Getters to retrieve state values from the store.
     */
    get showAddForm() {
        return store.state[this.CONTROLLER].showAddForm;
    }

    get list() {
        return store.state[this.CONTROLLER].list;
    }

    get loadingFetchList() {
        return store.state[this.CONTROLLER].loadingFetchList;
    }

    get loadingSave() {
        return store.state[this.CONTROLLER].loadingSave;
    }

    get loadingDelete() {
        return store.state[this.CONTROLLER].loadingDelete;
    }
}
