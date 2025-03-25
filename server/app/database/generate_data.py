import json
import uuid
from datetime import datetime, timedelta
import random

# Base date for our seed data (1 month ago)
base_date = datetime.now() - timedelta(days=30)

# Function to generate a random date between base_date and now
def random_date():
    days_to_add = random.randint(0, 30)
    return base_date + timedelta(days=days_to_add)

# Function to generate a realistic update date after created_at
def update_date(created_at):
    days_to_add = random.randint(1, 10)
    return created_at + timedelta(days=days_to_add)

# Sample authors
authors = [
    "john.doe@example.com",
    "jane.smith@research.org",
    "michael.brown@university.edu",
    "emily.wilson@science.net",
    None  # Some entries without author
]

# Sample MVS JSON objects
mvs_templates = [
    {
        "type": "molecular_visualization",
        "source": "pdb",
        "pdbId": "1ABC",
        "style": "cartoon",
        "colorScheme": "chainId",
        "camera": {
            "position": [0, 0, 100],
            "target": [0, 0, 0],
            "up": [0, 1, 0]
        }
    },
    {
        "type": "volumetric_data",
        "source": "volseg",
        "segmentId": "VS12345",
        "renderMode": "surface",
        "opacity": 0.7,
        "camera": {
            "position": [10, 20, 30],
            "target": [0, 0, 0],
            "up": [0, 1, 0]
        }
    },
    {
        "type": "combined_view",
        "elements": [
            {"type": "reference", "refId": "model1"},
            {"type": "reference", "refId": "segment3"}
        ],
        "camera": {
            "position": [5, 15, 25],
            "target": [3, 3, 3],
            "up": [0, 1, 0]
        }
    }
]

# Entries seed data
entries = [
    {
        "id": 1,
        "name": "Cell Membrane Complex",
        "description": """# Cell Membrane Complex
This visualization shows the detailed structure of a cell membrane with embedded proteins.

## Key Features
- Lipid bilayer structure
- Transmembrane proteins
- Peripheral proteins
- Glycoproteins

Research conducted as part of the Cell Biology Initiative.""",
        "author_email": "jane.smith@research.org",
        "thumbnail_path": "/thumbnails/cell_membrane.jpg",
        "is_public": True,
        "sharing_uuid": str(uuid.uuid4()),
        "edit_uuid": str(uuid.uuid4()),
        "created_at": random_date(),
        "updated_at": None,
        "deleted_at": None
    },
    {
        "id": 2,
        "name": "Mitochondrial Structure",
        "description": """# Mitochondrial Structure Analysis
Detailed 3D reconstruction of mitochondrial membranes and cristae.

The inner membrane folds create a large surface area for ATP production.

*This model was created using cryo-electron tomography data.*""",
        "author_email": "michael.brown@university.edu",
        "thumbnail_path": "/thumbnails/mitochondria.jpg",
        "is_public": True,
        "sharing_uuid": str(uuid.uuid4()),
        "edit_uuid": str(uuid.uuid4()),
        "created_at": random_date(),
        "updated_at": None,
        "deleted_at": None
    },
    {
        "id": 3,
        "name": "Nuclear Pore Complex",
        "description": """# Nuclear Pore Complex
Visualization of the nuclear pore complex structure.

## Components
- Cytoplasmic filaments
- Central transport channel
- Nuclear basket

This structure regulates the transport of molecules between the nucleus and cytoplasm.""",
        "author_email": "emily.wilson@science.net",
        "thumbnail_path": "/thumbnails/nuclear_pore.jpg",
        "is_public": False,
        "sharing_uuid": str(uuid.uuid4()),
        "edit_uuid": str(uuid.uuid4()),
        "created_at": random_date(),
        "updated_at": None,
        "deleted_at": None
    },
    {
        "id": 4,
        "name": "Enzyme-Substrate Complex",
        "description": """# Enzyme-Substrate Complex
This model shows the binding of a substrate to an enzyme active site.

The induced fit model demonstrates conformational changes upon substrate binding.

**Note:** This is a private entry for ongoing research.""",
        "author_email": "john.doe@example.com",
        "thumbnail_path": "/thumbnails/enzyme.jpg",
        "is_public": False,
        "sharing_uuid": str(uuid.uuid4()),
        "edit_uuid": str(uuid.uuid4()),
        "created_at": random_date(),
        "updated_at": None,
        "deleted_at": None
    },
    {
        "id": 5,
        "name": "Synaptic Junction",
        "description": """# Synaptic Junction
Visualization of a neuronal synapse showing:

- Presynaptic terminal
- Synaptic cleft
- Postsynaptic membrane
- Neurotransmitter vesicles

This model helps understand neurotransmitter release and reception.""",
        "author_email": None,
        "thumbnail_path": "/thumbnails/synapse.jpg",
        "is_public": True,
        "sharing_uuid": str(uuid.uuid4()),
        "edit_uuid": str(uuid.uuid4()),
        "created_at": random_date(),
        "updated_at": None,
        "deleted_at": None
    }
]

