import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Roamer} from "../../../domain/entity/Roamer";
import {Enemy} from "../../../domain/entity/Enemy";
import {Hero} from "../../../domain/entity/Hero";
import {Grenade} from "../../../domain/entity/Grenade";
import {Representation} from "../../../domain/model/Representation";
import {Explosion} from "../../../domain/entity/Explosion";
import {Entity} from "../../../domain/model/Entity";
import * as konva from 'konva';
import {Layer} from "konva/types/Layer";
import {Stage} from "konva/types/Stage";
import {Shape} from "konva/types/Shape";
import {Wall} from "../../../domain/entity/Wall";
import {Vector} from "../../../domain/model/Vector";
import {Bullet} from "../../../domain/entity/Bullet";

const Konva: any = konva;

export class KonvaRendererStrategy implements RendererStrategyInterface {
    private stage: Stage;
    private layer: Layer;

    constructor(width: number, height: number, offsetX: number, offsetY: number) {
        this.stage = new Konva.Stage({
            container: 'container',
            width: width,
            height: height,
            offsetX: offsetX,
            offsetY: offsetY,
        });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.initCanvas(width, height);

        this.layer.draw();
    }

    initiateRepresentation(entity: Entity): void {
        let shape: Shape;

        if (entity instanceof Hero) {
            shape = new Konva.Circle({
                x: 0,
                y: 0,
                radius: 0,
                fill: 'blue',
                stroke: 'black',
                strokeWidth: 1
            });
        }
        if (entity instanceof Roamer) {
            shape = new Konva.Circle({
                x: 0,
                y: 0,
                radius: 0,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 1
            });
        }
        if (entity instanceof Enemy) {
            shape = new Konva.Circle({
                x: 0,
                y: 0,
                radius: 0,
                fill: 'yellow',
                stroke: 'black',
                strokeWidth: 1
            });
        }
        if (entity instanceof Bullet) {
            shape = new Konva.Circle({
                x: 0,
                y: 0,
                radius: 1,
                fill: 'white'
            });
        }
        if (entity instanceof Grenade) {
            shape = new Konva.Circle({
                x: 0,
                y: 0,
                radius: 3,
                fill: 'yellow'
            });
        }
        if (entity instanceof Explosion) {
            shape = new Konva.Circle({
                x: 0,
                y: 0,
                radius: 0,
                stroke: 'red',
                strokeWidth: 2
            });
        }
        if (entity instanceof Wall) {
            shape = new Konva.Line({
                x: 0,
                y: 0,
                points: [0, 0, 0, 0],
                stroke: 'green',
                strokeWidth: 1
            });
        }

        if (!shape) {
            throw new Error('Entity is not added to KonvaTendererStrategy');
        }

        entity.setRepresentation(new Representation(
            entity,
            shape
        ));

        this.layer.add(shape);
    }

    renderEntity(representation: Representation): void {
        let entity = representation.getEntity();
        let projection = representation.getProjection();
        let graphicElement = representation.getGraphic();

        if (entity instanceof Hero) {
            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(20 * projection.getScale());
        }
        if (entity instanceof Roamer) {
            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius((3 + (entity.getBBox().getMass() / 100)) * projection.getScale());
        }
        if (entity instanceof Enemy) {
            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(30 * projection.getScale());
        }
        if (entity instanceof Bullet) {
            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
        }
        if (entity instanceof Grenade) {
            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
        }
        if (entity instanceof Explosion) {
            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(entity.getMaxDistance() * (entity.getLifetime() / entity.getMaxLifetime()));
            graphicElement.fill(`rgba(255,0,0,${0.2 * (1 - (entity.getLifetime() / entity.getMaxLifetime()))})`);
            graphicElement.stroke(`rgba(255,0,0,${1 - (entity.getLifetime() / entity.getMaxLifetime())})`);
        }
        if (entity instanceof Wall) {
            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.points([
                0,
                0,
                Vector.createFromVector(entity.getVector()).rotate(projection.getRotation()).getX(),
                Vector.createFromVector(entity.getVector()).rotate(projection.getRotation()).getY()
            ]);
        }
    }

    finalizeRender(): void {
        this.layer.draw();
    }

    private initCanvas(width: number, height: number): void {
        this.layer.add(new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2
        }));
    }
}