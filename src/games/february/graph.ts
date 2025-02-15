export function makeGraph<T>(connections = new Map<string, T>()) {
    return {
        connect(a: number, b: number, data: T) {
            connections.set(`${Math.min(a, b)}-${Math.max(a, b)}`, data);
        },
        getData(a: number, b: number) {
            return connections.get(`${Math.min(a, b)}-${Math.max(a, b)}`);
        },
        getNeighbors(index: number) {
            const result = new Map<number, T>();
            for (const [key, data] of connections.entries()) {
                const [a, b] = key.split('-').map(Number);
                if (a === index) result.set(b, data);
                else if (b === index) result.set(a, data);
            }
            return result;
        },
        search(start: number, canContinue: (index: number) => boolean) {
            const visited = new Set<number>();
            const stack = [start];
            const connections = new Set<[number, number, T]>();
            while (true) {
                const current = stack.pop()!;
                if (current === undefined) return connections;

                if (visited.has(current)) continue;

                visited.add(current);

                for (const [neighbor, data] of this.getNeighbors(current)) {
                    if (!visited.has(neighbor)) {
                        connections.add([current, neighbor, data].sort() as [number, number, T]);
                        if (canContinue(neighbor)) stack.push(neighbor);
                    }
                }
            }
        },
        *[Symbol.iterator]() {
            for (const [key, data] of connections) {
                const [a, b] = key.split('-').map(Number);
                yield [a, b, data] as const;
            }
        },
    };
}

export type Graph<T> = ReturnType<typeof makeGraph<T>>;
