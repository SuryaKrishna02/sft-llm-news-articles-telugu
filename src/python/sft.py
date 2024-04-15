import random 
import pandas as pd
from tqdm import tqdm

"""
Templates used in the DatasetGenerator
Type 1 Headline Generation
prompt:
Write a headline for the following news article: 
{{article}}

completion:
A suitable headline for the given news article would be {{headline}}.


Type 2 Article Generation:
prompt:
Write a news article with the following headline: 
{{headline}}

completion:
{{article}}
"""
class DatasetGenerator:
    """
    A class that generates a dataset for a text generation task.

    Attributes:
        random_state (int): The random state used for generating random choices.
        random_word (function): A function that randomly selects a word from a given list.
        news_article_type1_options (list): A list of options for the news article type1.
        news_article_type2_options (list): A list of options for the news article type2.
        title_type1_options (list): A list of options for the title type1.
        title_type2_options (list): A list of options for the title type2.
        start_options (list): A list of options for the start of the prompt.
        end_options (list): A list of options for the end of the prompt.
        suitable_options (list): A list of options for the suitable word.

    Methods:
        generate_prompt_type1(article: str) -> str:
            Generates a prompt for type1 data.

        generate_completion_type1(title: str) -> str:
            Generates a completion for type1 data.

        generate_prompt_type2(title: str) -> str:
            Generates a prompt for type2 data.

        generate_completion_type2(article: str) -> str:
            Generates a completion for type2 data.

        create_dataset(df: pd.DataFrame) -> pd.DataFrame:
            Creates a dataset with prompts and completions.
    """
    def __init__(self, random_state:int=442):
        """
        Initializes the DatasetGenerator class.

        Args:
            random_state (int): The random state used for generating random choices.
        """
        self.random_state = random_state
        self.random_word = lambda word_list: random.choice(word_list)
        self.news_article_type1_options = ["వార్తా కథనానికి", "న్యూస్ ఆర్టికల్ కి", "న్యూస్ కథనానికి"]
        self.news_article_type2_options = ["వార్తా కథనాన్ని", "న్యూస్ ఆర్టికల్ ని", "న్యూస్ కథనాన్ని"]
        self.title_type1_options = ["శీర్షికను", "టైటిల్ ను", "హెడ్లైన్ ను"]
        self.title_type2_options = ["శీర్షికతో", "టైటిల్ తో", "హెడ్లైన్ తో"]
        self.start_options = ["క్రింది", "కింది", "ఇవ్వబడిన", "ఇచ్చిన"]
        self.end_options = ["వ్రాయండి", "ఇవ్వండి", "రాయండి"]
        self.suitable_options = ["సరిపోయే", "తగిన", "అనువైన"]

    def generate_prompt_type1(self, article: str) -> str:
        """
        Generates a prompt for type1 data.

        Args:
            article (str): The article content.

        Returns:
            str: The generated prompt.
        """
        start = self.random_word(self.start_options)
        news_article = self.random_word(self.news_article_type1_options)
        title_word = self.random_word(self.title_type1_options)
        end = self.random_word(self.end_options)
        prompt = f"{start} {news_article} {title_word} {end}:\n{article}"
        return prompt

    def generate_completion_type1(self, title:str) -> str:
        """
        Generates a completion for type1 data.

        Args:
            title (str): The title of the article.

        Returns:
            str: The generated completion.
        """
        start = self.random_word(["ఇచ్చిన", "ఇవ్వబడిన"])
        news_article = self.random_word(self.news_article_type1_options)
        suitable = self.random_word(self.suitable_options)
        title_word  = self.random_word(["శీర్షిక", "టైటిల్", "హెడ్లైన్"])
        completion = f"{start} {news_article} {suitable} {title_word} '{title}'."
        return completion

    def generate_prompt_type2(self, title:str) -> str:
        """
        Generates a prompt for type2 data.

        Args:
            article (str): The title of the article.

        Returns:
            str: The generated completion.
        """
        start = self.random_word(self.start_options)
        title_word = self.random_word(self.title_type2_options)
        news_article = self.random_word(self.news_article_type2_options)
        end = self.random_word(self.end_options)
        prompt = f"{start} {title_word} {news_article} {end}:\n{title}"
        return prompt

    def generate_completion_type2(self, article: str) -> str:
        """
        Generates a completion for type2 data.

        Args:
            article (str): The article content.

        Returns:
            str: The generated completion.
        """
        return article

    def create_dataset(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Creates a dataset with prompts and completions.

        Args:
            df (pd.DataFrame): The input DataFrame containing the article content and titles.

        Returns:
            pd.DataFrame: The generated dataset with prompts and completions.
        """
        type1_df = pd.DataFrame()
        type2_df = pd.DataFrame()

        with tqdm(total=4, unit="step") as progress_bar:
            # Generate prompts and completions for type1 data
            type1_df["inputs"] = df["content"].apply(self.generate_prompt_type1)
            progress_bar.update(1)
            type1_df["targets"] = df["title"].apply(self.generate_completion_type1)
            progress_bar.update(1)

            # Generate prompts and completions for type2 data
            type2_df["inputs"] = df["title"].apply(self.generate_prompt_type2)
            progress_bar.update(1)
            type2_df["targets"] = df["content"].apply(self.generate_completion_type2)
            progress_bar.update(1)

        # Concatenate the type1 and type2 datasets
        concatenated_df = pd.concat([type1_df, type2_df], axis=0, ignore_index=True)

        # Shuffle the dataset
        sft_df = concatenated_df.sample(frac=1.0, random_state=self.random_state).reset_index(drop=True)

        return sft_df