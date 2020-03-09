export interface Node {
    type: string;
    props: AnyObject;
    children: Array<Node>;
}

export type AnyObject = {
    [propName: string]: any;
}

export type AnyArray = unknown[];
