export type subscriptionFn = (any) => any;
type subscriptionWithContext = [subscriptionFn, any];

export class Dispatcher {
    private subscriptions: Map<string, subscriptionWithContext[]>;

    constructor(events: string[]) {
        this.subscriptions = new Map();

        events.forEach(event => this.registerEvent(event));
    }

    subscribe(event: string, fn: subscriptionFn, context: any): void {
        let eventSubscriptions: subscriptionWithContext[] = this.subscriptions.get(event);

        if (!eventSubscriptions) {
            throw new Error(`Event '${event}' have not been registered on Dispatcher`);
        }

        eventSubscriptions.push([fn, context]);
    }

    emit(event: string, subject: any): void {
        let eventSubscriptions: subscriptionWithContext[] = this.subscriptions.get(event);

        if (!eventSubscriptions) {
            throw new Error(`Event '${event}' have not been registered on Dispatcher`);
        }

        eventSubscriptions.forEach(subscriptionWithContext => {
            subscriptionWithContext[0].apply(subscriptionWithContext[1], [subject]);
        });
    }

    private registerEvent(event: string): void {
        this.subscriptions.set(event, []);
    }
}