# Update some entries to have updated_at dates
for entry in entries:
    if random.choice([True, False]):
        entry["updated_at"] = update_date(entry["created_at"])

# Views seed data
views = [
    # Views for Entry 1 (Cell Membrane)
    {
        "id": 1,
        "title": "Full Membrane View",
        "description": "Complete view of the cell membrane complex with all proteins labeled.",
        "mvsj": {
            "type": "molecular_visualization",
            "source": "pdb",
            "pdbId": "4V6X",
            "style": "surface",
            "colorScheme": "chainId",
            "camera": {
                "position": [0, 0, 100],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[0]["created_at"] + timedelta(hours=2),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 1
    },
    {
        "id": 2,
        "title": "Transmembrane Protein Focus",
        "description": "Focused view on a single transmembrane protein showing its orientation in the lipid bilayer.",
        "mvsj": {
            "type": "molecular_visualization",
            "source": "pdb",
            "pdbId": "1ATP",
            "style": "cartoon",
            "colorScheme": "structure",
            "camera": {
                "position": [10, 5, 30],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[0]["created_at"] + timedelta(hours=3),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 1
    },
    
    # Views for Entry 2 (Mitochondria)
    {
        "id": 3,
        "title": "Outer Membrane",
        "description": "View focusing on the outer mitochondrial membrane.",
        "mvsj": {
            "type": "volumetric_data",
            "source": "volseg",
            "segmentId": "MT001",
            "renderMode": "surface",
            "opacity": 0.8,
            "camera": {
                "position": [20, 10, 40],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[1]["created_at"] + timedelta(hours=1),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 2
    },
    {
        "id": 4,
        "title": "Cristae Structure",
        "description": "Detailed view of the inner membrane cristae formations.",
        "mvsj": {
            "type": "volumetric_data",
            "source": "volseg",
            "segmentId": "MT002",
            "renderMode": "surface",
            "opacity": 0.9,
            "camera": {
                "position": [5, 15, 25],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[1]["created_at"] + timedelta(hours=2),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 2
    },
    {
        "id": 5,
        "title": "ATP Synthase Complexes",
        "description": "Visualization of ATP synthase complexes embedded in the inner membrane.",
        "mvsj": {
            "type": "combined_view",
            "elements": [
                {"type": "reference", "refId": "MT002"},
                {"type": "reference", "refId": "ATP001"}
            ],
            "camera": {
                "position": [10, 20, 30],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[1]["created_at"] + timedelta(hours=5),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 2
    },
    
    # Views for Entry 3 (Nuclear Pore)
    {
        "id": 6,
        "title": "Complete Nuclear Pore",
        "description": "Full view of the nuclear pore complex showing all components.",
        "mvsj": {
            "type": "molecular_visualization",
            "source": "pdb",
            "pdbId": "5IJN",
            "style": "cartoon",
            "colorScheme": "chainId",
            "camera": {
                "position": [0, 0, 150],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[2]["created_at"] + timedelta(hours=1),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 3
    },
    {
        "id": 7,
        "title": "Transport Channel",
        "description": "Cross-section view focusing on the central transport channel.",
        "mvsj": {
            "type": "volumetric_data",
            "source": "volseg",
            "segmentId": "NP001",
            "renderMode": "volume",
            "opacity": 0.6,
            "camera": {
                "position": [10, 0, 40],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[2]["created_at"] + timedelta(hours=4),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 3
    },
    
    # Views for Entry 4 (Enzyme)
    {
        "id": 8,
        "title": "Active Site",
        "description": "Close-up view of the enzyme active site with bound substrate.",
        "mvsj": {
            "type": "molecular_visualization",
            "source": "pdb",
            "pdbId": "1EAU",
            "style": "licorice",
            "colorScheme": "element",
            "camera": {
                "position": [5, 5, 20],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[3]["created_at"] + timedelta(hours=2),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 4
    },
    {
        "id": 9,
        "title": "Conformational Change",
        "description": "Comparison of enzyme structure before and after substrate binding.",
        "mvsj": {
            "type": "combined_view",
            "elements": [
                {"type": "reference", "refId": "ENZ001"},
                {"type": "reference", "refId": "ENZ002"}
            ],
            "camera": {
                "position": [0, 10, 40],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[3]["created_at"] + timedelta(hours=3),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 4
    },
    
    # Views for Entry 5 (Synapse)
    {
        "id": 10,
        "title": "Complete Synapse",
        "description": "Full view of the synaptic junction between neurons.",
        "mvsj": {
            "type": "volumetric_data",
            "source": "volseg",
            "segmentId": "SYN001",
            "renderMode": "surface",
            "opacity": 0.85,
            "camera": {
                "position": [0, 0, 100],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[4]["created_at"] + timedelta(hours=1),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 5
    },
    {
        "id": 11,
        "title": "Neurotransmitter Vesicles",
        "description": "Close-up view of neurotransmitter vesicles in the presynaptic terminal.",
        "mvsj": {
            "type": "volumetric_data",
            "source": "volseg",
            "segmentId": "SYN002",
            "renderMode": "surface",
            "opacity": 0.9,
            "camera": {
                "position": [5, 10, 30],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[4]["created_at"] + timedelta(hours=3),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 5
    },
    {
        "id": 12,
        "title": "Receptor Distribution",
        "description": "Visualization of receptor distribution on the postsynaptic membrane.",
        "mvsj": {
            "type": "volumetric_data",
            "source": "volseg",
            "segmentId": "SYN003",
            "renderMode": "points",
            "pointSize": 5,
            "opacity": 1.0,
            "camera": {
                "position": [10, 5, 20],
                "target": [0, 0, 0],
                "up": [0, 1, 0]
            }
        },
        "created_at": entries[4]["created_at"] + timedelta(hours=5),
        "updated_at": None,
        "deleted_at": None,
        "entry_id": 5
    }
]

# Update some views to have updated_at dates
for view in views:
    if random.choice([True, False]):
        view["updated_at"] = update_date(view["created_at"])

# Create the final seed data dictionary
seed_data = {
    "entries": entries,
    "views": views
}

# Convert to JSON string (formatted for readability)
seed_json = json.dumps(seed_data, indent=2, default=str)

# Print the JSON (or you could save it to a file)
print(seed_json)

# To save to a file:
with open("seed_data.json", "w") as f:
    f.write(seed_json)

# This function will generate SQL insert statements if needed
def generate_sql_inserts():
    sql_statements = []
    
    # Entries inserts
    for entry in entries:
        created_at = f"'{entry['created_at']}'" if entry['created_at'] else "NULL"
        updated_at = f"'{entry['updated_at']}'" if entry['updated_at'] else "NULL"
        deleted_at = f"'{entry['deleted_at']}'" if entry['deleted_at'] else "NULL"
        author_email = f"'{entry['author_email']}'" if entry['author_email'] else "NULL"
        thumbnail_path = f"'{entry['thumbnail_path']}'" if entry['thumbnail_path'] else "NULL"
        
        sql = f"""INSERT INTO entries (id, name, description, author_email, thumbnail_path, is_public, sharing_uuid, edit_uuid, created_at, updated_at, deleted_at)
VALUES ({entry['id']}, '{entry['name']}', '{entry['description'].replace("'", "''")}', {author_email}, {thumbnail_path}, {entry['is_public']}, '{entry['sharing_uuid']}', '{entry['edit_uuid']}', {created_at}, {updated_at}, {deleted_at});"""
        sql_statements.append(sql)
    
    # Views inserts
    for view in views:
        created_at = f"'{view['created_at']}'" if view['created_at'] else "NULL"
        updated_at = f"'{view['updated_at']}'" if view['updated_at'] else "NULL"
        deleted_at = f"'{view['deleted_at']}'" if view['deleted_at'] else "NULL"
        mvsj = json.dumps(view['mvsj']).replace("'", "''")
        
        sql = f"""INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES ({view['id']}, '{view['title']}', '{view['description'].replace("'", "''")}', '{mvsj}', {created_at}, {updated_at}, {deleted_at}, {view['entry_id']});"""
        sql_statements.append(sql)
    
    return "\n\n".join(sql_statements)

# Generate and save SQL inserts
sql_inserts = generate_sql_inserts()
with open("seed_data.sql", "w") as f:
    f.write(sql_inserts)