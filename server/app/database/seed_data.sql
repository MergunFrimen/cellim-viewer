INSERT INTO entries (id, name, description, author_email, thumbnail_path, is_public, sharing_uuid, edit_uuid, created_at, updated_at, deleted_at)
VALUES (1, 'Cell Membrane Complex', '# Cell Membrane Complex
This visualization shows the detailed structure of a cell membrane with embedded proteins.

## Key Features
- Lipid bilayer structure
- Transmembrane proteins
- Peripheral proteins
- Glycoproteins

Research conducted as part of the Cell Biology Initiative.', 'jane.smith@research.org', '/thumbnails/cell_membrane.jpg', True, '0e8a68cf-c4b7-481a-86fc-9175a72bffc9', '6a0d29a0-8693-450b-ba44-6fd8ff527097', '2025-03-25 01:15:21.754811', NULL, NULL);

INSERT INTO entries (id, name, description, author_email, thumbnail_path, is_public, sharing_uuid, edit_uuid, created_at, updated_at, deleted_at)
VALUES (2, 'Mitochondrial Structure', '# Mitochondrial Structure Analysis
Detailed 3D reconstruction of mitochondrial membranes and cristae.

The inner membrane folds create a large surface area for ATP production.

*This model was created using cryo-electron tomography data.*', 'michael.brown@university.edu', '/thumbnails/mitochondria.jpg', True, '29a0bfad-7c3a-4a44-b4e5-3fdc3952cd08', '092f7a31-463f-4f75-b68f-777bef2cd4f5', '2025-03-07 01:15:21.754811', NULL, NULL);

INSERT INTO entries (id, name, description, author_email, thumbnail_path, is_public, sharing_uuid, edit_uuid, created_at, updated_at, deleted_at)
VALUES (3, 'Nuclear Pore Complex', '# Nuclear Pore Complex
Visualization of the nuclear pore complex structure.

## Components
- Cytoplasmic filaments
- Central transport channel
- Nuclear basket

This structure regulates the transport of molecules between the nucleus and cytoplasm.', 'emily.wilson@science.net', '/thumbnails/nuclear_pore.jpg', False, 'f83d0539-c9fa-4762-91ed-1d0ff685cf76', '54c1b13f-f14a-41a6-8887-8c2586342b27', '2025-03-19 01:15:21.754811', '2025-03-25 01:15:21.754811', NULL);

INSERT INTO entries (id, name, description, author_email, thumbnail_path, is_public, sharing_uuid, edit_uuid, created_at, updated_at, deleted_at)
VALUES (4, 'Enzyme-Substrate Complex', '# Enzyme-Substrate Complex
This model shows the binding of a substrate to an enzyme active site.

The induced fit model demonstrates conformational changes upon substrate binding.

**Note:** This is a private entry for ongoing research.', 'john.doe@example.com', '/thumbnails/enzyme.jpg', False, '0e41fc26-32d7-4113-8c32-5af7268c7f57', 'a4553be0-8702-42bf-a71a-d7cfdb425471', '2025-03-20 01:15:21.754811', '2025-03-30 01:15:21.754811', NULL);

INSERT INTO entries (id, name, description, author_email, thumbnail_path, is_public, sharing_uuid, edit_uuid, created_at, updated_at, deleted_at)
VALUES (5, 'Synaptic Junction', '# Synaptic Junction
Visualization of a neuronal synapse showing:

- Presynaptic terminal
- Synaptic cleft
- Postsynaptic membrane
- Neurotransmitter vesicles

This model helps understand neurotransmitter release and reception.', NULL, '/thumbnails/synapse.jpg', True, 'e3683202-c94e-4323-a8d6-9c67b2d0a310', 'b1c8e726-e814-414d-aa3a-a48d00dea736', '2025-02-27 01:15:21.754811', NULL, NULL);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (1, 'Full Membrane View', 'Complete view of the cell membrane complex with all proteins labeled.', '{"type": "molecular_visualization", "source": "pdb", "pdbId": "4V6X", "style": "surface", "colorScheme": "chainId", "camera": {"position": [0, 0, 100], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-25 03:15:21.754811', '2025-03-30 03:15:21.754811', NULL, 1);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (2, 'Transmembrane Protein Focus', 'Focused view on a single transmembrane protein showing its orientation in the lipid bilayer.', '{"type": "molecular_visualization", "source": "pdb", "pdbId": "1ATP", "style": "cartoon", "colorScheme": "structure", "camera": {"position": [10, 5, 30], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-25 04:15:21.754811', NULL, NULL, 1);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (3, 'Outer Membrane', 'View focusing on the outer mitochondrial membrane.', '{"type": "volumetric_data", "source": "volseg", "segmentId": "MT001", "renderMode": "surface", "opacity": 0.8, "camera": {"position": [20, 10, 40], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-07 02:15:21.754811', NULL, NULL, 2);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (4, 'Cristae Structure', 'Detailed view of the inner membrane cristae formations.', '{"type": "volumetric_data", "source": "volseg", "segmentId": "MT002", "renderMode": "surface", "opacity": 0.9, "camera": {"position": [5, 15, 25], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-07 03:15:21.754811', '2025-03-14 03:15:21.754811', NULL, 2);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (5, 'ATP Synthase Complexes', 'Visualization of ATP synthase complexes embedded in the inner membrane.', '{"type": "combined_view", "elements": [{"type": "reference", "refId": "MT002"}, {"type": "reference", "refId": "ATP001"}], "camera": {"position": [10, 20, 30], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-07 06:15:21.754811', NULL, NULL, 2);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (6, 'Complete Nuclear Pore', 'Full view of the nuclear pore complex showing all components.', '{"type": "molecular_visualization", "source": "pdb", "pdbId": "5IJN", "style": "cartoon", "colorScheme": "chainId", "camera": {"position": [0, 0, 150], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-19 02:15:21.754811', '2025-03-28 02:15:21.754811', NULL, 3);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (7, 'Transport Channel', 'Cross-section view focusing on the central transport channel.', '{"type": "volumetric_data", "source": "volseg", "segmentId": "NP001", "renderMode": "volume", "opacity": 0.6, "camera": {"position": [10, 0, 40], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-19 05:15:21.754811', '2025-03-26 05:15:21.754811', NULL, 3);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (8, 'Active Site', 'Close-up view of the enzyme active site with bound substrate.', '{"type": "molecular_visualization", "source": "pdb", "pdbId": "1EAU", "style": "licorice", "colorScheme": "element", "camera": {"position": [5, 5, 20], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-20 03:15:21.754811', NULL, NULL, 4);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (9, 'Conformational Change', 'Comparison of enzyme structure before and after substrate binding.', '{"type": "combined_view", "elements": [{"type": "reference", "refId": "ENZ001"}, {"type": "reference", "refId": "ENZ002"}], "camera": {"position": [0, 10, 40], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-03-20 04:15:21.754811', '2025-03-26 04:15:21.754811', NULL, 4);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (10, 'Complete Synapse', 'Full view of the synaptic junction between neurons.', '{"type": "volumetric_data", "source": "volseg", "segmentId": "SYN001", "renderMode": "surface", "opacity": 0.85, "camera": {"position": [0, 0, 100], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-02-27 02:15:21.754811', '2025-03-02 02:15:21.754811', NULL, 5);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (11, 'Neurotransmitter Vesicles', 'Close-up view of neurotransmitter vesicles in the presynaptic terminal.', '{"type": "volumetric_data", "source": "volseg", "segmentId": "SYN002", "renderMode": "surface", "opacity": 0.9, "camera": {"position": [5, 10, 30], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-02-27 04:15:21.754811', '2025-03-04 04:15:21.754811', NULL, 5);

INSERT INTO views (id, title, description, mvsj, created_at, updated_at, deleted_at, entry_id)
VALUES (12, 'Receptor Distribution', 'Visualization of receptor distribution on the postsynaptic membrane.', '{"type": "volumetric_data", "source": "volseg", "segmentId": "SYN003", "renderMode": "points", "pointSize": 5, "opacity": 1.0, "camera": {"position": [10, 5, 20], "target": [0, 0, 0], "up": [0, 1, 0]}}', '2025-02-27 06:15:21.754811', '2025-03-01 06:15:21.754811', NULL, 5);