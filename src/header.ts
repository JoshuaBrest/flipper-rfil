import { IResult, hasData } from './utils';

const VERSION = 1;
const MAGIC = 0x4C464952; // 'RFIL'

export interface IHeader {
    magic: number;
    version: number;
    frequency: number;
    dutyCycle: number;
    maxDataLength: number;
    byteOffset: number;
}

export interface IHeaderError {
    type: 'invalid-magic' | 'unsupported-version' | 'unexpected-end-of-buffer' | 'unknown';
    message: string;
}

/**
 * Reads the header from the given buffer.
 * @param buffer The buffer to read the header from.
 * @returns A result containing the header or an error.
 */
export const readHeader = (buffer: Buffer): IResult<IHeader, IHeaderError> => {
    // Check the magic number
    if (!hasData(buffer, 0, 4)) {
        return IResult.failure({
            type: 'unexpected-end-of-buffer',
            message: 'Expected magic number'
        });
    }

    const magic = buffer.readUInt32LE(0);
    if (magic !== MAGIC) {
        return IResult.failure({
            type: 'invalid-magic',
            message: `Invalid magic number: ${magic}. Expected ${MAGIC} in header`
        });
    }

    // Check the version
    if (!hasData(buffer, 4, 4)) {
        return IResult.failure({
            type: 'unexpected-end-of-buffer',
            message: 'Expected version number in header'
        });
    }

    const version = buffer.readUInt32LE(4);
    if (version !== VERSION) {
        return IResult.failure({
            type: 'unsupported-version',
            message: `Unsupported version: ${version} in header`
        });
    }

    // Check the frequency
    if (!hasData(buffer, 8, 4)) {
        return IResult.failure({
            type: 'unexpected-end-of-buffer',
            message: 'Expected frequency in header'
        });
    }

    const frequency = buffer.readFloatLE(8);

    // Check the duty cycle
    if (!hasData(buffer, 12, 4)) {
        return IResult.failure({
            type: 'unexpected-end-of-buffer',
            message: 'Expected duty cycle in header'
        });
    }

    const dutyCycle = buffer.readFloatLE(12);

    // Check the data length
    if (!hasData(buffer, 16, 4)) {
        return IResult.failure({
            type: 'unexpected-end-of-buffer',
            message: 'Expected data length in header'
        });
    }

    const maxDataLength = buffer.readUInt32LE(16);

    // Return the header
    return IResult.success({
        magic,
        version,
        frequency,
        dutyCycle,
        maxDataLength,
        byteOffset: 20
    });
};
