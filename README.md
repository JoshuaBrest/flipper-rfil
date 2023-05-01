# RFIL

Use our NPM package!
```bash
npm i rfil
```

## Usage

You can either use commonjs or esm.

### CommonJS

```js
const { parse } = require('rfil');
const fs = require('fs');

// Read a buffer from a file
const buffer = fs.readFileSync('file.rfil');

// Parse the buffer
const data = parse(buffer);

// Print the data
console.log(data);
```

### ESM

```js
import { parse } from 'rfil';
import fs from 'node:fs';

// Read a buffer from a file
const buffer = fs.readFileSync('file.rfil');

// Parse the buffer
const data = parse(buffer);

// Print the data
console.log(data);
```


## RFIL File Format

I will be calling the flipper zero file format RFIL because the magic bytes are `0x4C464952` which is `RFIL` in ASCII. This is a decoder for the RFIL file format written in TypeScript.

### File Structure

There are 2 parts in a RFIL file: the header and the data. It is also encoded in this little s*** (💩) called little endian.

#### Header

The header first starts with a 32 bit (4 byte) magic number `0x4C464952` which is `RFIL` in ASCII.

Next there is a 32 bit (4 byte) integer with the version of the file format. Currently the version is `1`.

Next there is a 32 bit (4 byte) float encoded in IEEE 754. This represents the frequency of the file in Hz.

Next there is another 32 bit (4 byte) float encoded in IEEE 754. This represents the duty cycle of the file in percent.

Finaly there is a 32 bit (4 byte) integer with the length of the data in bytes.

Here is a table with the header structure:

| Offset | Length | Type      | Description  | Example                        |
| ------ | ------ | --------- | ------------ | ------------------------------ |
| 0x00   | 0x04   | `uint32`  | Magic number | `0x4C464952`                   |
| 0x04   | 0x04   | `uint32`  | Version      | `0x10000000`                   |
| 0x08   | 0x04   | `float32` | Frequency    | `0x0024F447` (for ASK 125kHz)  |
| 0x0C   | 0x04   | `float32` | Duty cycle   | `0x0000003F` (for 0.5 seconds) |
| 0x10   | 0x04   | `uint32`  | Data length  | `0x0000000A` (for 10 bytes)    |

#### Data

The data is just a bunch of bytes in pairs.

The first part is the length of the data in bytes. This is a 32 bit (4 byte) integer. Or `size_t` in C. **Note**: `size_t` is not always 32 bit. It depends on the compiler. It is at least 16 bit. So this is not portable. But I don't care.

The second part is the data itself. This is a buffer with the length of the first part.

Here is a table with the data structure:
| Offset | Length | Type      | Description | Example                                   |
| ------ | ------ | --------- | ----------- | ----------------------------------------- |
| 0x00   | 0x01   | `uint32`  | Data length | `0x0A` (for 10 bytes)                     |
| 0x04   | 0x0A   | `uint8[]` | Data        | `0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x00` |

