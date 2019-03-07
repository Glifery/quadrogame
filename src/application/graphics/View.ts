import {Space} from "../../domain/model/Space";
import * as Raphael from "raphael/raphael";

export class View {
    private offsetX: number;
    private offsetY: number;

    private paper: any;

    private space: Space;

    constructor(width: number, height: number, offsetX: number = 0, offsetY: number = 0) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.paper = Raphael(0, 0, width, height);
        this.paper.rect(0, 0, width, height, 5);
    }

    setSpace(space: Space): View {
        this.space = space;

        return this;
    }

    startRendering(fps: number): View {
        setInterval(() => this.rerender(), 1000/fps);

        return this;
    }

    private rerender(): View {
        for (let position of this.space.getPositions()) {
            if (!position.getRenderer()) {
                let renderer = this.paper.add([{
                  type: "circle",
                  cx: position.getX(),
                  cy: position.getY(),
                  r: 3,
                  fill: 'red'
                }]);

                position.setRenderer(renderer);
            }

            let renderer = position.getRenderer();

            renderer.attr({
                cx: position.getX() - this.offsetX,
                cy: position.getY() - this.offsetY,
            });
        }

        return this;
    }
}
