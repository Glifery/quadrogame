import {Entity} from "../../../domain/model/Entity";
import {KonvaAdapter} from "../adapter/KonvaAdapter";
import * as konva from "konva";
import {Text} from "konva/types/shapes/Text";

const Konva: any = konva;

export class SimpleOsd {
    private entity: Entity;
    private konvaAdapter: KonvaAdapter;
    private text: Text;

    constructor(entity: Entity, width: number, height: number, offsetX: number, offsetY: number) {
        this.entity = entity;
        this.konvaAdapter = new KonvaAdapter(width, height, offsetX, offsetY);

        this.text = new Konva.Text({
            x: 10,
            y: 15,
            text: 'Simple Text',
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'green'
        });
        this.konvaAdapter.getLayer().add(this.text);
    }

    setEntity(entity: Entity) {
        this.entity = entity;
    }

    startRendering(fps: number): SimpleOsd {
        setInterval(() => this.rerender(), 1000/fps);

        return this;
    }

    private rerender(): void {
        if (this.entity) {
            this.text.setAttr('text', `${this.entity.getArmor().getHealth()} / ${this.entity.getArmor().getMaxHealth()}`);
        } else {
            this.text.setAttr('text', 'No entity');
        }

        this.konvaAdapter.getLayer().draw();
    }
}