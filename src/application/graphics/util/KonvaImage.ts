import * as konva from 'konva';

const Konva: any = konva;

export class KonvaImage {
    private image: any;

    constructor(src: string) {
        this.image = new Image();
        this.image.src = src;
    }

    createSprite(spriteWidth: number, spriteHeight: number, imageX: number, imageY: number, imageWidth: number, imageHeight: number) {
        return new Konva.Sprite({
            x: 0,
            y: 0,
            offsetX: imageWidth / 2,
            offsetY: imageHeight / 2,
            scaleX: spriteWidth * 2 / imageWidth,
            scaleY: spriteHeight * 2 / imageHeight,
            image: this.image,
            animation: 'default',
            animations: {
                default: [
                    imageX,
                    imageY,
                    imageWidth,
                    imageHeight
                ]
            },
            frameRate: 1,
            frameIndex: 0
        });
    }
}