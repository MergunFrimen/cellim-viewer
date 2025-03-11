# CELLIM Viewer API

## Prerequisites

1. Install [uv](https://docs.astral.sh/uv/getting-started/installation/).

2. Install Python 3.12

```shell
uv python install 3.12
```

## How to setup environment

1. Create virtual environment
```shell
uv venv
```

2. Activate virtual environment
```shell
source .venv/bin/activate
```

3. Install dependencies

```shell
# runtime
uv sync
```

## How to run app

```shell
python main.py
```

## Tests

```shell
pytest
```

## Formatter

```shell
ruff format
```

## Linter

```shell
ruff check --fix
```

## Type checker

```shell
mypy .
```
