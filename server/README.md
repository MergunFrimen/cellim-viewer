# CELLIM Viewer API

## Prerequisites

1. Install [uv](https://docs.astral.sh/uv/getting-started/installation/).

## How to setup environment

1. Create virtual environment
```shell
uv venv
```

2. Activate virtual environment
```shell
source .venv/bin/activate
```

## How to run app

```shell
uv run main.py
```

## Tests

```shell
uvx pytest
```

## Formatter

```shell
uvx ruff format
```

## Linter

```shell
uvx ruff check --fix
```

## Type checker

```shell
uv run mypy .
```
