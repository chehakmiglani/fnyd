# Task 1: Rating Prediction via Prompting

## Overview
This task implements and evaluates 3 different prompting approaches for classifying Yelp reviews into 1-5 star ratings using the Groq API.

## Dataset
- **Source**: [Yelp Reviews Dataset on Kaggle](https://www.kaggle.com/datasets/omkarsabnis/yelp-reviews-dataset)
- **Sample Size**: ~200 reviews for evaluation
- **Columns Used**: Review text and actual star rating

## Prompting Approaches

### Prompt Version 1: Direct Classification
**Approach**: Simple, direct instruction with minimal context
**Characteristics**:
- Straightforward prompt asking for rating
- Minimal guidance on reasoning
- Fastest inference time
- Baseline for comparison

**Example Format**:
```
Classify the following Yelp review into a rating between 1 and 5 stars.
Review: [review text]
Return ONLY valid JSON...
```

### Prompt Version 2: Chain-of-Thought Reasoning
**Approach**: Multi-step reasoning process
**Characteristics**:
- Asks model to analyze sentiment indicators
- Guides through reasoning steps
- More explicit thought process
- Improved consistency through structured thinking

**Example Format**:
```
Analyze the following Yelp review step by step:
Step 1: Identify sentiment indicators
Step 2: Assess overall satisfaction level
Step 3: Consider specificity and detail
Step 4: Assign rating 1-5
Return ONLY valid JSON...
```

### Prompt Version 3: Few-Shot Learning
**Approach**: Provides examples to guide the model
**Characteristics**:
- Shows 4 example reviews with ratings
- Demonstrates expected format and reasoning
- Leverages in-context learning
- Often produces highest accuracy

**Example Format**:
```
Classify Yelp reviews based on examples:
EXAMPLES:
Review: "Absolutely horrible..." → Rating: 1
Review: "Average restaurant..." → Rating: 2
[More examples...]

Now classify: [review text]
```

## Evaluation Metrics

### 1. JSON Validity Rate
- Percentage of responses with valid JSON structure
- Critical for production reliability
- Measures format compliance

### 2. Accuracy
- Percentage of exact match predictions
- Calculated on valid responses only
- Best-case scenario metric

### 3. Mean Absolute Error (MAE)
- Average difference between predicted and actual ratings
- Measures severity of misclassifications
- Lower is better

### 4. Consistency
- Standard deviation of predictions for same actual rating
- Measures reliability across similar inputs
- Lower std dev = more consistent

## Running the Notebook

### Prerequisites
```bash
# Install dependencies
pip install groq pandas numpy matplotlib seaborn

# Set Groq API key
export GROQ_API_KEY="your_api_key_here"

# Download dataset from Kaggle
kaggle datasets download -d omkarsabnis/yelp-reviews-dataset
```

### Execution
1. Open `rating_prediction.ipynb` in Jupyter
2. Set GROQ_API_KEY environment variable
3. Run cells sequentially
4. Review comparison results and visualizations

## Results

The notebook generates:
- **Comparison table**: Side-by-side metrics for all 3 prompts
- **Visualization**: Bar charts comparing performance metrics
- **CSV exports**: Detailed results for each prompt version
- **Analysis**: Key findings and recommendations

## Key Findings

Typical results show:
- **Few-Shot (V3)**: Best accuracy (~60-75% depending on dataset)
- **Chain-of-Thought (V2)**: Best consistency, good accuracy (~55-70%)
- **Direct (V1)**: Baseline, fastest but lower accuracy (~45-60%)

## Output Files

After running the notebook:
- `prompt_comparison_results.csv` - Summary comparison
- `results_prompt_v1_direct.csv` - V1 detailed results
- `results_prompt_v2_cot.csv` - V2 detailed results
- `results_prompt_v3_fewshot.csv` - V3 detailed results
- `prompt_comparison.png` - Visualization charts

## Design Decisions

1. **Temperature=0.3**: Lower temperature for consistent, focused responses
2. **Max tokens=200**: Sufficient for JSON response without waste
3. **Model**: mixtral-8x7b-32768 for balance of speed and quality
4. **Prompt Engineering**: Each version tests a distinct prompting strategy

## Future Improvements

1. Ensemble approach combining all 3 methods
2. Fine-tuning with domain-specific examples
3. Hybrid prompts combining best aspects of each approach
4. A/B testing with real user feedback
5. Adaptive prompting based on review length/complexity

## References

- [Groq API Documentation](https://console.groq.com)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903)
- [Few-Shot Learning](https://arxiv.org/abs/2005.14165)
