import pandas as pd
import matplotlib.pyplot as plt

def histogram(df: pd.DataFrame, column: str):
    # Create the histogram
    n, bins, _ = plt.hist(df[column], bins='auto', rwidth=0.8, color='#86bf91', alpha=0.7)

    # Find the bin with the highest count
    max_count_index = n.argmax()
    max_count = n[max_count_index]
    max_count_bin_range = f"{bins[max_count_index]:.2f} - {bins[max_count_index+1]:.2f}"

    # Find the maximum and minimum values of total_content_words
    max_value = df[column].max()
    min_value = df[column].min()

    # Add the text box at the top right
    text_box_content = f"Highest Count: {max_count}\n Bin Range: {max_count_bin_range}\n\nMax Words: {max_value}\nMin Words: {min_value}"
    plt.text(0.95, 0.95, text_box_content,
            transform=plt.gca().transAxes, fontsize=10, verticalalignment='top',
            horizontalalignment='right', bbox=dict(facecolor='white', alpha=0.8))

    # Show the plot
    plt.show()


def left_right_tail(df: pd.DataFrame, column: str, left: float, right: float):
    # Calculate percentiles for left and right tails
    left_cutoff = df[column].quantile(left)
    right_cutoff = df[column].quantile(right)

    # Create subplots
    _, axes = plt.subplots(1, 2, figsize=(10, 4))

    # Plot the left tail
    df[column][df[column] <= left_cutoff].value_counts().sort_index().plot(kind='bar', color='#86bf91', ax=axes[0])
    axes[0].set_title('Left Tail')
    axes[0].set_xlabel(column)
    axes[0].set_ylabel('Frequency')

    # Plot the right tail
    df[column][df[column] >= right_cutoff].value_counts().sort_index().plot(kind='bar', color='#007acc', ax=axes[1])
    axes[1].set_title('Right Tail')
    axes[1].set_xlabel(column)
    axes[1].set_ylabel('Frequency')

    # Adjust layout for better spacing
    plt.tight_layout()

    # Show the plots
    plt.show()