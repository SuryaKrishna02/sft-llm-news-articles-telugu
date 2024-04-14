import os
import pandas as pd
from src.python.sft import DatasetGenerator
from src.utils.sft_constants import FINAL_SCRAPED_DATASET_PATH, SFT_DATASET_PATH

dataset_generator = DatasetGenerator()
scraped_df = pd.read_csv(FINAL_SCRAPED_DATASET_PATH)

sft_df = dataset_generator.create_dataset(
    df=scraped_df
)

dataset_size = len(sft_df)

sft_df.to_csv(SFT_DATASET_PATH, index=False)
csv_file_size_mb = os.path.getsize(SFT_DATASET_PATH) / (1024 ** 2)

print(f"Successfully saved dataset to {SFT_DATASET_PATH}")
print(f"Memory Footprint of the Dataset = {csv_file_size_mb:.2f} MB")
print(f"Size of the Dataset = {dataset_size} Samples")