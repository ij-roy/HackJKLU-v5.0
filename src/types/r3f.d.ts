import { ThreeElements } from '@react-three/fiber';

declare module '@react-three/fiber' {
  namespace JSX {
    interface IntrinsicElements {
      group: ThreeElements['group'];
      primitive: {
        object: any;
        [key: string]: any;
      };
    }
  }
}

