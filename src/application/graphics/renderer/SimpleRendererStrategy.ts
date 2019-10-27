import * as Raphael from "raphael/raphael";
import {RendererStrategyInterface} from "./RendererStrategyInterface";
import {Roamer} from "../../../domain/entity/Roamer";
import {Enemy} from "../../../domain/entity/Enemy";
import {Hero} from "../../../domain/entity/Hero";
import {Grenade} from "../../../domain/entity/Grenade";
import {CircleBBox} from "../../../domain/model/bbox/CircleBBox";
import {Representation} from "../../../domain/model/Representation";
import {Explosion} from "../../../domain/entity/Explosion";
import {Entity} from "../../../domain/model/Entity";

export class SimpleRendererStrategy implements RendererStrategyInterface {
    private paper: any;

    constructor(width: number, height: number, offsetX: number, offsetY: number) {
        this.paper = Raphael(offsetX, offsetY, width, height);
    }

    initiateRepresentation(entity: Entity): void {
        entity.setRepresentation(new Representation(
            entity,
            this.paper.add([{
                type: "circle"
            }])
        ));
    }

    renderEntity(representation: Representation): void {
        let entity = representation.getEntity();
        let projection = representation.getProjection();
        let graphicElement = representation.getGraphic();

        let bbox = entity.getBBox();

        if (entity instanceof Hero) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: (bbox instanceof CircleBBox) ? bbox.getRadius() : 20,
                fill: 'blue'
            });
        }

        if (entity instanceof Roamer) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: (3 + (entity.getBBox().getMass() / 100)) * projection.getScale(),
                fill: 'red'
            });
        }

        if (entity instanceof Enemy) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: (bbox instanceof CircleBBox) ? bbox.getRadius() : 30,
                fill: 'yellow'
            });
        }

        if (entity instanceof Grenade) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: 2,
                fill: 'yellow'
            });
        }

        if (entity instanceof Explosion) {
            graphicElement.attr({
                type: "circle",
                cx: projection.getX(),
                cy: projection.getY(),
                r: entity.getMaxDistance() * (entity.getLifetime() / entity.getMaxLifetime()),
                'fill-opacity': 0,
                opacity: 1 - (entity.getLifetime() / entity.getMaxLifetime()),
                'stroke-width': 1,
                fill: 'red'
            });
        }
    }

    finalizeRender(): void {
    }
}