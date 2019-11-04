import {TemporaryEntity} from "./TemporaryEntity";
import {CircleBBox} from "../model/bbox/CircleBBox";
import * as konva from "konva";
import {Representation} from "../model/Representation";

const Konva: any = konva;

export class Grenade extends TemporaryEntity {
    init(): void {
        this.getHandlerMetadata('main').set('radius', 3);
        this.getHandlerMetadata('main').set('mass', 1);

        this.getHandlerMetadata('CollisionBehavior').set('reaction', true);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new CircleBBox(
            this.getHandlerMetadata('main').get('radius'),
            this.getHandlerMetadata('main').get('mass')
        ));

        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => new Konva.Circle({
            x: 0,
            y: 0,
            radius: this.getHandlerMetadata('main').get('radius'),
            fill: 'grey'
        }));
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation, graphicElement: any) => {
            const projection = representation.getProjection();

            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(this.getHandlerMetadata('main').get('radius') * projection.getScale());
        });
    }
}