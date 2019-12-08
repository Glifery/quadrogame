import {Stage} from "konva/types/Stage";
import {Layer} from "konva/types/Layer";
import * as konva from "konva";

const Konva: any = konva;

export class KonvaAdapter {
    private unique: number;
    private layer: Layer;

    constructor(width: number, height: number, offsetX: number, offsetY: number, zIndex: number = 0) {
        this.unique = Math.round(Math.random() * 1000);

        const element = document.createElement('div');

        element.setAttribute("id", `container_${this.unique}`);
        element.setAttribute("class", 'canvas_container');
        element.setAttribute("style", `left: ${offsetX}px; top: ${offsetY}px; z-index: ${zIndex}`);
        document.getElementById('canvas_containers').appendChild(element);

        const stage: Stage = new Konva.Stage({
            container: `container_${this.unique}`,
            width: width,
            height: height
        });
        this.layer = new Konva.Layer();
        stage.add(this.layer);
    }

    getUnique(): number {
        return this.unique;
    }

    getLayer(): Layer {
        return this.layer;
    }
}