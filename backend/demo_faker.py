#!/usr/bin/env python
"""
Demo script to showcase the custom CELLIM Faker provider.
This script can be run directly to see examples of the generated fake data.
"""

from faker import Faker
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

# Import the custom provider
from app.database.faker_provider import CellimProvider

# Create console for rich output
console = Console()

# Create and configure a faker instance
fake = Faker()
fake.add_provider(CellimProvider)


def show_entry_examples(count=5):
    """Show examples of generated entry data"""
    console.print(
        Panel.fit(
            "[bold blue]Entry Examples[/]",
            subtitle="[italic]Names and descriptions for CELLIM entries[/]",
        )
    )

    table = Table(title=f"{count} Sample Entry Names")
    table.add_column("Name", style="cyan")

    for _ in range(count):
        table.add_row(fake.entry_name())

    console.print(table)
    console.print()

    for i in range(1, count + 1):
        console.print(f"[bold cyan]Entry {i} Description:[/]")
        console.print(Panel(fake.entry_description(), border_style="blue", padding=(1, 2)))
        console.print()


def show_view_examples(count=5):
    """Show examples of generated view data"""
    console.print(
        Panel.fit(
            "[bold green]View Examples[/]",
            subtitle="[italic]Names and descriptions for CELLIM views[/]",
        )
    )

    table = Table(title=f"{count} Sample View Names")
    table.add_column("Name", style="green")

    for _ in range(count):
        table.add_row(fake.view_name())

    console.print(table)
    console.print()

    table = Table(title=f"{count} Sample View Descriptions")
    table.add_column("Description", style="green")

    for _ in range(count):
        table.add_row(fake.view_description())

    console.print(table)


def show_individual_providers():
    """Show examples of each individual provider"""
    console.print(
        Panel.fit(
            "[bold magenta]Individual Providers[/]",
            subtitle="[italic]Building blocks for complex fake data[/]",
        )
    )

    table = Table(title="Sample Values for Individual Providers")
    table.add_column("Provider", style="cyan")
    table.add_column("Value", style="magenta")

    providers = [
        "cell_type",
        "organelle",
        "cellular_process",
        "imaging_technique",
        "fluorescent_marker",
        "protein",
        "drug_treatment",
        "sample_type",
        "experimental_condition",
        "organism",
    ]

    for provider in providers:
        for _ in range(3):  # Show 3 examples of each
            table.add_row(provider, getattr(fake, provider)())

    console.print(table)


if __name__ == "__main__":
    console.print()
    console.rule("[bold]CELLIM Custom Faker Provider Demo[/]")
    console.print()

    show_entry_examples(3)
    console.rule()
    show_view_examples(5)
    console.rule()
    show_individual_providers()
