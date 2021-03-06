import {Entity} from "../model/Entity";
import {Vector} from "../model/Vector";
import * as konva from "konva";
import {Representation} from "../model/Representation";
import {RectangleBBox} from "../model/bbox/RectangleBBox";
import {Projection} from "../model/Projection";

const Konva: any = konva;

export class Wall extends Entity {
    private depth: number;
    private vector: Vector;

    constructor(x: number, y: number, x2: number, y2: number, depth: number) {
        super(x, y);

        this.depth = depth;
        this.vector = new Vector(x2 - x, y2 - y);
    }

    init(): void {
        this.getHandlerMetadata('main').set('mass', 0);

        this.getHandlerMetadata('CollisionBehavior').set('reaction', true);
        this.getHandlerMetadata('CollisionBehavior').set('bbox', new RectangleBBox(
            this.getHandlerMetadata('main').get('mass'),
            0, 0,
            this.vector.getX(), this.vector.getY(),
            this.depth
        ));

        this.getHandlerMetadata('KonvaRendererStrategy').set('init_fn', () => new Konva.Rect({
            x: 0,
            y: 0,
            width: this.vector.getDis(),
            height: this.depth,
            offsetY: this.depth / 2,
            fill: 'gray'
        }));
        this.getHandlerMetadata('KonvaRendererStrategy').set('rerender_fn', (representation: Representation, graphicElement: any) => {
            const projection: Projection = representation.getProjection();
            const rotation: number = this.vector.getDir() + projection.getRotation();

            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.rotation(-rotation);
        });
    }

    getVector(): Vector {
        return this.vector;
    }
}