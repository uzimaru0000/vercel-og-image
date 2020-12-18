# @uzimaru0000/vercel-og-image

Vercel's Runtime for generating OGP

## How to use

vercel.json

```json
{
  "version": 2,
  "functions": {
    "api/**/*.(html|tsx)": {
      "runtime": "@uzimaru0000/vercel-og-image@1.4.0",
      "memory": 1024
    }
  }
}
```
