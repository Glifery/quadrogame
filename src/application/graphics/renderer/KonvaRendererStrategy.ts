import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Roamer} from "../../../domain/entity/Roamer";
import {Enemy} from "../../../domain/entity/Enemy";
import {Hero} from "../../../domain/entity/Hero";
import {Bullet} from "../../../domain/entity/Bullet";
import {Representation} from "../../../domain/model/Representation";
import {Explosion} from "../../../domain/entity/Explosion";
import {Entity} from "../../../domain/model/Entity";
import * as konva from 'konva';
import {Layer} from "konva/types/Layer";
import {Stage} from "konva/types/Stage";
import {Shape} from "konva/types/Shape";

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
                radius: 0,
                fill: 'black',
                stroke: 'black',
                strokeWidth: 1
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
            graphicElement.radius(2);
        }
        if (entity instanceof Explosion) {
            graphicElement.x(projection.getX());
            graphicElement.y(projection.getY());
            graphicElement.radius(entity.getMaxDistance() * (entity.getLifetime() / entity.getMaxLifetime()));
            graphicElement.fill(`rgba(255,0,0,${0.2 * (1 - (entity.getLifetime() / entity.getMaxLifetime()))})`);
            graphicElement.stroke(`rgba(255,0,0,${1 - (entity.getLifetime() / entity.getMaxLifetime())})`);
        }
    }

    finalizeRender(): void {
        this.layer.draw();
    }
}