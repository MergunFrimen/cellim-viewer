# CELLIM Viewer API

## Prerequisites

1. Install Python 3.12

```shell
pyenv install 3.12.8
```

## How to setup environment

1. Create virtual environment
```shell
pyenv exec python -m venv venv
```

2. Activate virtual environment
```shell
source venv/bin/activate
```

3. Install dependencies

```shell
# runtime
pip install -r requirements.txt
```

```shell
# dev
pip install -r requirements.dev.txt
```

## How to run

### App

```shell
python main.py
```

### Tests

```shell
python -m pytest
```

## How to compile

```shell
pyinstaller --onefile --noconsole --icon=icon.ico main.py
```

## Formatting

```shell
black .
```
```shell
isort .
```

## Static analyzers

### Types

```shell
mypy .
```

### Linting

```shell
pylint *.py
```

### Security

```shell
bandit -r .
```
