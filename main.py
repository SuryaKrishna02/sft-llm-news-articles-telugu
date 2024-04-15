import os
import pandas as pd
from src.python.sft import DatasetGenerator
from src.utils.sft_constants import FINAL_SCRAPED_DATASET_PATH, SFT_DATASET_PATH

# Create an instance of the DatasetGenerator class
dataset_generator = DatasetGenerator()

# Read the final scraped dataset from a CSV file
scraped_df = pd.read_csv(FINAL_SCRAPED_DATASET_PATH)

# Create a new dataset using the create_dataset method of the DatasetGenerator class
sft_df = dataset_generator.create_dataset(
    df=scraped_df
)

# Get the size of the created dataset
dataset_size = len(sft_df)

# Save the created dataset to a CSV file
sft_df.to_csv(SFT_DATASET_PATH, index=False)

# Calculate the size of the saved CSV file in megabytes
csv_file_size_mb = os.path.getsize(SFT_DATASET_PATH) / (1024 ** 2)

# Print success message and dataset information
print(f"Successfully saved dataset to {SFT_DATASET_PATH}")
print(f"Memory Footprint of the Dataset = {csv_file_size_mb:.2f} MB")
print(f"Size of the Dataset = {dataset_size} Samples")