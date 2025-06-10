# owasp-dependency-check

## ⚠️⚠️ No longer maintained ⚠️⚠️

**This package is no longer maintained. The ownership was transfered to [atwupack](https://github.com/atwupack/owasp-dependency-check).**

---

> ⚠️ Requires **Node.js** version 14 or greater.

Node.js wrapper for the [OWASP depencency-check CLI tool](https://dependency-check.github.io/DependencyCheck/).

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

## Options

### Owasp Dependency Core options

You can specify any options which the [OWASP depencency-check CLI tool](https://dependency-check.github.io/DependencyCheck/) provides. For example, to generate a HTML and JSON report, use:

```
"scripts": {
  ...
  "owasp": "owasp-dependency-check --project \"YOUR PROJECT NAME\" -f HTML -f JSON"
}
```

### Additional options

Use `owasp-dependency-check --help` to check other options.
