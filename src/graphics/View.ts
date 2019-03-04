import {Space} from "../model/Space";

declare var Raphael: any;

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
        for (let object of this.space.getObjects()) {
            if (!object.getRenderer()) {
                let renderer = this.paper.add([{
                  type: "circle",
                  cx: object.getX(),
                  cy: object.getY(),
                  r: 3,
                  fill: 'red'
                }]);

                object.setRenderer(renderer);
            }

            let renderer = object.getRenderer();

            renderer.attr({
                cx: object.getX() - this.offsetX,
                cy: object.getY() - this.offsetY,
            });
        }

        return this;
    }
}
