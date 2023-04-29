import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.min.cjs',
            format: 'cjs',
            sourcemap: true
        },
        {
            file: 'dist/index.min.mjs',
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            transpiler: 'swc'
        }),
        terser()
    ]
});
