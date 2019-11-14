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

        this.rendererStrategy = rendererStrategy;
        this.projectionStrategy = projectionStrategy;

        // In case if view is added AFTER unit added
        space.getEntities().forEach(entity => this.initRenderer(entity));

        // Subscript to create unit
        this.space
            .on(Space.EVENT_POST_ENTITY_CREATED, this.initRenderer, this)
            .on(Space.EVENT_PRE_ENTITY_DELETED, this.deleteRenderer, this);
    }

    startRendering(fps: number): View {
        setInterval(() => this.rerender(), 1000/fps);

        return this;
    }

    private initRenderer(entity: Entity): void {
        this.rendererStrategy.initRenderer(entity);
    }

    private deleteRenderer(entity: Entity): void {
        this.rendererStrategy.deleteRenderer(entity);
    }

    private rerender(): View {
        this.projectionStrategy.beforeCalculation(this);

        for (let entity of this.space.getEntities()) {
            let representation: Representation = new Representation(
                entity,
                this.projectionStrategy.calculateProjection(entity, this)
            );

            this.rendererStrategy.rerenderEntity(representation);
        }

        this.rendererStrategy.finalizeRender();

        return this;
    }
}
