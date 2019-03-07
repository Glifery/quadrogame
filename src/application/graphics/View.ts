import {Space} from "../../domain/model/Space";
import * as Raphael from "raphael/raphael";
import {ProjectionStrategyInterface} from "./projection/ProjectionStrategyInterface";
import {Projection} from "../../domain/model/Projection";

export class View {
    private offsetX: number;
    private offsetY: number;
    private space: Space;
    private projectionStrategy: ProjectionStrategyInterface;
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

    startRendering(fps: number): View {
        setInterval(() => this.rerender(), 1000/fps);

        return this;
    }

    private rerender(): View {
        for (let position of this.space.getPositions()) {
            let projection: Projection = this.projectionStrategy.calculateProjection(position, this);

            if (!position.getRenderer()) {
                let renderer = this.paper.add([{
                  type: "circle",
                  cx: projection.getX(),
                  cy: projection.getY(),
                  r: 3,
                  fill: 'red'
                }]);

                position.setRenderer(renderer);
            }

            let renderer = position.getRenderer();

            renderer.attr({
                cx: projection.getX(),
                cy: projection.getY(),
            });
        }

        return this;
    }
}
