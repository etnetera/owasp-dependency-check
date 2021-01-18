# owasp-dependency-check

Node.js wrapper for the [OWASP depencency-check CLI tool](https://jeremylong.github.io/DependencyCheck/dependency-check-cli/index.html).

```
npm install -D owasp-dependency-check
```

## Usage

The easiest way is to add a new NPM script to your `package.json`, for example:

```
"scripts": {
  ...
  "owasp": "owasp-dependency-check --project \"YOUR PROJECT NAME\" [options]"
}
```

You can specify any options which the [OWASP depencency-check CLI tool](https://jeremylong.github.io/DependencyCheck/dependency-check-cli/index.html) provides. For example, to generate a HTML and JSON report, use:

```
"scripts": {
  ...
  "owasp": "owasp-dependency-check --project \"YOUR PROJECT NAME\" -f HTML JSON"
}
```
