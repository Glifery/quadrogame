import {Space} from "../../domain/model/Space";
import * as Raphael from "raphael/raphael";
import {ProjectionStrategyInterface} from "./projection/ProjectionStrategyInterface";
import {RendererStrategyInterface} from "./renderer/RendererStrategyInterface";
import {Representation} from "../../domain/model/Representation";
import {Entity} from "../../domain/model/Entity";

export class View {
    private offsetX: number;
    private offsetY: number;
    private space: Space;
    private projectionStrategy: ProjectionStrategyInterface;
    private rendererStrategy: RendererStrategyInterface;
    private paper: any;

    constructor(width: number, height: number, offsetX: number, offsetY: number) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.paper = Raphael(offsetX, offsetY, width, height);
        this.paper.rect(0, 0, width, height, 5);
    }

    setSpace(space: Space): View {
        this.space = space;

        return this;
    }

    setProjectionStrategy(projectionStrategy: ProjectionStrategyInterface) {
        this.projectionStrategy = projectionStrategy;
    }

    setRendererStrategy(rendererStrategy: RendererStrategyInterface) {
        this.rendererStrategy = rendererStrategy;
    }

    startRendering(fps: number): View {
        setInterval(() => this.rerender(), 1000/fps);

        return this;
    }

    private rerender(): View {
        this.projectionStrategy.beforeCalculation(this);

        for (let entity of this.space.getEntities()) {
            if (!entity.getRepresentation()) {
                entity.setRepresentation(this.initiateRepresentation(entity));
            }

            let representation: Representation = entity.getRepresentation();

            representation.setProjection(this.projectionStrategy.calculateProjection(entity, this));

            this.rendererStrategy.renderEntity(representation);
        }

        return this;
    }

    private initiateRepresentation(entity: Entity) {
        return new Representation(
            entity,
            this.paper.add([{
                type: "circle",
                cx: 0,
                cy: 0,
                r: 0,
                fill: 'red'
            }])
        );
    }
}
