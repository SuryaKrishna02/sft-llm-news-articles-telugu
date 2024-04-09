import pandas as pd
from typing import Tuple
from src.utils.post_processing_constants import INVALID_TITLE_WORDS, CHARACTERS_TO_REMOVE


def check_empty_content_title(df: pd.DataFrame) -> Tuple[list[str], list[str], list[str], list[str]]:
    empty_title_content = list(df[(df["total_content_char"] == 0) & (df["total_title_char"] == 0)]["url"])
    only_empty_content = list(df[(df["total_content_char"] == 0) & (df["total_title_char"] != 0)]["url"])
    only_empty_title = list(df[(df["total_content_char"] != 0) & (df["total_title_char"] == 0)]["url"])
    empty_title_or_content = list(df[(df["total_content_char"] == 0) | (df["total_title_char"] == 0)]["url"])


    print("Total Empty Title & Content: ", len(empty_title_content))
    print("Total only Empty Title: ", len(only_empty_title))
    print("Total only Empty Content: ", len(only_empty_content))
    print("Total Empty Title or Content", len(empty_title_or_content))
    return empty_title_content, only_empty_content, only_empty_title, empty_title_content

def remove_bad_titles_articles(df: pd.DataFrame) -> pd.DataFrame:
    cleaned_df = df.copy()
    cleaned_df = cleaned_df[~cleaned_df['title'].str.contains('|'.join(INVALID_TITLE_WORDS))]

    # Remove the specified characters
    cleaned_df['title'] = cleaned_df['title'].replace(CHARACTERS_TO_REMOVE, '', regex=True)
    cleaned_df['content'] = cleaned_df['content'].replace(CHARACTERS_TO_REMOVE, '', regex=True)

    # 1. If there are more than 1 consecutive commas, make it one comma (Either Title or Content)
    cleaned_df['title'] = cleaned_df['title'].str.replace(',+', ',', regex=True)
    cleaned_df['content'] = cleaned_df['content'].str.replace(',+', ',', regex=True)

    # 2. If there are two periods, make it three periods ( Only in Title)
    cleaned_df['title'] = cleaned_df['title'].str.replace('\.{2}', '...', regex=True)

    # 3. If there are more than three periods, make it three periods. (Only in Title)
    cleaned_df['title'] = cleaned_df['title'].str.replace('\.{4,}', '...', regex=True)

    # 4. If there are more than 1 consecutive period, make it one period (Content)
    cleaned_df['content'] = cleaned_df['content'].str.replace('\.{2,}', '.', regex=True)

    return cleaned_df