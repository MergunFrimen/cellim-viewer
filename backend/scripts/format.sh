#!/bin/sh -e

set -e
set -x

ruff check app scripts --fix
ruff format app scripts