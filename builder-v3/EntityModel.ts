export default class EntityModel {
    public store: any;

    constructor(store: any) {
        this.store = store;
    }

    updateProperties(item: Record<string, any>): void {
        this.store?.updateProperties(item);  // Check for store before calling methods
    }

    fetchList(): void {
        this.store?.fetch();
    }

    save(): void {
        this.store?.save();
    }

    update(item: Record<string, any>): void {
        this.store?.update(item);
    }

    delete(item: Record<string, any>): void {
        if (this.store?.app) {
            this.store.app.showConfirmDelete({
                title: "Delete?",
                description: "Are you sure you want to delete this item?",
                callback: () => {
                    this.store.delete(item);
                },
            });
        }
    }

    toggleShowAddForm(value: boolean): void {
        this.store?.toggleShowAddForm(value);
    }

    get showAddForm(): boolean {
        return this.store?.showAddForm ?? false;
    }

    get list(): any[] {
        return this.store?.list ?? [];
    }

    get loadingFetchList(): boolean {
        return this.store?.loadingFetchList ?? false;
    }

    get loadingSave(): boolean {
        return this.store?.loadingSave ?? false;
    }

    get loadingDelete(): boolean {
        return this.store?.loadingDelete ?? false;
    }
}
