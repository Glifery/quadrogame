import {Entity} from "../../../domain/model/Entity";
import * as konva from "konva";
import {Rect} from "konva/types/shapes/Rect";
import {Unit} from "../../../domain/entity/Unit";
import {EntityRelatedOsd} from "./EntityRelatedOsd";

const Konva: any = konva;

export class HeroOsd extends EntityRelatedOsd {
    private healthBar: Rect;
    private healthStatus: Rect;

    constructor(entity: Entity, width: number, height: number, offsetX: number, offsetY: number) {
        super(entity, width, height, offsetX, offsetY, 10);

        this.healthBar = new Konva.Rect({
            y: 50,
            width: 200,
            height: 10,
            fill: false,
            stroke: 'black',
            strokeWidth: 2
        });
        this.healthStatus = new Konva.Rect({
            y: 50,
            width: 200,
            height: 10,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 0
        });

        this.konvaAdapter.getLayer().add(this.healthBar);
        this.konvaAdapter.getLayer().add(this.healthStatus);
    }

    protected rerender(): void {
        let percent: number;

        if (this.entity && (this.entity instanceof Unit)) {
            percent = this.entity.getArmor().getHealth() / this.entity.getArmor().getMaxHealth();

            this.healthStatus.setAttr('width', 200 * percent);

            this.healthBar.setAttr('visible', true);
            this.healthStatus.setAttr('visible', true);
        } else {
            this.healthBar.setAttr('visible', false);
            this.healthStatus.setAttr('visible', false);
        }

        super.rerender();
    }
}