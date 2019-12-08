import {KonvaAdapter} from "../adapter/KonvaAdapter";

export abstract class AbstractOsd {
    protected konvaAdapter: KonvaAdapter;

    constructor(width: number, height: number, offsetX: number, offsetY: number, zIndex: number = 0) {
        this.konvaAdapter = new KonvaAdapter(width, height, offsetX, offsetY, zIndex);
    }

    startRendering(fps: number): this {
        setInterval(() => this.rerender(), 1000/fps);

        return this;
    }

    protected rerender(): void {
        this.konvaAdapter.getLayer().draw();
    }
}