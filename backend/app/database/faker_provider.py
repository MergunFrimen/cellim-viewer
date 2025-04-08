import random

from faker.providers import BaseProvider


class CellimProvider(BaseProvider):
    """
    Custom provider for CELLIM domain-specific fake data.
    """

    # Cell types and structures relevant to cell imaging
    cell_types = [
        "Fibroblast",
        "Macrophage",
        "Neuron",
        "Epithelial",
        "Endothelial",
        "T-Cell",
        "B-Cell",
        "Stem Cell",
        "Osteoblast",
        "Chondrocyte",
        "HeLa",
        "CHO",
        "HEK293",
        "MCF-7",
        "U2OS",
        "A549",
        "PC-12",
    ]

    organelles = [
        "Mitochondria",
        "Nucleus",
        "Golgi Apparatus",
        "Endoplasmic Reticulum",
        "Lysosome",
        "Peroxisome",
        "Centrosome",
        "Vacuole",
        "Chloroplast",
        "Ribosome",
        "Nuclear Membrane",
        "Cell Membrane",
        "Cytoskeleton",
    ]

    cellular_processes = [
        "Endocytosis",
        "Exocytosis",
        "Mitosis",
        "Meiosis",
        "Apoptosis",
        "Autophagy",
        "Phagocytosis",
        "Transcription",
        "Translation",
        "Cell Signaling",
        "Cell Migration",
        "Cell Differentiation",
        "Protein Folding",
        "DNA Replication",
        "Cell Respiration",
    ]

    imaging_techniques = [
        "Confocal Microscopy",
        "Super-Resolution Microscopy",
        "Two-Photon Microscopy",
        "Light-Sheet Microscopy",
        "TIRF Microscopy",
        "STORM",
        "PALM",
        "STED",
        "SIM",
        "Fluorescence Microscopy",
        "Phase Contrast",
        "DIC",
        "Electron Microscopy",
        "Cryo-EM",
        "Atomic Force Microscopy",
    ]

    fluorescent_markers = [
        "GFP",
        "RFP",
        "YFP",
        "mCherry",
        "DAPI",
        "Hoechst",
        "Alexa Fluor",
        "Cy3",
        "Cy5",
        "FITC",
        "TRITC",
        "Phalloidin",
        "DiI",
        "Calcein",
        "Fluo-4",
        "MitoTracker",
        "LysoTracker",
        "LifeAct",
    ]

    proteins = [
        "Actin",
        "Tubulin",
        "Collagen",
        "Myosin",
        "Keratin",
        "Lamin",
        "Clathrin",
        "Integrin",
        "Cadherin",
        "TP53",
        "BRCA1",
        "EGFR",
        "MAP2",
        "Rab5",
        "Rab7",
        "LAMP1",
        "EEA1",
        "Calnexin",
        "TOMM20",
    ]

    drugs_treatments = [
        "Nocodazole",
        "Latrunculin",
        "Cytochalasin D",
        "Brefeldin A",
        "Rapamycin",
        "Bafilomycin",
        "Staurosporine",
        "Taxol",
        "Thapsigargin",
        "Tunicamycin",
        "Cycloheximide",
        "Actinomycin D",
        "TNF-alpha",
        "TGF-beta",
        "EGF",
        "FGF",
        "IGF",
        "VEGF",
        "Wnt3a",
    ]

    sample_types = [
        "3D Culture",
        "Organoid",
        "Spheroid",
        "Tissue Section",
        "Single Cell",
        "Monolayer",
        "Fixed Sample",
        "Live Cell",
        "Explant",
        "Primary Culture",
        "In Vivo",
        "Ex Vivo",
        "Immunostained",
        "Cell Extract",
        "Whole Mount",
    ]

    experimental_conditions = [
        "High Glucose",
        "Low Glucose",
        "Hypoxia",
        "Hyperoxia",
        "Acidic pH",
        "Alkaline pH",
        "High Density",
        "Low Density",
        "Serum Starvation",
        "Growth Factor Depletion",
        "Heat Shock",
        "Cold Shock",
        "Oxidative Stress",
        "ER Stress",
        "DNA Damage",
    ]

    organisms = [
        "Human",
        "Mouse",
        "Rat",
        "Zebrafish",
        "Drosophila",
        "C. elegans",
        "Arabidopsis",
        "Xenopus",
        "Yeast",
        "E. coli",
        "A. thaliana",
        "D. discoideum",
        "S. cerevisiae",
    ]

    # Methods to generate domain-specific content
    def cell_type(self):
        """Return a random cell type."""
        return self.random_element(self.cell_types)

    def organelle(self):
        """Return a random cellular organelle."""
        return self.random_element(self.organelles)

    def cellular_process(self):
        """Return a random cellular process."""
        return self.random_element(self.cellular_processes)

    def imaging_technique(self):
        """Return a random imaging technique."""
        return self.random_element(self.imaging_techniques)

    def fluorescent_marker(self):
        """Return a random fluorescent marker."""
        return self.random_element(self.fluorescent_markers)

    def protein(self):
        """Return a random protein."""
        return self.random_element(self.proteins)

    def drug_treatment(self):
        """Return a random drug or treatment."""
        return self.random_element(self.drugs_treatments)

    def sample_type(self):
        """Return a random sample type."""
        return self.random_element(self.sample_types)

    def experimental_condition(self):
        """Return a random experimental condition."""
        return self.random_element(self.experimental_conditions)

    def organism(self):
        """Return a random organism."""
        return self.random_element(self.organisms)

    # Custom methods for generating domain-specific entries
    def entry_name(self):
        """Generate a realistic name for a CELLIM entry."""
        patterns = [
            "{organism} {cell_type} {cellular_process}",
            "{imaging_technique} of {protein} in {cell_type} cells",
            "{fluorescent_marker}-labeled {organelle} in {cell_type}",
            "{drug_treatment} effects on {cell_type} {organelle}",
            "{sample_type} imaging of {organism} {cell_type}",
            "{protein} dynamics during {cellular_process}",
            "{experimental_condition} induced {cellular_process}",
            "{imaging_technique} study of {fluorescent_marker} in {sample_type}",
            "Time-lapse imaging of {cellular_process} in {cell_type}",
            "{protein} localization in {organelle} using {imaging_technique}",
        ]

        pattern = self.random_element(patterns)
        return pattern.format(
            organism=self.organism(),
            cell_type=self.cell_type(),
            cellular_process=self.cellular_process(),
            imaging_technique=self.imaging_technique(),
            protein=self.protein(),
            fluorescent_marker=self.fluorescent_marker(),
            organelle=self.organelle(),
            drug_treatment=self.drug_treatment(),
            sample_type=self.sample_type(),
            experimental_condition=self.experimental_condition(),
        )

    def entry_description(self):
        """Generate a realistic description for a CELLIM entry."""
        parts = []

        # Introduction
        intro_templates = [
            "This dataset contains {imaging_technique} images of {organism} {cell_type} cells.",
            "A collection of {sample_type} images showing {protein} distribution during {cellular_process}.",
            "Time-series data of {fluorescent_marker}-labeled {organelle} in {cell_type} cells.",
        ]
        parts.append(
            self.random_element(intro_templates).format(
                imaging_technique=self.imaging_technique(),
                organism=self.organism(),
                cell_type=self.cell_type(),
                sample_type=self.sample_type(),
                protein=self.protein(),
                cellular_process=self.cellular_process(),
                fluorescent_marker=self.fluorescent_marker(),
                organelle=self.organelle(),
            )
        )

        # Methodology
        method_templates = [
            "Cells were fixed and stained with {fluorescent_marker} to visualize {organelle}.",
            "Live cell imaging was performed using {imaging_technique} with {fluorescent_marker} as a marker.",
            "Samples were treated with {drug_treatment} to induce {cellular_process}.",
            "{sample_type} were cultured under {experimental_condition} conditions for 24 hours before imaging.",
        ]
        parts.append(
            self.random_element(method_templates).format(
                fluorescent_marker=self.fluorescent_marker(),
                organelle=self.organelle(),
                imaging_technique=self.imaging_technique(),
                drug_treatment=self.drug_treatment(),
                cellular_process=self.cellular_process(),
                sample_type=self.sample_type(),
                experimental_condition=self.experimental_condition(),
            )
        )

        # Results or observations
        result_templates = [
            "The images reveal distinct localization patterns of {protein} in response to {drug_treatment}.",
            "We observed dynamic changes in {organelle} morphology during {cellular_process}.",
            "The data shows colocalization between {protein} and {organelle} markers.",
            "Significant differences were detected between control and {experimental_condition} treated samples.",
        ]
        parts.append(
            self.random_element(result_templates).format(
                protein=self.protein(),
                drug_treatment=self.drug_treatment(),
                organelle=self.organelle(),
                cellular_process=self.cellular_process(),
                experimental_condition=self.experimental_condition(),
            )
        )

        # Conclusion or implications
        conclusion_templates = [
            "These results suggest a role for {protein} in regulating {cellular_process}.",
            "The imaging data provides new insights into {organelle} dynamics in {cell_type} cells.",
            "This dataset serves as a valuable resource for studying {cellular_process} in {organism} cells.",
            "Further analysis may reveal additional features of {protein} behavior under {experimental_condition}.",
        ]
        parts.append(
            self.random_element(conclusion_templates).format(
                protein=self.protein(),
                cellular_process=self.cellular_process(),
                organelle=self.organelle(),
                cell_type=self.cell_type(),
                organism=self.organism(),
                experimental_condition=self.experimental_condition(),
            )
        )

        return "\n\n".join(parts)

    def view_name(self):
        """Generate a name for a view within an entry."""
        patterns = [
            "{organelle} view",
            "{protein} distribution",
            "{cell_type} morphology",
            "Time point {time_point}",
            "Z-stack {z_number}",
            "{fluorescent_marker} channel",
            "{imaging_technique} projection",
            "Region of interest {roi_number}",
            "{experimental_condition} condition",
            "Control vs {drug_treatment}",
            "{view_direction} view",
            "Surface rendering of {organelle}",
            "{protein} 3D reconstruction",
        ]

        pattern = self.random_element(patterns)
        return pattern.format(
            organelle=self.organelle(),
            protein=self.protein(),
            cell_type=self.cell_type(),
            time_point=random.randint(1, 24),
            z_number=random.randint(1, 50),
            fluorescent_marker=self.fluorescent_marker(),
            imaging_technique=self.imaging_technique(),
            roi_number=random.randint(1, 10),
            experimental_condition=self.experimental_condition(),
            drug_treatment=self.drug_treatment(),
            view_direction=self.random_element(
                ["Top", "Side", "Bottom", "Orthogonal", "Maximum intensity"]
            ),
        )

    def view_description(self):
        """Generate a description for a view within an entry."""
        templates = [
            "This view shows {organelle} distribution visualized with {fluorescent_marker}.",
            "3D reconstruction of {protein} localization relative to {organelle}.",
            "Time point {time_point} showing changes in {cellular_process}.",
            "Z-section {z_number} highlighting {protein} in the {organelle}.",
            "Segmentation of {cell_type} cells with {fluorescent_marker}-labeled {organelle}.",
            "Colocalization analysis between {protein1} and {protein2}.",
            "Comparison of {organelle} before and after {drug_treatment} treatment.",
            "Surface rendering of {organelle} during {cellular_process}.",
            "Slice view showing internal structure of {sample_type}.",
            "Channel {channel_number}: {fluorescent_marker} staining of {protein}.",
        ]

        template = self.random_element(templates)
        return template.format(
            organelle=self.organelle(),
            fluorescent_marker=self.fluorescent_marker(),
            protein=self.protein(),
            protein1=self.protein(),
            protein2=self.protein(),
            time_point=random.randint(1, 24),
            z_number=random.randint(1, 50),
            cellular_process=self.cellular_process(),
            cell_type=self.cell_type(),
            drug_treatment=self.drug_treatment(),
            sample_type=self.sample_type(),
            channel_number=random.randint(1, 4),
        )
