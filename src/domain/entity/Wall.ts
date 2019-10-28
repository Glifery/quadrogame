import {Entity} from "../model/Entity";
import {Vector} from "../model/Vector";
import {LineBBox} from "../model/bbox/LineBBox";
import * as konva from "konva";
import {Representation} from "../model/Representation";

const Konva: any = konva;

export class Wall extends Entity {
    private vector: Vector;

    constructor(x: number, y: number, x2: number, y2: number) {
        super(x, y);

        this.vector = new Vector(x2 - x, y2 - y);
    }

    init(): void {
        this.getHandlerMetadata('main').set('mass', 0);

        this.getHandlerMetadata('CollisionBehavior').set('reaction', true);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new LineBBox(
            this.getHandlerMetadata('main').get('mass'),
            0, 0,
            this.vector.getX(), this.vector.getY()
        ));

        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => new Konva.Line({
            x: 0,
            y: 0,
            points: [0, 0, 0, 0],
            stroke: 'green',
            strokeWidth: 1
        }));
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation, graphicElement: any) => {
            const projection = representation.getProjection();

            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.points([
                0,
                0,
                Vector.createFromVector(this.getVector()).rotate(projection.getRotation()).getX(),
                Vector.createFromVector(this.getVector()).rotate(projection.getRotation()).getY()
            ]);
        });
    }

    getVector(): Vector {
        return this.vector;
    }
}