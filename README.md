# @uzimaru0000/og-image

Vercel's Runtime for generating OGP

## How to use

vercel.json

```json
{
  "version": 2,
  "functions": {
    "api/**/*.(html|tsx)": {
      "runtime": "@uzimaru0000/og-image@1.0.0",
      "memory": 1024
    }
  }
}
```
