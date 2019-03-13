import {Space} from "../../domain/model/Space";
import * as Raphael from "raphael/raphael";
import {ProjectionStrategyInterface} from "./projection/ProjectionStrategyInterface";
import {Projection} from "../../domain/model/Projection";
import {RendererStrategyInterface} from "./renderer/RendererStrategyInterface";

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
            let projection: Projection = this.projectionStrategy.calculateProjection(entity, this);

            if (!entity.getRenderer()) {
                let graphicElement = this.paper.add([{
                  type: "circle",
                  cx: projection.getX(),
                  cy: projection.getY(),
                  r: 0,
                  fill: 'red'
                }]);

                entity.setRenderer(graphicElement);
            }

            let graphicElement = entity.getRenderer();

            this.rendererStrategy.renderEntity(entity, projection, graphicElement);
        }

        return this;
    }
}
