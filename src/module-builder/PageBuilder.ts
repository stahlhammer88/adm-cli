import { makeAutoObservable } from "mobx";

export class PageBuilder {
    constructor() {
        makeAutoObservable(this)
    }
}