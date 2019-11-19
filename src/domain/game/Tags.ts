export class Tags {
    public static TAG_LIGHT = 'light';
    public static TAG_HEAVY = 'heavy';

    private tags: string[];

    constructor(tags: string[]) {
        this.tags = tags;
    }

    haveTag(tag: string): boolean {
        return this.tags.indexOf(tag) > -1;
    }

    getTags(): string[] {
        return this.tags;
    }

    addTag(tag: string): Tags {
        if (!this.haveTag(tag)) {
            this.tags.push(tag);
        }

        return this;
    }

    removeTag(tag: string): Tags {
        if (this.haveTag(tag)) {
            this.tags.splice(this.tags.indexOf(tag), 1);
        }

        return this;
    }
}