import { IResult } from './utils';
import { readHeader, IHeader, IHeaderError } from './header';
import { readBody, IDataPairs, IDataError } from './body';

export interface IRFIL {
    header: IHeader;
    data: IDataPairs;
}

export type IRFILParseError = IHeaderError | IDataError;

/**
 * Parses the given buffer as a RFIL file.
 * @param buffer The buffer to parse.
 * @returns A result containing the parsed RFIL file or an error.
 */
export const parse = (buffer: Buffer): IResult<IRFIL, IRFILParseError> => {
    // Read the header
    const headerResult = readHeader(buffer);
    if (headerResult.hasError()) {
        return IResult.failure(headerResult.unwrapError());
    }

    const header = headerResult.unwrap();

    // Read the body
    const bodyResult = readBody(buffer, header);
    if (bodyResult.hasError()) {
        return IResult.failure(bodyResult.unwrapError());
    }

    const data = bodyResult.unwrap();

    return IResult.success({
        header,
        data
    });
};
