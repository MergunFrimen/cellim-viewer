import asyncio
import sys
from pathlib import Path

import typer
from rich import print as rprint
from rich.console import Console
from rich.panel import Panel

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from app.database.models.base import Base
from app.database.seeding.seed_database import seed_database
from app.database.session import sessionmanager

# Create Typer app
app = typer.Typer(help="CELLIM Viewer database management CLI")
console = Console()


async def close_connections():
    """Close database connections."""
    if sessionmanager.engine is not None:
        await sessionmanager.close()
    console.print("[green]Database connections closed.[/]")


@app.command()
def init(
    drop: bool = typer.Option(False, "--drop", help="Drop all tables before creating new ones"),
):
    """Initialize the database schema."""

    async def _init_db():
        with console.status("[bold blue]Initializing database schema...[/]"):
            try:
                async with sessionmanager.engine.begin() as conn:
                    if drop:
                        console.print("[bold yellow]Dropping all tables...[/]")
                        await conn.run_sync(Base.metadata.drop_all)
                    await conn.run_sync(Base.metadata.create_all)
                console.print("[bold green]Database schema initialized successfully![/]")
            finally:
                await close_connections()

    asyncio.run(_init_db())


@app.command()
def seed(
    users: int = typer.Option(3, "--users", "-u", help="Number of users to create"),
    entries: int = typer.Option(10, "--entries", "-e", help="Number of entries per user"),
    views: int = typer.Option(5, "--views", "-v", help="Max number of views per entry"),
    clear: bool = typer.Option(False, "--clear", "-c", help="Clear existing data before seeding"),
):
    """Seed the database with sample data."""

    async def _seed_db():
        with console.status("[bold blue]Seeding database...[/]"):
            try:
                await seed_database(
                    num_users=users, num_entries=entries, num_views=views, clear=clear
                )
                console.print("[bold green]Database seeded successfully![/]")
            finally:
                await close_connections()

    asyncio.run(_seed_db())


@app.command()
def reset(
    users: int = typer.Option(5, "--users", "-u", help="Number of users to create"),
    entries: int = typer.Option(10, "--entries", "-e", help="Number of entries per user"),
    views: int = typer.Option(5, "--views", "-v", help="Max number of views per entry"),
):
    """Reset database (drop all tables, create schema, and seed with data)."""

    async def _reset_db():
        try:
            # # Display warning
            # confirmation = typer.confirm(
            #     "⚠️  This will erase all data in the database. Continue?", default=False
            # )
            # if not confirmation:
            #     console.print("[bold yellow]Operation cancelled.[/]")
            #     return

            # Step 1: Drop and recreate schema
            with console.status("[bold blue]Dropping and recreating database schema...[/]"):
                async with sessionmanager.engine.begin() as conn:
                    await conn.run_sync(Base.metadata.drop_all)
                    await conn.run_sync(Base.metadata.create_all)

            # Step 2: Seed with data
            with console.status("[bold blue]Seeding database with sample data...[/]"):
                await seed_database(
                    num_users=users, num_entries=entries, num_views=views, clear=False
                )

            console.print("[bold green]Database reset completed successfully![/]")
        finally:
            await close_connections()

    asyncio.run(_reset_db())


@app.callback()
def main():
    """
    CELLIM Viewer Database Management CLI

    Manage your CELLIM Viewer database with ease.
    """
    # Display welcome message
    rprint(
        Panel.fit(
            "[bold blue]CELLIM Viewer Database Management[/]",
            subtitle="[italic]Manage your database with ease[/]",
        )
    )


if __name__ == "__main__":
    app()
