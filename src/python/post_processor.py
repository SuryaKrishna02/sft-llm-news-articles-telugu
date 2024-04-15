import pandas as pd
from typing import Tuple
from dataclasses import dataclass
from src.utils.sft_constants import INVALID_TITLE_WORDS, CHARACTERS_TO_REMOVE

@dataclass
class OutlierWordThreshold:
    """
    A dataclass that holds the minimum and maximum thresholds for article title and content lengths.

    Attributes:
        min_title_length (int): The minimum allowed length for article titles.
        max_title_length (int): The maximum allowed length for article titles.
        min_content_length (int): The minimum allowed length for article content.
        max_content_length (int): The maximum allowed length for article content.
    """
    min_title_length: int
    max_title_length: int
    min_content_length: int
    max_content_length: int


def check_empty_content_title(df: pd.DataFrame) -> Tuple[list[str], list[str], list[str], list[str]]:
    """
    Checks a pandas DataFrame for articles with empty titles and/or empty content, and returns lists of the URLs for each case.

    Args:
        df (pd.DataFrame): The input pandas DataFrame containing article data.

    Returns:
        Tuple[list[str], list[str], list[str], list[str]]:
            - empty_title_content: A list of URLs for articles with both empty titles and empty content.
            - only_empty_content: A list of URLs for articles with only empty content (non-empty titles).
            - only_empty_title: A list of URLs for articles with only empty titles (non-empty content).
            - empty_title_or_content: A list of URLs for articles with either empty titles or empty content.
    """
    # Find articles with both empty titles and empty content
    empty_title_content = list(df[(df["total_content_char"] == 0) & (df["total_title_char"] == 0)]["url"])

    # Find articles with only empty content (non-empty titles)
    only_empty_content = list(df[(df["total_content_char"] == 0) & (df["total_title_char"] != 0)]["url"])

    # Find articles with only empty titles (non-empty content)
    only_empty_title = list(df[(df["total_content_char"] != 0) & (df["total_title_char"] == 0)]["url"])

    # Find articles with either empty titles or empty content
    empty_title_or_content = list(df[(df["total_content_char"] == 0) | (df["total_title_char"] == 0)]["url"])

    # Print the counts for each category
    print("Total Empty Title & Content: ", len(empty_title_content))
    print("Total only Empty Title: ", len(only_empty_title))
    print("Total only Empty Content: ", len(only_empty_content))
    print("Total Empty Title or Content", len(empty_title_or_content))

    return empty_title_content, only_empty_content, only_empty_title, empty_title_or_content

def clean_scraped_df(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans a pandas DataFrame containing article data by performing various text cleaning operations.

    Args:
        df (pd.DataFrame): The input pandas DataFrame containing article data.

    Returns:
        pd.DataFrame: The cleaned pandas DataFrame.
    """
    # Make a copy of the input DataFrame
    cleaned_df = df.copy()

    # Remove articles with invalid title words
    cleaned_df = cleaned_df[~cleaned_df['title'].str.contains('|'.join(INVALID_TITLE_WORDS))]

    # Remove specified characters from title and content
    cleaned_df['title'] = cleaned_df['title'].replace(CHARACTERS_TO_REMOVE, '', regex=True)
    cleaned_df['content'] = cleaned_df['content'].replace(CHARACTERS_TO_REMOVE, '', regex=True)

    # 1. If there are more than 1 consecutive commas, make it one comma (Either Title or Content)
    cleaned_df['title'] = cleaned_df['title'].str.replace(',+', ',', regex=True)
    cleaned_df['content'] = cleaned_df['content'].str.replace(',+', ',', regex=True)

    # 2. If there are two periods, make it three periods (Only in Title)
    cleaned_df['title'] = cleaned_df['title'].str.replace('\.{2}', '...', regex=True)

    # 3. If there are more than three periods, make it three periods (Only in Title)
    cleaned_df['title'] = cleaned_df['title'].str.replace('\.{4,}', '...', regex=True)

    # 4. If there are more than 1 consecutive period, make it one period (Content)
    cleaned_df['content'] = cleaned_df['content'].str.replace('\.{2,}', '.', regex=True)

    # Calculate the total number of characters
    cleaned_df['total_title_char'] = cleaned_df['title'].str.len()
    cleaned_df['total_content_char'] = cleaned_df['content'].str.len()

    # Calculate the number of words
    cleaned_df['total_title_words'] = cleaned_df['title'].str.split().str.len()
    cleaned_df['total_content_words'] = cleaned_df['content'].str.split().str.len()

    return cleaned_df

def remove_outliers(df: pd.DataFrame, threshold: OutlierWordThreshold) -> pd.DataFrame:
    """
    Filters a DataFrame by removing rows that have title or content word counts
    outside of the specified thresholds.

    Args:
        df (pd.DataFrame): The input DataFrame to be filtered.
        threshold (OutlierWordThreshold): An object containing the minimum and
            maximum thresholds for title and content word counts.

    Returns:
        pd.DataFrame: The filtered DataFrame with rows removed that exceed the
            specified thresholds.
    """
    # Filter the DataFrame to only include rows where the title and content
    # word counts are within the specified thresholds
    filtered_df = df[(df['total_title_words'] >= threshold.min_title_length) &
                     (df['total_title_words'] <= threshold.max_title_length) &
                     (df['total_content_words'] >= threshold.min_content_length) &
                     (df['total_content_words'] <= threshold.max_content_length)]

    # Return the filtered DataFrame
    return filtered_df