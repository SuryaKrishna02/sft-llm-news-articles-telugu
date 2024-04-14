import numpy as np
import pandas as pd
from typing import Optional
import matplotlib.pyplot as plt
from dataclasses import dataclass

@dataclass
class QuantileInfo:
    threshold: float
    label_frequency: Optional[int]=5
    label_rotation: Optional[int]=45

snake_to_title_case = lambda string: string.replace('_', ' ').title()

def histogram(df: pd.DataFrame, column: str):
    snake_case_column = snake_to_title_case(column)
    # Get the minimum and maximum values of the column
    min_value = df[column].min()
    max_value = df[column].max()

    if max_value <= 250:
        no_of_bins = int(max_value)
    else:
        no_of_bins = 'auto'

    # Create the histogram
    plt.figure(figsize=(8, 6))
    n, bins, _ = plt.hist(df[column], bins=no_of_bins, rwidth=0.8, alpha=0.8)

    # Find the bin with the highest frequency
    max_freq_index = np.argmax(n)
    max_freq_bin = bins[max_freq_index:max_freq_index+2]

    # Create the text box content
    textstr = f"Min: {min_value:.2f}\nMax: {max_value:.2f}\nHighest Frequency Bin: [{max_freq_bin[0]:.2f}, {max_freq_bin[1]:.2f}]"

    # Add the text box to the plot
    props = dict(boxstyle='round', facecolor='white', alpha=0.5)
    plt.text(0.95, 0.95, textstr, transform=plt.gca().transAxes, fontsize=12,
            verticalalignment='top', horizontalalignment='right', bbox=props)

    # Add labels and title
    plt.xlabel(snake_case_column)
    plt.ylabel('Frequency')
    plt.title(f'Histogram of {snake_case_column}')

    plt.tight_layout()
    plt.show()


def left_right_tail(df: pd.DataFrame, column: str, left_quantile: QuantileInfo, right_quantile: QuantileInfo):
    snake_case_column = snake_to_title_case(column)
    # Calculate percentiles for left and right tails
    left_cutoff = df[column].quantile(left_quantile.threshold)
    right_cutoff = df[column].quantile(right_quantile.threshold)

    # Create subplots
    _, axes = plt.subplots(1, 2, figsize=(10, 4))

    # Plot the left tail
    left_counts = df[column][df[column] <= left_cutoff].value_counts().sort_index()
    left_x = list(range(len(left_counts)))
    if len(left_x) > left_quantile.label_frequency:
        left_x_frequency = left_quantile.label_frequency
    else:
        left_x_frequency = 5
    left_ticks = left_x[::left_x_frequency]  # Display every 5th tick
    left_labels = [str(int(x)) for x in left_counts.index[::left_x_frequency]]  # Display every 5th label
    axes[0].bar(left_x, left_counts, color='#86bf91')
    axes[0].set_title('Left Tail')
    axes[0].set_xlabel(snake_case_column)
    axes[0].set_ylabel('Frequency')
    axes[0].set_xticks(left_ticks)
    axes[0].set_xticklabels(left_labels, rotation=left_quantile.label_rotation)

    # Plot the right tail
    right_counts = df[column][df[column] >= right_cutoff].value_counts().sort_index()
    right_x = list(range(len(right_counts)))
    if len(right_x) > right_quantile.label_frequency:
        right_x_frequency = right_quantile.label_frequency
    else:
        right_x_frequency = 5
    right_ticks = right_x[::right_x_frequency]  # Display every 5th tick
    right_labels = [str(int(x)) for x in right_counts.index[::right_x_frequency]]  # Display every 5th label
    axes[1].bar(right_x, right_counts, color='#007acc')
    axes[1].set_title('Right Tail')
    axes[1].set_xlabel(snake_case_column)
    axes[1].set_ylabel('Frequency')
    axes[1].set_xticks(right_ticks)
    axes[1].set_xticklabels(right_labels, rotation=right_quantile.label_rotation)

    # Adjust layout for better spacing
    plt.tight_layout()

    # Show the plots
    plt.show()