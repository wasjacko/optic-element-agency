
import 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            pattern: React.SVGProps<SVGPatternElement>;
        }
    }
}
