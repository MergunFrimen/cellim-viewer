import json
import os
import sys

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.models import Base, Entry, View
from app.database.session import SessionLocal, engine


def import_from_json(json_file_path):
    """Import entries from a JSON file."""
    try:
        with open(json_file_path, "r") as f:
            entries_data = json.load(f)

        db = SessionLocal()
        try:
            for entry_data in entries_data:
                views_data = entry_data.pop("views", [])

                # Create entry
                entry = Entry(**entry_data)
                db.add(entry)
                db.flush()

                # Create views for this entry
                for view_data in views_data:
                    view = View(entry_id=entry.id, **view_data)
                    db.add(view)

            db.commit()
            print(f"Successfully imported {len(entries_data)} entries from {json_file_path}")

        except Exception as e:
            db.rollback()
            print(f"Error importing data: {e}")
        finally:
            db.close()

    except Exception as e:
        print(f"Error reading JSON file: {e}")


if __name__ == "__main__":
    import argparse

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    parser = argparse.ArgumentParser(description="Seed the CELLIM Viewer database")
    parser.add_argument("--json", help="Path to JSON file to import")

    args = parser.parse_args()

    if args.json:
        import_from_json(args.json)
    else:
        parser.print_help()
