import random
import sys
from datetime import timedelta
from pathlib import Path

from faker import Faker
from faker.providers import internet
from sqlalchemy import text

from app.database.models.volseg_entry_model import VolsegEntry

sys.path.append(str(Path(__file__).parent.parent.parent))

from app.core.security import get_admin_user_id, get_regular_user_id
from app.database.models import Entry, ShareLink, User, View
from app.database.models.role_model import Role, RoleEnum
from app.database.session_manager import get_session_manager
from tools.db_seeding.faker_provider import CellimProvider

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

        user_role = Role(
            name=RoleEnum.user,
            description="Something",
        )
        admin_role = Role(
            name=RoleEnum.admin,
            description="Something",
        )
        session.add(user_role)
        session.add(admin_role)

        # Create users
        users = []
        test_user = User(
            id=get_regular_user_id(),
            openid=fake.uuid4(),
            email="user@email.com",
            role=user_role,
        )
        admin_user = User(
            id=get_admin_user_id(),
            openid=fake.uuid4(),
            email="admin@email.com",
            role=admin_role,
        )
        session.add(test_user)
        session.add(admin_user)

        users.append(test_user)
        users.append(admin_user)

        for _ in range(num_users):
            user = User(
                id=fake.uuid4(),
                openid=fake.uuid4(),
                email=fake.email(),
                role=user_role,
            )
            session.add(user)
            users.append(user)

        volseg_entry = VolsegEntry(
            db_name="emdb",
            entry_id="emd-1832",
            is_public=True,
            user=test_user,
        )

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
                    volseg_entry=volseg_entry,
                    user=user,
                )
                session.add(entry)
                #
                link = ShareLink(
                    id=fake.uuid4(),
                    is_editable=random.random() < 0.5,
                    is_active=random.random() < 0.8,
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
                        thumbnail_url=fake.image_url(),
                        snapshot_url=fake.image_url(),
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
