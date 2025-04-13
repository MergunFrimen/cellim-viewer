import random
from datetime import timedelta

from faker import Faker
from faker.providers import internet
from sqlalchemy import text

from app.database.models import Entry, ShareLink, User, View
from app.database.models.mixins.timestamp_mixin import utcnow
from app.database.seeding.faker_provider import CellimProvider
from app.database.session_manager import get_session_manager

fake = Faker()
fake.add_provider(internet)
fake.add_provider(CellimProvider)


async def seed_database(num_users=3, num_entries=10, num_views=5, clear=False):
    async with get_session_manager().session() as session:
        if clear:
            print("Clearing existing data...")
            await session.execute(text("DELETE FROM views"))
            await session.execute(text("DELETE FROM share_links"))
            await session.execute(text("DELETE FROM entries"))
            await session.execute(text("DELETE FROM users"))
            await session.commit()

        print(f"Creating {num_users} users with {num_entries} entries each...")

        # Create users
        users = []
        for _ in range(num_users):
            user = User(
                id=fake.uuid4(),
                openid=fake.uuid4(),
                email=fake.email(),
                is_superuser=False,
                created_at=utcnow(),
                updated_at=utcnow(),
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
                    name=fake.entry_name(),
                    description=fake.entry_description(),
                    is_public=random.random() < 0.7,
                    created_at=created_date,
                    updated_at=created_date + timedelta(days=random.randint(0, 30)),
                )
                session.add(entry)
                #
                link = ShareLink(
                    id=fake.uuid4(),
                    url=f"{fake.image_url()}/{fake.uuid4()}",
                    editable=random.random() < 0.5,
                    active=random.random() < 0.8,
                    entry=entry,
                )
                session.add(link)
                #
                for _ in range(random.randint(0, num_views)):
                    view_created = entry.created_at + timedelta(hours=random.randint(1, 48))

                    view = View(
                        id=fake.uuid4(),
                        name=fake.view_name(),
                        description=fake.view_description(),
                        thumbnail_url=None,
                        snapshot_url=None,
                        created_at=view_created,
                        updated_at=view_created,
                        entry=entry,
                    )
                    views.append(view)
                    session.add(view)
        #
        await session.commit()

        user_count = await session.execute(text("SELECT COUNT(*) FROM users"))
        entry_count = await session.execute(text("SELECT COUNT(*) FROM entries"))
        view_count = await session.execute(text("SELECT COUNT(*) FROM views"))
        link_count = await session.execute(text("SELECT COUNT(*) FROM share_links"))

        print(f"✅ Created {user_count.scalar_one()} users")
        print(f"✅ Created {entry_count.scalar_one()} entries")
        print(f"✅ Created {view_count.scalar_one()} views")
        print(f"✅ Created {link_count.scalar_one()} share_links")
