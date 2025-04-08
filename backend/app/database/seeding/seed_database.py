import random
from datetime import datetime, timedelta

from faker import Faker
from faker.providers import internet
from sqlalchemy import text

from app.database.models import Entry, User, View
from app.database.models.link import Link
from app.database.seeding.faker_provider import CellimProvider
from app.database.session import sessionmanager

fake = Faker()
fake.add_provider(internet)
fake.add_provider(CellimProvider)


async def seed_database(num_users=3, num_entries=10, num_views=5, clear=False):
    async with sessionmanager.session() as session:
        if clear:
            print("Clearing existing data...")
            await session.execute(text("DELETE FROM views"))
            await session.execute(text("DELETE FROM links"))
            await session.execute(text("DELETE FROM entries"))
            await session.execute(text("DELETE FROM users"))
            await session.commit()

        print(f"Creating {num_users} users with {num_entries} entries each...")
        users = []

        # Create users
        for _ in range(num_users):
            user = User(
                id=fake.uuid4(),
                is_superuser=False,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                entries=[],
                email=fake.email(),
                openid=fake.uuid4(),
            )
            session.add(user)
            users.append(user)

        for user in users:
            for _ in range(num_entries):
                views = []
                entry_id = fake.uuid4()
                created_date = fake.date_time_between(start_date="-1y", end_date="now")
                entry = Entry(
                    id=entry_id,
                    user_id=user.id,
                    name=fake.entry_name(),
                    description=fake.entry_description(),
                    is_public=random.random() < 0.7,
                    user=user,
                    created_at=created_date,
                    updated_at=created_date + timedelta(days=random.randint(0, 30)),
                    deleted_at=None
                    if random.random() > 0.1
                    else created_date + timedelta(days=random.randint(0, 30)),
                    views=views,
                    link=None,
                )
                session.add(entry)

                link = Link(
                    id=fake.uuid4(),
                    entry_id=entry_id,
                    entry=entry,
                    link=fake.uuid4(),
                    editable=random.random() < 0.5,
                    created_at=datetime.now(),
                    updated_at=datetime.now(),
                    deleted_at=None,
                )
                entry.link = link

                session.add(link)

                for _ in range(random.randint(0, num_views)):
                    view_created = entry.created_at + timedelta(hours=random.randint(1, 48))
                    view_snapshot = fake.view_snapshot() if random.random() < 0.8 else None

                    view = View(
                        id=fake.uuid4(),
                        entry_id=entry_id,
                        entry=entry,
                        name=fake.view_name(),
                        description=fake.view_description(),
                        snapshot=view_snapshot,
                        thumbnail_uri=None,
                        snapshot_uri=None,
                        created_at=view_created,
                        updated_at=view_created,
                        deleted_at=None,
                    )
                    views.append(view)
                    session.add(view)

        await session.commit()

        user_count = await session.execute(text("SELECT COUNT(*) FROM users"))
        entry_count = await session.execute(text("SELECT COUNT(*) FROM entries"))
        view_count = await session.execute(text("SELECT COUNT(*) FROM views"))
        link_count = await session.execute(text("SELECT COUNT(*) FROM links"))

        print(f"✅ Created {user_count.scalar_one()} users")
        print(f"✅ Created {entry_count.scalar_one()} entries")
        print(f"✅ Created {view_count.scalar_one()} views")
        print(f"✅ Created {link_count.scalar_one()} links")
