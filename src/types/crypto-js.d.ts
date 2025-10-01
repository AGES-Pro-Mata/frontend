declare module "crypto-js/sha256.js" {
  import type { WordArray } from "crypto-js";

  export default function SHA256(
    message: string | WordArray,
    key?: string | WordArray
  ): WordArray;
}
