function getStorage() {
    return JSON.parse(localStorage.getItem('gameStorage') ?? '{}');
}

export function setupStorage(game: string) {
    return {
        get: (key: string) => {
            const storage = getStorage();
            return storage[game]?.[key];
        },
        set: (key: string, value: any) => {
            const storage = getStorage();
            storage[game] ??= {};
            storage[game][key] = value;
            localStorage.setItem('gameStorage', JSON.stringify(storage));
        },
    };
}
