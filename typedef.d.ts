
interface Dir {
    name: string;
}

interface File {
    name: string;
    created_at: string;
    updated_at: string;
}

export interface PagesTree {
    [dirName: string]: Array<File>;
}