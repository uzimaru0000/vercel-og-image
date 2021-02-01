# @uzimaru0000/vercel-og-image

Vercel's Runtime to generate OGP from JS or HTML.

## How to use

vercel.json

```json
{
  "version": 2,
  "functions": {
    "api/**/*.(html|js)": {
      "runtime": "@uzimaru0000/vercel-og-image@1.5.0",
      "memory": 1024
    }
  }
}
```

The JS file that will be the entry point must be a function that returns ReactComponents or a default export of an HTML string.
