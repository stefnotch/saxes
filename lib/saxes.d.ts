declare namespace saxes {
  export const EVENTS: Readonly<{
    text: number;
    processinginstruction: number;
    doctype: number;
    comment: number;
    opentagstart: number;
    opentag: number;
    closetag: number;
    cdata: number;
    end: number;
}>;

  export interface SaxesOptions {
    xmlns?: boolean;
    position?: boolean;
    fileName?: string;
  }

  export interface XMLDecl {
    version?: string;
    encoding?: string;
    standalone?: string;
  }

  export interface SaxesAttribute {
    name: string;
    prefix: string;
    local: string;
    uri: string;
    value: string;
  }

  export interface SaxesTag {
    name: string;
    prefix: string;
    local: string;
    uri: string;
    attributes: Record<string, SaxesAttribute> | Record<string, string>;
    ns: Record<string, string>;
    selfClosing: boolean;
  }

  export class SaxesParser {
    constructor(opt: SaxesOptions);

    readonly opt: SaxesOptions;
    readonly closed: boolean;
    readonly xmlDecl: XMLDecl;
    readonly line: number;
    readonly column: number;
    readonly position: number;
    readonly ENTITIES: Record<string, string>;

    readonly nodeStream: Subject;

    onready(): void;

    fail(er: Error): this;
    write(chunk: string | null): this;
    close(): this;
  }
}

export = saxes;
