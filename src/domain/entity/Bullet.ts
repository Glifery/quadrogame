import {TemporaryEntity} from "./TemporaryEntity";
import {DynamicLineBBox} from "../model/bbox/DynamicLineBBox";
import * as konva from 'konva';
import {Representation} from "../model/Representation";

const Konva: any = konva;

export class Bullet extends TemporaryEntity {
    init(): void {
        this.getHandlerMetadata('main').set('radius', 1);
        this.getHandlerMetadata('main').set('mass', 0);

        this.getHandlerMetadata('CollisionBehavior').set('bullet', true);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new DynamicLineBBox(this.getHandlerMetadata('main').get('mass'), 0, 0, 0, 0));

        this.getHandlerMetadata('KonvaRendererStrategy').set('init', new Konva.Circle({
            x: 0,
            y: 0,
            radius: this.getHandlerMetadata('main').get('radius'),
            fill: 'white'
        }));
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation) => {
            const projection = representation.getProjection();
            const graphicElement = this.getHandlerMetadata('KonvaRendererStrategy').get('init');

            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(this.getHandlerMetadata('main').get('radius') * projection.getScale());
        });
    }
}