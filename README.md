# Maths-Automatic
Maths-Automatic is a web application built with Flask that allows users to input mathematical expressions using various methods, including a drawing board, speech input, or a math keyboard. The application utilizes the <a href = "https://github.com/carolreis/mathreader">mathreader</a> library to recognize handwritten math equations entered on the drawing board.

Additionally, Maths-Automatic provides step-by-step solutions to user queries using the Wolfram Alpha API. Users are required to provide their Wolfram Alpha API key in the `main.py` file:

```python
app.config['WOLFRAMALPHA_APP_ID'] = "your_wolfram_alpha_api_key"
```

## Installation
Follow these steps to set up the project on your local machine:

1. . Clone the repository:
    ```bash
    git clone https://github.com/your-username/Maths-Automatic.git
    ```

2. Navigate to the project directory:
    ```bash
    cd Maths-Automatic
    ```

3. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Update the Wolfram Alpha API key in main.py:
  ``` python
  app.config['WOLFRAMALPHA_APP_ID'] = "your_wolfram_alpha_api_key"
  ```
   

5. Run the application:
    ```bash
    python main.py
    ```

# Usage
* Open the application in your web browser.
* Choose one of the input methods: drawing board, speech, or math keyboard.
* Enter your mathematical expression using the selected input method.

# Features
* Drawing board input for handwritten equations.
* Speech input for hands-free interaction.
* Math keyboard for conventional input.
* Step-by-step solutions provided using the Wolfram Alpha API.
* Utilizes the <a href = "https://github.com/carolreis/mathreader">mathreader</a> library for handwritten equation recognitio

# Contact
If you have any questions or concerns, feel free to reach out to Rohan D V at rohandv30052000@gmail.com.
