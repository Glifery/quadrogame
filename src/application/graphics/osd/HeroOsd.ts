import {Entity} from "../../../domain/model/Entity";
import * as konva from "konva";
import {Rect} from "konva/types/shapes/Rect";
import {Unit} from "../../../domain/entity/Unit";
import {EntityRelatedOsd} from "./EntityRelatedOsd";
import {Text} from "konva/types/shapes/Text";

const Konva: any = konva;

export class HeroOsd extends EntityRelatedOsd {
    private text: Text;
    private healthBar: Rect;
    private healthStatus: Rect;

    constructor(entity: Entity, width: number, height: number, offsetX: number, offsetY: number) {
        super(entity, width, height, offsetX, offsetY, 10);

        this.text = new Konva.Text({
            x: 10,
            y: 15,
            text: 'Simple Text',
            fontSize: 30,
            fontFamily: 'Calibri',
            fill: 'blue'
        });
        this.healthBar = new Konva.Rect({
            y: 50,
            width: 200,
            height: 10,
            fill: false,
            stroke: 'blue',
            strokeWidth: 2
        });
        this.healthStatus = new Konva.Rect({
            y: 50,
            width: 200,
            height: 10,
            fill: 'red',
            stroke: 'blue',
            strokeWidth: 0
        });

        this.konvaAdapter.getLayer().add(this.text);
        this.konvaAdapter.getLayer().add(this.healthBar);
        this.konvaAdapter.getLayer().add(this.healthStatus);
    }

    protected rerender(): void {
        let percent: number;
        let speed: number;
        let acceleration: number;

        if (this.entity && (this.entity instanceof Unit)) {
            percent = this.entity.getArmor().getHealth() / this.entity.getArmor().getMaxHealth();
            speed = Math.round(this.entity.getPosition().getSpeed().getDis());
            acceleration = Math.round(this.entity.getPosition().getAccel().getDis());

            this.healthStatus.setAttr('width', 200 * percent);

            this.healthBar.setAttr('visible', true);
            this.healthStatus.setAttr('visible', true);

            this.text.setAttr('text', `Acc: ${acceleration}, Sp: ${speed}`);
        } else {
            this.healthBar.setAttr('visible', false);
            this.healthStatus.setAttr('visible', false);
        }

        super.rerender();
    }
}