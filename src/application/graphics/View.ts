import {Space} from "../../domain/model/Space";
import {ProjectionStrategyInterface} from "./projection/ProjectionStrategyInterface";
import {RendererStrategyInterface} from "./renderer/RendererStrategyInterface";
import {Representation} from "../../domain/model/Representation";
import {Entity} from "../../domain/model/Entity";

export class View {
    private space: Space;
    private projectionStrategy: ProjectionStrategyInterface;
    private rendererStrategy: RendererStrategyInterface;

    constructor(space: Space, rendererStrategy: RendererStrategyInterface, projectionStrategy: ProjectionStrategyInterface) {
        this.space = space;
        space.addView(this);

        this.rendererStrategy = rendererStrategy;
        this.projectionStrategy = projectionStrategy;

        // In case if view is added AFTER entity added
        for (let entity of space.getEntities()) {
            this.initiateRepresentation(entity);
        }
    }

    initiateRepresentation(entity: Entity): void {
        this.rendererStrategy.initiateRepresentation(entity);
    }

    startRendering(fps: number): View {
        setInterval(() => this.rerender(), 1000/fps);

        return this;
    }

    private rerender(): View {
        this.projectionStrategy.beforeCalculation(this);

        for (let entity of this.space.getEntities()) {
            let representation: Representation = entity.getRepresentation();

            representation.setProjection(this.projectionStrategy.calculateProjection(entity, this));

            this.rendererStrategy.renderEntity(representation);
        }

        return this;
    }
}
