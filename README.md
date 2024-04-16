# SFT LLM News Articles Telugu
This repository contains a collection of Python, Node.js, and Jupyter Notebook files for the creation of Telugu News articles Instruct-Style dataset for the puporse of supervised fine-tuning of Large Language Model (LLM). <br>

Telugu News Articles dataset is created using the code in this repository and opensourced as HuggingFace Datasets under Apache 2.0 Licence. You can access the dataset here: [aya-telugu-news-articles](https://huggingface.co/datasets/SuryaKrishna02/aya-telugu-news-articles). <br>

The repository is beneficial for users who wants to:
- **Reproduce** the Telugu News Articles dataset creation workflow.
- **Extend** the existing Telugu News Articles dataset.
- **Integrate** the parts of Telugu News Articles dataset creation workflow into their own dataset creation workflow.

**Note:** Scraping copyrighted website without permission is unethical and not advisable. Please check the terms and conditions of scraping a website before proceeding with the workflow.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Repository Structure](#repository-structure)
- [Contributing](#contributing)
- [License](#license)
- [Citation](#citation)

## Installation
### Python

Make sure you have Python version 3.9.13 or higher installed. You can check your Python version by running:

```bash
python --version
```

If you don't have Python installed or have an older version, you can download the latest version from the official Python website: [https://www.python.org](https://www.python.org)

#### Virtual Environment

It is recommended to create a virtual environment to isolate the project dependencies. To create a virtual environment, run:

```bash
python -m venv venv
```

Activate the virtual environment:

- For Windows:
  ```bash
  venv\Scripts\activate
  ```

- For macOS and Linux:
  ```bash
  source venv/bin/activate
  ```

#### Dependencies

To install the required dependencies for the Python files in the virtual environment, run:

```bash
pip install -r requirements.txt
```

### Node.js

Make sure you have Node.js version 18.13.0 or higher installed. You can check your Node.js version by running:

```bash
node --version
```

If you don't have Node.js installed or have an older version, you can download the latest version from the official Node.js website: [https://nodejs.org](https://nodejs.org)

To install the required dependencies for the Node.js files, run:

```bash
npm install
```

## Usage
The workflow for the dataset creation consists of following three steps which needs to performed sequentially.
### 1. Scraping
- Edit the `src/utils/scraper-constants.js` file according to your specifications like timeout, links to be scraped etc.
- To scrape the content specified in previous step, run:
    ```bash
    node index.js
    ```
- After successful execution, you can find the scraped content JSON file located in the `SCRAPED_CONTENT_FILE_PATH` mentioned in `scraper-constants.js` file.
### 2. Exploratory Data Analysis
- Edit the `src/utils/sft_constants.py` file according to your specifications.
- Run the `notebooks/exploratory_data_analysis.ipynb` notebook.
- The notebook has detailed steps which performs exploratory data analysis, dataset cleaning and removal of outliers.
- After successful execution of notebook, you can find the cleaned scraped content csv file located in `FINAL_SCRAPED_DATASET_PATH` mentioned in `sft_constants.py`.

### 3. SFT Dataset Creation
- Edit the `src/utils/sft_constants.py` file according to your specifications.
- To create the Instruct-Style sft dataset from the scraped content, run:
    ```bash
    python main.py
    ```
- After successful execution, you can find the final sft dataset with prompts and completions located in `SFT_DATASET_PATH` mentioned in `sft_constants.py`.

## Repository Structure

The repository has the following structure:

```
├── src/
│   ├── python/
│   │   ├── sft.py
│   │   ├── post_processor.py
│   │   └── ...
│   ├── nodejs/
│   │   ├── content-scraper.js
│   │   ├── links-scraper.js
│   │   └── ...
│   ├── data/
│   │   ├── content/tmp
│   │   └── links/
│   └── utils/
│       ├── scraper-constants.js
│       └── sft_constants.py
├── notebooks/
│   └── exploratory_data_analysis.ipynb
├── index.js
├── main.py
├── requirements.txt
├── package.json
└── README.md
```

- The `src/` directory contains the main source code files.
  - The `python/` directory contains the Python files.
  - The `nodejs/` directory contains the Node.js files.
  - The `data/` directory contains data files.
    - The `content/` directory contains content-related data files.
    - The `links/` directory contains link-related data files.
  - The `utils/` directory contains utility files for both python and nodejs.
- The `notebooks/` directory contains the notebook to do exploratory data analysis.
- The `main.py` file creates the instruct-style sft dataset.
- The `index.js` file scrapes the content from the website.
- The `requirements.txt` file lists the Python dependencies.
- The `package.json` file lists the Node.js dependencies.

## Contributing

Contributions to this project are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

When contributing, please follow the existing code style and conventions used in the project.

## License

This project is licensed under the [MIT License](LICENSE).

## Citation
If you use this code in your work, please cite it as follows:
```bibtex
    @software{Guthikonda_SFT_LLM_News_2024,
    author = {Guthikonda, Surya},
    month = apr,
    title = {{SFT LLM News Articles Telugu}},
    url = {https://github.com/SuryaKrishna02/sft-llm-news-articles-telugu},
    version = {1.0.0},
    year = {2024}
    }
```