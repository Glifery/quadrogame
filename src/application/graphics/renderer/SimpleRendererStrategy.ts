import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Position} from "../../../domain/model/Position";
import {Projection} from "../../../domain/model/Projection";
import {Entity} from "../../../domain/model/Entity";
import {Roamer} from "../../../domain/entity/Roamer";
import {Enemy} from "../../../domain/entity/Enemy";
import {Hero} from "../../../domain/entity/Hero";
import {Bullet} from "../../../domain/entity/Bullet";

export class SimpleRendererStrategy implements RendererStrategyInterface {
    renderEntity(entity: Entity, projection: Projection, graphicElement: any): void {
        if (entity instanceof Hero) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: 20,
                fill: 'blue'
            });
        }

        if (entity instanceof Roamer) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: (3 + (entity.getMass() / 100)) * projection.getScale(),
                fill: 'red'
            });
        }

        if (entity instanceof Enemy) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: 30,
                fill: 'yellow'
            });
        }

        if (entity instanceof Bullet) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: 2,
                fill: 'black'
            });
        }
    }
}