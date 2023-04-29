import type { IHeader } from './header';
import { IResult, hasData } from './utils';

const SIZE_T_EQUIVALENT = 4;

export interface IDataPair {
    length: number;
    data: Buffer;
}

export interface IDataError {
    type: 'unexpected-end-of-buffer' | 'invalid-data-length';
    message: string;
}

export type IDataPairs = Array<IDataPair>;

/**
 * Parses the body of a RFIL file.
 * @param buffer The buffer to read the body from.
 * @param header The header of the file.
 */
export const readBody = (buffer: Buffer, header: IHeader): IResult<IDataPairs, IDataError> => {
    // Get the max length of the data
    const maxLength = header.maxDataLength;

    let pointer = header.byteOffset;

    // Read the data
    const data: IDataPairs = [];

    while (pointer < buffer.length) {
        // Check the length
        if (!hasData(buffer, pointer, SIZE_T_EQUIVALENT)) {
            return IResult.failure({
                type: 'unexpected-end-of-buffer',
                message: 'Expected data length in body'
            });
        }

        // For those of you who don't know, little endian means that the **bytes** are reversed.
        // If there is only one byte, then it is the same as big endian.
        const length = buffer.readUintLE(pointer, SIZE_T_EQUIVALENT);
        pointer += SIZE_T_EQUIVALENT;

        if (length > maxLength) {
            return IResult.failure({
                type: 'invalid-data-length',
                message: `Data exceeds maximum length: ${length} in body`
            });
        }

        // Check the data
        if (!hasData(buffer, pointer, length)) {
            return IResult.failure({
                type: 'unexpected-end-of-buffer',
                message: 'Expected data in body'
            });
        }

        // You may ask why we don't just use buffer.subarray() here.
        // It's because it refrences the original buffer.
        // We want to copy the data so that we can free the original buffer.
        const dataBuffer = Buffer.alloc(length);

        buffer.copy(dataBuffer, 0, pointer, pointer + length);
        pointer += length;

        data.push({
            length,
            data: dataBuffer
        });
    }

    return IResult.success(data);
};
