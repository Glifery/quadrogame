import {TemporaryEntity} from "./TemporaryEntity";
import {DynamicLineBBox} from "../model/bbox/DynamicLineBBox";
import * as konva from 'konva';
import {Representation} from "../model/Representation";
import {Weapon} from "../game/Weapon";

const Konva: any = konva;

export class Bullet extends TemporaryEntity {
    private weapon: Weapon;

    constructor(weapon: Weapon, x: number, y: number, dir: number = 0) {
        super(x, y, dir);

        this.weapon = weapon;
    }

    init(): void {
        this.getHandlerMetadata('main').set('radius', 1);
        this.getHandlerMetadata('main').set('mass', 0);

        this.getHandlerMetadata('CollisionBehavior').set('bullet', true);
        this.getHandlerMetadata('CollisionBehavior').set('weapon', this.weapon);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new DynamicLineBBox(this.getHandlerMetadata('main').get('mass'), 0, 0, 0, 0));

        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => new Konva.Circle({
            x: 0,
            y: 0,
            radius: this.getHandlerMetadata('main').get('radius'),
            fill: 'black'
        }));
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation, graphicElement: any) => {
            const projection = representation.getProjection();

            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(this.getHandlerMetadata('main').get('radius') * projection.getScale());
        });
    }
}