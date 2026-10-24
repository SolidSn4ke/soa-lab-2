
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';

const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    trimValues: true,
    ignoreDeclaration: true,
    isArray: (name, jPath) => {
        return jPath === 'pageInfo.items';
    },
});

const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: false,
    suppressEmptyNode: true,
});

export function toXml<T>(rootName: string, data: T): string {
    return builder.build({
        [rootName]: data,
    });
}


export function fromXml<T>(xml: string): T {
    const validation = XMLValidator.validate(xml);

    if (validation !== true) {
        throw new Error('Invalid XML response');
    }

    const parsed = parser.parse(xml);
    const rootName = Object.keys(parsed)[0];

    if (!rootName) {
        throw new Error('XML response is empty');
    }

    const result = parsed[rootName];

    if (
        result &&
        typeof result === 'object' &&
        'items' in result
    ) {
        const pageInfo = result as Record<string, unknown>;
        const items = pageInfo['items'];

        if (
            items &&
            typeof items === 'object' &&
            'item' in items
        ) {
            const item = (items as Record<string, unknown>)['item'];
            pageInfo['items'] = item == null ? [] : Array.isArray(item) ? item : [item];
        } else {
            pageInfo['items'] = [];
        }

        pageInfo['page'] = Number(pageInfo['page']);
        pageInfo['size'] = Number(pageInfo['size']);
        pageInfo['totalPages'] = Number(pageInfo['totalPages']);
        pageInfo['totalElements'] = Number(pageInfo['totalElements']);
    }

    return result as T;
}

