

/**
 * Checks if the buffer has enough data to read the following number of bytes.
 * @param buffer The buffer to check.
 * @param offset The offset to check from.
 * @param length The number of bytes to check for.
 */
export const hasData = (buffer: Buffer, offset: number, length: number): boolean => {
    return buffer.length >= offset + length;
};

/**
 * A result type that can be used to return either a value or an error.
 * 
 * **Note:** This is a simplified version of the `Result` type from Rust.
 */
export class IResult<Data, Error> {
    public data: Data | null;
    public error: Error | null;

    private constructor(data: Data | null, error: Error | null) {
        this.data = data;
        this.error = error;
    }

    public static success<Data, Error>(data: Data): IResult<Data, Error> {
        return new IResult<Data, Error>(data, null);
    }

    public static failure<Data, Error>(error: Error): IResult<Data, Error> {
        return new IResult<Data, Error>(null, error);
    }

    public hasError(): this is IResult<never, Error> {
        return this.error !== null;
    }

    public hasData(): this is IResult<Data, never> {
        return this.data !== null;
    }

    public unwrap(): Data {
        if (this.data === null) {
            throw new Error("Attempted to unwrap a result with no data");
        }
        return this.data;
    }

    public unwrapError(): Error {
        if (this.error === null) {
            throw new Error("Attempted to unwrap a result with no error");
        }
        return this.error;
    }

    public unwrapOr(defaultValue: Data): Data {
        if (this.data === null) {
            return defaultValue;
        }
        return this.data;
    }

    public unwrapErrorOr(defaultValue: Error): Error {
        if (this.error === null) {
            return defaultValue;
        }
        return this.error;
    }
}