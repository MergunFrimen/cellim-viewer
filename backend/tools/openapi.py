import asyncio
import json
import sys
from pathlib import Path

import httpx
import typer
from rich import print as rprint
from rich.console import Console
from rich.panel import Panel

sys.path.append(str(Path(__file__).parent.parent))

from app.core.settings import get_settings

# Create Typer app
app = typer.Typer(help="CELLIM Viewer OpenAPI Management CLI")
console = Console()


@app.command()
def fix_operation_ids():
    """Fix operation IDs."""

    async def _fix_operation_ids():
        with console.status("[bold blue]Fixing operation IDs...[/]"):
            file_path = Path("./docs/openapi.json")
            openapi_url = f"{get_settings().APP_URL}{get_settings().OPENAPI_URL}"
            print(openapi_url)
            response = await httpx.AsyncClient().get(openapi_url)
            openapi_content = response.json()

            for path_data in openapi_content["paths"].values():
                for operation in path_data.values():
                    tag = operation["tags"][0]
                    operation_id = operation["operationId"]
                    to_remove = f"{tag}-"
                    new_operation_id = operation_id[len(to_remove) :]
                    operation["operationId"] = new_operation_id

            file_path.write_text(json.dumps(openapi_content))
            console.print("[bold green]Generated OpenAPI JSON![/]")

    asyncio.run(_fix_operation_ids())


@app.callback()
def main():
    """
    CELLIM Viewer OpenAPI Management CLI
    """
    # Display welcome message
    rprint(
        Panel.fit(
            "[bold blue]CELLIM Viewer Database Management[/]",
        )
    )


if __name__ == "__main__":
    app()
