export interface LocationId {
    id: string;
}

export interface LocationList {
    list: Array<Location>;
}

export interface Location {
    lockedDtoFields: Array<any>;
    deleted?: boolean;
    id: string;
    description: string;
    params: [{ key: string; value: string }];
    clients: [
        {
            id: string;
            key: string;
            name: string;
        }
    ];
    filterMap: string;
    createdAt?: string;
    updatedAt?: string;
}
